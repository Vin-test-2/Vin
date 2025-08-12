import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const parentCategories = categories.filter(cat => !cat.parentId);

  return (
    <nav className="bg-white/95 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <i className="fas fa-cube text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Vividen <span className="text-primary">Studio</span>
              </h1>
              <p className="text-xs text-gray-500 leading-3">Creative Assets Unlimited</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[400px] p-6">
                        <div className="grid grid-cols-2 gap-4">
                          {parentCategories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/browse/${category.slug}`}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <i className={`${category.icon} text-primary`}></i>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{category.name}</div>
                                <div className="text-sm text-gray-500">
                                  {/* TODO: Add product counts */}
                                  Explore collection
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link
                href="/browse"
                className={`text-gray-700 hover:text-primary font-medium transition-colors ${
                  location.startsWith('/browse') ? 'text-primary' : ''
                }`}
              >
                Categories
              </Link>
              <a href="#pricing" className="text-gray-700 hover:text-primary font-medium transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary font-medium transition-colors">
                About
              </a>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Mobile */}
            {isMobile && (
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </Link>

            {/* User Menu */}
            <Link href="/auth">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </Link>

            {/* Sign Up Button - Desktop */}
            {!isMobile && (
              <Link href="/auth">
                <Button className="bg-primary text-white hover:bg-indigo-700">
                  Sign Up Free
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link
                href="/browse"
                className="block text-gray-700 hover:text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse All
              </Link>
              
              {parentCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/browse/${category.slug}`}
                  className="flex items-center space-x-3 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={`${category.icon} text-primary w-5`}></i>
                  <span className="text-gray-700">{category.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <Link href="/auth">
                  <Button className="w-full bg-primary text-white">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
