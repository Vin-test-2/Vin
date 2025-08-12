import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCategorySchema, insertProductSchema, insertCartItemSchema } from "@shared/schema";
import { z } from "zod";
import { Environment, Paddle } from '@paddle/paddle-node-sdk';

// Initialize Paddle
const paddle = new Paddle(process.env.PADDLE_API_KEY || '', {
  environment: process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const {
        categoryId,
        featured,
        limit = "50",
        offset = "0",
        search
      } = req.query;

      const products = await storage.getProducts({
        categoryId: categoryId as string,
        featured: featured === "true",
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        search: search as string
      });

      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await storage.getFeaturedProducts(limit);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const { q: query, category } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      
      const products = await storage.searchProducts(
        query as string,
        category as string
      );
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.userId);
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/cart/:userId/:productId", async (req, res) => {
    try {
      await storage.removeFromCart(req.params.userId, req.params.productId);
      res.json({ message: "Item removed from cart" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Paddle payment routes
  app.post("/api/create-paddle-checkout", async (req, res) => {
    try {
      const { items } = req.body;
      
      const checkout = await paddle.checkouts.create({
        items: items.map((item: any) => ({
          priceId: item.priceId,
          quantity: item.quantity || 1
        })),
        discountId: req.body.discountId,
        customData: {
          userId: req.body.userId || 'guest'
        }
      });
      
      res.json({ checkoutUrl: checkout.url });
    } catch (error: any) {
      console.error('Paddle checkout error:', error);
      res.status(500).json({ message: "Error creating checkout: " + error.message });
    }
  });

  // Paddle webhook handler
  app.post('/api/paddle/webhook', async (req, res) => {
    try {
      // Verify webhook signature (implement based on Paddle docs)
      const event = req.body;
      
      switch (event.event_type) {
        case 'transaction.completed':
          // Handle successful payment
          const transaction = event.data;
          // Update user subscription status, create order, etc.
          break;
        case 'subscription.created':
          // Handle new subscription
          break;
        case 'subscription.updated':
          // Handle subscription updates
          break;
        default:
          console.log('Unhandled webhook event:', event.event_type);
      }
      
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Initialize with sample data
  app.post("/api/seed", async (req, res) => {
    try {
      // Create categories
      const audioCategory = await storage.createCategory({
        name: "Audio & Music",
        slug: "audio-music",
        description: "High-quality audio files, music tracks, and sound effects",
        icon: "fas fa-music"
      });

      const videoCategory = await storage.createCategory({
        name: "Video Templates",
        slug: "video-templates",
        description: "Professional video templates and motion graphics",
        icon: "fas fa-video"
      });

      const uiCategory = await storage.createCategory({
        name: "UI/UX Kits",
        slug: "ui-ux-kits",
        description: "Complete interface design systems and UI components",
        icon: "fas fa-layer-group"
      });

      const ebookCategory = await storage.createCategory({
        name: "eBooks & Guides",
        slug: "ebooks-guides",
        description: "Digital books and comprehensive design guides",
        icon: "fas fa-book"
      });

      const sfxCategory = await storage.createCategory({
        name: "Sound Effects",
        slug: "sound-effects",
        description: "Professional sound effects for any project",
        icon: "fas fa-volume-up"
      });

      const psdCategory = await storage.createCategory({
        name: "PSD Templates",
        slug: "psd-templates",
        description: "Layered Photoshop templates and design files",
        icon: "fas fa-file-image"
      });

      // Create sample admin user
      const adminUser = await storage.createUser({
        username: "admin",
        email: "admin@vividenstudio.com",
        password: "admin123",
        firstName: "Admin",
        lastName: "User",
        isAdmin: true
      });

      // Create featured products
      const featuredProducts = [
        {
          title: "Modern Dashboard UI Kit",
          description: "Complete admin dashboard with 50+ screens",
          price: "29.00",
          categoryId: uiCategory.id,
          authorId: adminUser.id,
          thumbnailUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          isFeatured: true,
          tags: ["ui", "dashboard", "admin", "modern"],
          fileFormat: "Figma, Sketch"
        },
        {
          title: "Corporate Intro Template",
          description: "Professional business presentation intro",
          price: "45.00",
          categoryId: videoCategory.id,
          authorId: adminUser.id,
          thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          isFeatured: true,
          tags: ["video", "corporate", "intro", "business"],
          fileFormat: "After Effects"
        },
        {
          title: "Cinematic Background Music",
          description: "Epic orchestral soundtrack for videos",
          price: "19.00",
          categoryId: audioCategory.id,
          authorId: adminUser.id,
          thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          isFeatured: true,
          tags: ["music", "cinematic", "orchestral", "background"],
          fileFormat: "MP3, WAV"
        },
        {
          title: "Complete Design Guide",
          description: "150-page comprehensive design manual",
          price: "35.00",
          categoryId: ebookCategory.id,
          authorId: adminUser.id,
          thumbnailUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          isFeatured: true,
          tags: ["ebook", "design", "guide", "manual"],
          fileFormat: "PDF"
        }
      ];

      for (const productData of featuredProducts) {
        await storage.createProduct(productData);
      }

      res.json({ message: "Database seeded successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
