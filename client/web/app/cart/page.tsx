"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import callApi from "@/utils/callApi";
import Loading from "@/components/Loading";
import CartItemCard from "@/components/CartItemCard";
import OrderSummary from "@/components/OrderSummary";
import Header from "@/components/Header";

interface CartItem {
    id: string;
    productId: string;
    productName: string;
    productPrice: number;
    productStock: number;
    quantity: number;
    totalPrice: number;
    outOfStock: boolean;
}

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await callApi("GET", "/cart/items");
                if (response.message === "Server error") {
                    setError("Failed to fetch cart items");
                    return;
                }
                setCartItems(response.data || []);
            } catch (err) {
                setError("Failed to fetch cart items");
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    const handleRemoveItem = async (productId: string) => {
        try {
            const response = await callApi("DELETE", "/cart/remove", { productId });
            if (response.message === "Server error") {
                setError("Failed to remove item");
                return;
            }
            setCartItems(prevItems =>
                prevItems.filter(item => item.productId !== productId)
            );
        } catch (err) {
            setError("Failed to remove item");
        }
    };

    const handleIncrementQuantity = async (productId: string) => {
        try {
            const response = await callApi("POST", "/cart/increment", { productId });
            if (response.message === "Server error") {
                setError("Failed to increment quantity");
                return;
            }
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.productId === productId
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            totalPrice: (item.quantity + 1) * item.productPrice
                        }
                        : item
                )
            );
        } catch (err) {
            setError("Failed to increment quantity");
        }
    };

    const handleDecrementQuantity = async (productId: string) => {
        try {
            const response = await callApi("POST", "/cart/decrement", { productId });
            if (response.message === "Server error") {
                setError("Failed to decrement quantity");
                return;
            }
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.productId === productId && item.quantity > 1
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                            totalPrice: (item.quantity - 1) * item.productPrice
                        }
                        : item
                )
            );
        } catch (err) {
            setError("Failed to decrement quantity");
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.totalPrice, 0);
    };

    const handleProceedOrder = () => {
        console.log("Proceeding to order...");
        // TODO: Navigate to checkout or create order
    };

    return (
        <div className="container mx-auto">
            <Header />
            <div className="space-y-6 px-4 mt-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
                    <p className="text-muted-foreground">
                        Review your items before checkout
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {loading ? (
                    <Loading />
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Cart Items</h2>
                                <span className="text-muted-foreground">
                                    {cartItems.length} items
                                </span>
                            </div>

                            {cartItems.length === 0 ? (
                                <Card>
                                    <CardContent className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold">Your cart is empty</h3>
                                            <p className="text-muted-foreground">
                                                Add some products to get started
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <CartItemCard
                                            key={item.id}
                                            item={item}
                                            onIncrement={handleIncrementQuantity}
                                            onDecrement={handleDecrementQuantity}
                                            onDelete={handleRemoveItem}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <OrderSummary
                                itemCount={cartItems.length}
                                total={calculateTotal()}
                                onProceedOrder={handleProceedOrder}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default CartPage;