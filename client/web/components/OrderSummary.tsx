"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useRouter } from "next/navigation";
import callApi from "@/utils/callApi";

interface OrderSummaryProps {
    itemCount: number;
    total: number;
    onProceedOrder: () => void;
}

const OrderSummary = ({ itemCount, total, onProceedOrder }: OrderSummaryProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        shippingAddress: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOrderSubmission = async () => {
        // Validate form
        if (!formData.fullName || !formData.phoneNumber || !formData.shippingAddress) {
            alert('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await callApi('POST', '/orders/create', {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                shippingAddress: formData.shippingAddress
            });

            if (response.status === 201) {
                const orderId = response.data; 
                onProceedOrder();
                router.push(`/payment-success?orderId=${orderId}`);
            } else {
                alert('Failed to create order. Please try again.');
            }
        } catch (error) {
            console.error('Order creation error:', error);
            alert('An error occurred while creating your order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Items ({itemCount})</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button 
                            disabled={itemCount === 0}
                            className="w-full"
                            size="lg"
                        >
                            Proceed to Order
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="px-4">
                        <SheetHeader>
                            <SheetTitle>Checkout</SheetTitle>
                            <SheetDescription>
                                Complete your order by filling in your details below.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 py-4">
                            <div className="grid gap-3">
                                <Label htmlFor="customer-name">Full Name</Label>
                                <Input 
                                    id="customer-name" 
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name" 
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="customer-phone">Phone Number</Label>
                                <Input 
                                    id="customer-phone" 
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    type="tel" 
                                    placeholder="Enter your phone number" 
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="shipping-address">Shipping Address</Label>
                                <Input 
                                    id="shipping-address" 
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleInputChange}
                                    placeholder="Enter your shipping address" 
                                    required
                                />
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Items ({itemCount})</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <SheetFooter>
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isLoading || itemCount === 0}
                                onClick={handleOrderSubmission}
                            >
                                {isLoading ? 'Processing...' : 'Place Order'}
                            </Button>
                            <SheetClose asChild>
                                <Button variant="outline" className="w-full" disabled={isLoading}>
                                    Cancel
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </CardContent>
        </Card>
    );
};

export default OrderSummary;
