"use client"

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    outOfStock: boolean;
}

interface CustomerProductCardProps {
    product: Product;
    onAddToCart: (productId: string) => Promise<void>;
}

const CustomerProductCard = ({ product, onAddToCart }: CustomerProductCardProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            await onAddToCart(product.id);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full border border-gray-200">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{product.name}</span>
                    {product.outOfStock && (
                        <Badge variant="destructive">Out of Stock</Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                    </div>
                    <Button 
                        onClick={handleAddToCart}
                        disabled={product.outOfStock || product.stock === 0 || isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {product.outOfStock || product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CustomerProductCard;
