import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

export default function Footer() {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const parentCategories = categories.filter(cat => !cat.parentId);

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <i className="fas fa-cube text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold">Vividen <span className="text-primary">Studio</span></h3>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Premium digital assets for creators who demand excellence. Everything creative, all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
          
          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {parentCategories.map((category) => (
                <li key={category.id}>
                  <Link href={`/browse/${category.slug}`}>
                    <span className="text-gray-400 hover:text-white transition-colors">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Licensing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Get the latest assets and updates delivered to your inbox.</p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-l-lg"
              />
              <Button className="bg-primary hover:bg-indigo-700 px-4 py-2 rounded-r-lg rounded-l-none">
                <i className="fas fa-paper-plane"></i>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2024 Vividen Studio. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
