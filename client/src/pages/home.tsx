import Hero from "@/components/hero";
import CategoryNav from "@/components/category-nav";
import ProductCard from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Link } from "wouter";

export default function Home() {
  const { data: featuredProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <CategoryNav />
      
      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collections</h2>
            <p className="text-xl text-gray-600">Hand-picked premium assets from top creators</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Collections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending This Week</h2>
            <p className="text-xl text-gray-600">Most popular assets chosen by our community</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <i className="fas fa-fire text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">UI Design Kits</h3>
                  <p className="text-gray-600">↗ 23% this week</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">Complete interface design systems for modern applications</p>
              <a href="/browse/ui-ux-kits" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Explore Collection <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                  <i className="fas fa-chart-line text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Video Templates</h3>
                  <p className="text-gray-600">↗ 18% this week</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">Professional video templates for marketing and presentations</p>
              <a href="/browse/video-templates" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors">
                Explore Collection <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <i className="fas fa-music text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Audio Packs</h3>
                  <p className="text-gray-600">↗ 31% this week</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">High-quality music and sound effects for content creators</p>
              <a href="/browse/audio-music" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                Explore Collection <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Creative Plan</h2>
            <p className="text-xl text-gray-600">Unlimited access to premium digital assets</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                <p className="text-gray-600">per month</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span>3 downloads per month</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span>Standard quality assets</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span>Basic support</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <i className="fas fa-times mr-3"></i>
                  <span>Premium collections</span>
                </li>
              </ul>
              <Link href="/auth">
                <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  Get Started Free
                </button>
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-primary text-white rounded-2xl p-8 relative overflow-hidden transform scale-105">
              <div className="absolute top-4 right-4 bg-accent text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">$29</div>
                <p className="text-indigo-200">per month</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-400 mr-3"></i>
                  <span>Unlimited downloads</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-400 mr-3"></i>
                  <span>All premium collections</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-400 mr-3"></i>
                  <span>Commercial license</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-400 mr-3"></i>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/checkout">
                <button className="w-full bg-white text-primary py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Start Pro Trial
                </button>
              </Link>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$99</div>
                <p className="text-gray-600">per month</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span>Team collaboration tools</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span>Custom branding</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span>Dedicated support</span>
                </li>
              </ul>
              <a href="mailto:sales@vividenstudio.com">
                <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                  Contact Sales
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
