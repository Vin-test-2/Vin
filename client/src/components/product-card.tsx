import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      // TODO: Implement add to cart API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="product-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <div className="relative">
          <img
            src={product.thumbnailUrl || "/placeholder-product.jpg"}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          {product.isFeatured && (
            <Badge className="absolute top-3 left-3 bg-primary">Featured</Badge>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.fileFormat || "Digital"}
            </Badge>
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-gray-600 text-sm">
                {Number(product.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>
          
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {product.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              ${product.price}
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-primary hover:bg-indigo-700"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
