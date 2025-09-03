"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import callApi from "@/utils/callApi";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import Loading from "@/components/Loading";
import CustomerProductCard from "@/components/CustomerProductCard";
import { useUser } from "@/context/userContext";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    outOfStock: boolean;
}

export default function Home() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { isLoggedIn } = useUser();

  useEffect(() => {
      const fetchProducts = async () => {
          try {
              setLoading(true);
              setError("");
              const response = await callApi("GET", "/products");
              if (response.message === "Server error") {
                  setError("Failed to fetch products");
                  return;
              }
              setProductsList(response.data || []);
          } catch (err) {
              setError("Failed to fetch products");
          } finally {
              setLoading(false);
          }
      };
      fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
      if (!isLoggedIn) {
          router.push('/login');
          return;
      }
      
      try {
          console.log("Adding product to cart:", productId);
          const response = await callApi("POST", "/cart/add", { productId });
          if (response.message === "Server error") {
              setError("Failed to add product to cart");
              return;
          }
          console.log("Product added to cart successfully");
      } catch (err) {
          setError("Failed to add product to cart");
      }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome to V8</h1>
            <p className="mt-4 text-lg text-muted-foreground">Shop the latest products at unbeatable prices!</p>
          </div>

          {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-600">{error}</p>
              </div>
          )}

                    {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loading />
                            </div>
                    ) : productsList.length === 0 ? (
              <Card>
                  <CardContent className="flex items-center justify-center py-12">
                      <div className="text-center">
                          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold">No products available</h3>
                          <p className="text-muted-foreground">
                              Check back soon for new products!
                          </p>
                      </div>
                  </CardContent>
              </Card>
          ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {productsList.map((product) => (
                      <CustomerProductCard 
                          key={product.id} 
                          product={product} 
                          onAddToCart={handleAddToCart}
                      />
                  ))}
              </div>
          )}
        </div>
      </main>
    </div>
  );
}
