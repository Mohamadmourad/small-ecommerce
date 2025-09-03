"use client"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    outOfStock: boolean;
}

interface EditProductDialogProps {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (productId: string, productData: { name: string; price: number; stock: number }) => void;
}

const EditProductDialog = ({ product, open, onOpenChange, onSubmit }: EditProductDialogProps) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when product changes or dialog opens
    useEffect(() => {
        if (product && open) {
            setName(product.name);
            setPrice(product.price.toString());
            setStock(product.stock.toString());
        }
    }, [product, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const priceNum = parseFloat(price);
        const stockNum = parseInt(stock);
        
        if (!name || priceNum <= 0 || stockNum < 0) {
            alert("Please fill in valid values for all fields");
            return;
        }

        setIsLoading(true);
        
        try {
            await onSubmit(product.id, {
                name: name.trim(),
                price: priceNum,
                stock: stockNum
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setName(product.name);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Make changes to your product. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Product Name</Label>
                        <Input
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-price">Price ($)</Label>
                        <Input
                            id="edit-price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-stock">Stock Quantity</Label>
                        <Input
                            id="edit-stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="0"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductDialog;
