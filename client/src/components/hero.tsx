import SearchBar from "./search-bar";
import { useState } from "react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="pt-20 pb-16 hero-gradient text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Everything Creative,<br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              All in One Place
            </span>
          </h1>
          
          {/* Tagline Options */}
          <div className="mb-8">
            <p className="text-xl md:text-2xl text-white/90 mb-2 font-light">
              Premium digital assets for creators who demand excellence
            </p>
            <p className="text-lg text-white/75">
              Audio • Video • UI Kits • eBooks • Music • SFX • Templates
            </p>
          </div>
          
          {/* Advanced Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="search-container rounded-2xl p-6 shadow-2xl bg-white/95 backdrop-blur-md">
              <SearchBar onSearch={setSearchQuery} showCategories={true} />
              
              {/* Popular Searches */}
              <div className="mt-4 text-left">
                <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">UI Kit</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">Logo Templates</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">Background Music</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">Video Intro</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">Sound Effects</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Premium Assets</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">25K+</div>
              <div className="text-white/80">Happy Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-white/80">New Daily</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
