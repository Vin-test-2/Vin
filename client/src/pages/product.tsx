import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { ShoppingCart, Download, Star, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      // TODO: Implement add to cart functionality
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/browse">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/browse" className="hover:text-primary">Browse</Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden">
              <img
                src={product.thumbnailUrl || "/placeholder-product.jpg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Preview Button */}
            {product.previewUrl && (
              <Button variant="outline" className="w-full" size="lg">
                <i className="fas fa-play mr-2"></i>
                Preview
              </Button>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(Number(product.rating) || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.ratingCount || 0} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {product.downloadCount || 0} downloads
                </span>
              </div>
              
              {product.description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator />

            {/* Product Info */}
            <div className="space-y-3">
              {product.fileFormat && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">{product.fileFormat}</span>
                </div>
              )}
              {product.fileSize && (
                <div className="flex justify-between">
                  <span className="text-gray-600">File Size:</span>
                  <span className="font-medium">{product.fileSize}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Price and Actions */}
            <div className="space-y-4">
              <div className="text-4xl font-bold text-gray-900">
                ${product.price}
              </div>
              
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" size="lg">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center text-blue-800">
                  <i className="fas fa-shield-alt mr-2"></i>
                  <span className="font-medium">License Information</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  Standard license included. Commercial use allowed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TODO: Implement related products */}
            <div className="text-center py-8 text-gray-500">
              Related products will be shown here
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
