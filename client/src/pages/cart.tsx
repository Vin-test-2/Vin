import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock cart data - replace with real data from API
const mockCartItems = [
  {
    id: "1",
    title: "Modern Dashboard UI Kit",
    price: 29.00,
    thumbnailUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    quantity: 1,
  },
  {
    id: "2",
    title: "Cinematic Background Music",
    price: 19.00,
    thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    quantity: 1,
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const { toast } = useToast();

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Product has been removed from your cart",
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Discover amazing digital assets and start building your collection
            </p>
            <Link href="/browse">
              <Button size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-x">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <div className="text-center">
                  <Link href="/browse">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center text-green-800">
                    <i className="fas fa-shield-alt mr-2"></i>
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <p className="text-green-700 text-xs mt-1">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
