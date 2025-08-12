import { 
  users, categories, products, cartItems, orders, orderItems, downloads,
  type User, type InsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type CartItem, type InsertCartItem,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type Download, type InsertDownload
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, inArray, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPaddleInfo(id: string, customerId: string, subscriptionId: string): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(options?: { categoryId?: string; featured?: boolean; limit?: number; offset?: number; search?: string }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  searchProducts(query: string, categoryId?: string): Promise<Product[]>;

  // Cart
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  removeFromCart(userId: string, productId: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;

  // Downloads
  recordDownload(download: InsertDownload): Promise<Download>;
  getUserDownloads(userId: string): Promise<Download[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPaddleInfo(id: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ paddleCustomerId: customerId, paddleSubscriptionId: subscriptionId })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async getProducts(options: { categoryId?: string; featured?: boolean; limit?: number; offset?: number; search?: string } = {}): Promise<Product[]> {
    const { categoryId, featured, limit = 50, offset = 0, search } = options;
    
    const conditions = [eq(products.isActive, true)];
    
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }
    
    if (featured) {
      conditions.push(eq(products.isFeatured, true));
    }
    
    if (search) {
      conditions.push(
        sql`${products.title} ILIKE ${`%${search}%`} OR ${products.description} ILIKE ${`%${search}%`}`
      );
    }
    
    return await db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
      .orderBy(desc(products.createdAt));
  }

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  }

  async searchProducts(query: string, categoryId?: string): Promise<Product[]> {
    const conditions = [
      eq(products.isActive, true),
      sql`${products.title} ILIKE ${`%${query}%`} OR ${products.description} ILIKE ${`%${query}%`}`
    ];
    
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }
    
    return await db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt));
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db.insert(cartItems).values(item).returning();
    return cartItem;
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    await db.delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(item).returning();
    return orderItem;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async recordDownload(download: InsertDownload): Promise<Download> {
    const [newDownload] = await db.insert(downloads).values(download).returning();
    return newDownload;
  }

  async getUserDownloads(userId: string): Promise<Download[]> {
    return await db.select().from(downloads)
      .where(eq(downloads.userId, userId))
      .orderBy(desc(downloads.downloadedAt));
  }
}

export const storage = new DatabaseStorage();
