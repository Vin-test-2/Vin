import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Link } from "wouter";

export default function CategoryNav() {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const parentCategories = categories.filter(cat => !cat.parentId);

  return (
    <section className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {parentCategories.map((category) => (
            <Link
              key={category.id}
              href={`/browse/${category.slug}`}
              className="text-center group cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <i className={`${category.icon} text-white text-xl`}></i>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {/* TODO: Get actual counts from database */}
                12,450 items
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
