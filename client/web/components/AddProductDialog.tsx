"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

interface AddProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (productData: { name: string; price: number; stock: number }) => void;
}

const AddProductDialog = ({ open, onOpenChange, onSubmit }: AddProductDialogProps) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const stockRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        const name = nameRef.current?.value || "";
        const price = parseFloat(priceRef.current?.value || "0");
        const stock = parseInt(stockRef.current?.value || "0");

        if (name && price >= 0 && stock >= 0) {
            onSubmit({ name, price, stock });
            onOpenChange(false);
            
            if (nameRef.current) nameRef.current.value = "";
            if (priceRef.current) priceRef.current.value = "";
            if (stockRef.current) stockRef.current.value = "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="btn">Add New Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                        Add a new product to your inventory. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            ref={nameRef}
                            id="name"
                            placeholder="Product name"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            ref={priceRef}
                            id="price"
                            placeholder="0.00"
                            type="number"
                            step="0.01"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right">
                            Stock
                        </Label>
                        <Input
                            ref={stockRef}
                            id="stock"
                            placeholder="0"
                            type="number"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Add Product
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddProductDialog;
