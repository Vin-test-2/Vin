import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

interface SearchBarProps {
  onSearch: (query: string) => void;
  showCategories?: boolean;
  defaultCategory?: string;
}

export default function SearchBar({ onSearch, showCategories = false, defaultCategory }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(defaultCategory || "all");
  const [location, setLocation] = useLocation();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (query.trim()) {
      // Navigate to browse page with search query
      const params = new URLSearchParams();
      params.set("q", query);
      if (category && category !== "all") {
        params.set("category", category);
      }
      setLocation(`/browse?${params.toString()}`);
    }
    
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search millions of creative assets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
        />
      </div>
      
      {/* Category Filter */}
      {showCategories && (
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48 py-4 border border-gray-200 rounded-xl">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Search Button */}
      <Button
        type="submit"
        className="bg-primary hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold"
      >
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
