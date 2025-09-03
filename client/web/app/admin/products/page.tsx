"use client"

import { useEffect, useState } from "react";
import AddProductDialog from "@/components/AddProductDialog";
import EditProductDialog from "@/components/EditProductDialog";
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

const ProductsPage = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

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

    const handleAddProduct = async (productData: { name: string; price: number; stock: number }) => {
        try {
            console.log("Adding product:", productData);
            const response = await callApi("POST", "/products", productData);
            if (response.message === "Server error") {
                setError("Failed to add product");
                return;
            }
            const updatedResponse = await callApi("GET", "/products");
            if (updatedResponse.data) {
                setProductsList(updatedResponse.data);
            }
        } catch (err) {
            setError("Failed to add product");
        }
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setEditOpen(true);
    };

    const handleUpdateProduct = async (productId: string, productData: { name: string; price: number; stock: number }) => {
        try {
            console.log("Updating product:", productId, productData);
            const response = await callApi("PUT", `/products/${productId}`, productData);
            
            if (response.message === "Server error") {
                setError("Failed to update product");
                return;
            }
  
            const updatedResponse = await callApi("GET", "/products");
            if (updatedResponse.data) {
                setProductsList(updatedResponse.data);
                setError("");
            }
        } catch (err) {
            setError("Failed to update product");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                    Manage your product inventory
                </p>
            </div>

            <div className="w-full flex justify-end">
                <AddProductDialog 
                    open={open} 
                    onOpenChange={setOpen}
                    onSubmit={handleAddProduct}
                />
            </div>

            {/* Edit Product Dialog */}
            {selectedProduct && (
                <EditProductDialog
                    product={selectedProduct}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    onSubmit={handleUpdateProduct}
                />
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Products List</h2>
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
                            <h3 className="text-lg font-semibold">No products found</h3>
                            <p className="text-muted-foreground">
                                Get started by adding your first product
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {productsList.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onEdit={handleEditProduct}
                            showEdit={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
 
export default ProductsPage;
