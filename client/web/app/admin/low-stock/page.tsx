"use client"

import { useEffect, useState } from "react";
import callApi from "@/utils/callApi";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    outOfStock: boolean;
}

const LowStockPage = () => {
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await callApi("GET", "/products/admin/low-stock");
                if (response.message === "Server error") {
                    setError("Failed to fetch products");
                    return;
                }
                console.log(response.data);
                setProductsList(response.data || []);
            } catch (err) {
                setError("Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Low Stock</h1>
                <p className="text-muted-foreground">
                    Monitor products that are running low on stock (less than 10 items)
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Low Stock Products</h2>
                <span className="text-muted-foreground">
                    {loading ? "Loading..." : `${productsList.length} products`}
                </span>
            </div>

            {loading ? (
                <Loading />
            ) : productsList.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No low stock products</h3>
                            <p className="text-muted-foreground">
                                All products have sufficient stock levels
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {productsList.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
 
export default LowStockPage;
