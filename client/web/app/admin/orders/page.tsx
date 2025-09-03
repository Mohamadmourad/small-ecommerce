"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import callApi from "@/utils/callApi";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    outOfStock: boolean;
}

interface OrderItem {
    id: string;
    orderId: string;
    product: Product;
    quantity: number;
}

interface Order {
    orderId: string;
    totalAmount: number;
    items: OrderItem[];
    paymentStatus: string;
    fullName: string;
    phoneNumber: string;
    shippingAddress: string;
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await callApi('GET', '/orders/admin/orders');
            if (response.status === 200) {
                setOrders(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleEditOrder = (orderId: string) => {
        // TODO: Implement edit order functionality
        console.log('Edit order:', orderId);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">
                        View and manage customer orders
                    </p>
                </div>
                <div className="flex justify-center items-center min-h-96">
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">
                    View and manage customer orders ({orders.length} total)
                </p>
            </div>
            
            {orders.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-gray-500 mb-4">No orders found.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, orderIndex) => (
                        <Card key={orderIndex}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">
                                            Order #{order.orderId?.slice(-8) || `Order ${orderIndex + 1}`}
                                        </CardTitle>
                                        <p className="text-sm text-gray-500">
                                            Customer: {order.fullName}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(order.paymentStatus)}>
                                            {order.paymentStatus}
                                        </Badge>
                                        <Button 
                                            onClick={() => handleEditOrder(order.orderId)}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Customer Details</h4>
                                        <p className="text-sm text-gray-600"><strong>Name:</strong> {order.fullName}</p>
                                        <p className="text-sm text-gray-600"><strong>Phone:</strong> {order.phoneNumber}</p>
                                        <p className="text-sm text-gray-600"><strong>Address:</strong> {order.shippingAddress}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Order Items</h4>
                                        {order.items?.map((item, index) => (
                                            <div key={item.id} className="flex justify-between text-sm mb-1">
                                                <span>{item.product.name} x {item.quantity}</span>
                                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between font-semibold">
                                                <span>Total</span>
                                                <span>${order.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
 
export default OrdersPage;
