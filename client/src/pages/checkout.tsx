import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Paddle types
declare global {
  interface Window {
    Paddle: any;
  }
}

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Mock cart data - replace with real cart data
  const cartItems = [
    {
      id: "1",
      title: "Modern Dashboard UI Kit",
      price: 29.00,
      priceId: "pri_01hv8gybxvh8j2t3nq8y3ybsxw", // Replace with actual Paddle price ID
      quantity: 1,
    },
    {
      id: "2", 
      title: "Cinematic Background Music",
      price: 19.00,
      priceId: "pri_01hv8gybxvh8j2t3nq8y3ybsxy", // Replace with actual Paddle price ID
      quantity: 1,
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Paddle handles tax automatically

  useEffect(() => {
    // Load Paddle.js
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Setup({ 
          vendor: import.meta.env.VITE_PADDLE_VENDOR_ID || '',
          eventCallback: function(data: any) {
            if (data.event === 'Checkout.Complete') {
              toast({
                title: "Payment Successful!",
                description: "Your purchase has been completed successfully.",
              });
              setLocation('/');
            }
          }
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePaddleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/create-paddle-checkout', {
        items: cartItems.map(item => ({
          priceId: item.priceId,
          quantity: item.quantity
        })),
        userId: 'user_123' // Replace with actual user ID
      });
      
      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirect to Paddle checkout
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center text-blue-800 mb-2">
                    <i className="fas fa-shield-alt mr-2"></i>
                    <span className="font-medium">Secure Payment with Paddle</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Your payment is processed securely by Paddle. We don't store your payment information.
                  </p>
                </div>

                <Button
                  onClick={handlePaddleCheckout}
                  disabled={isLoading}
                  className="w-full py-4 text-lg"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card mr-2"></i>
                      Complete Payment - ${total.toFixed(2)}
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <p>By completing your purchase, you agree to our</p>
                  <div className="space-x-2">
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>
                    <span>and</span>
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}