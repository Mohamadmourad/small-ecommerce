"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItemProps {
    item: {
        id: string;
        productId: string;
        productName: string;
        productPrice: number;
        productStock: number;
        quantity: number;
        totalPrice: number;
        outOfStock: boolean;
    };
    onIncrement: (productId: string) => void;
    onDecrement: (productId: string) => void;
    onDelete: (productId: string) => void;
}

const CartItemCard = ({ item, onIncrement, onDecrement, onDelete }: CartItemProps) => {
    return (
        <Card className="w-full">
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-sm">{item.productName}</h3>
                            {item.outOfStock && (
                                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    ${item.productPrice.toFixed(2)} each
                                </p>
                                <p className="text-sm font-semibold text-green-600">
                                    Total: ${item.totalPrice.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDecrement(item.productId)}
                                    disabled={item.quantity <= 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-sm font-medium min-w-[20px] text-center">
                                    {item.quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onIncrement(item.productId)}
                                    disabled={item.outOfStock}
                                    className="h-8 w-8 p-0"
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(item.productId)}
                        className="text-red-600 hover:text-red-700 ml-3 h-8 w-8 p-0"
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CartItemCard;
