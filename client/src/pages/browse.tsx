import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Browse() {
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { category, search: searchQuery }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) {
        const selectedCategory = categories.find(cat => cat.slug === category);
        if (selectedCategory) {
          params.append("categoryId", selectedCategory.id);
        }
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
    enabled: categories.length > 0,
  });

  const currentCategory = categories.find(cat => cat.slug === category);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {currentCategory?.name || "All Products"}
          </h1>
          {currentCategory?.description && (
            <p className="text-xl text-gray-600">{currentCategory.description}</p>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <div className="flex gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} results
            {searchQuery && ` for "${searchQuery}"`}
            {currentCategory && ` in ${currentCategory.name}`}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse different categories
            </p>
            <Button onClick={() => setSearchQuery("")} variant="outline">
              Clear Search
            </Button>
          </div>
        )}

        {/* Load More */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
