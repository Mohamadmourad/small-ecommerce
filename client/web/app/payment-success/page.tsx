"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import callApi from "@/utils/callApi";

const PaymentSuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPaymentProcessed, setIsPaymentProcessed] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    useEffect(() => {
        const processPayment = async () => {
            const orderId = searchParams.get('orderId');
            
            if (!orderId) {
                setPaymentError('No order ID found');
                return;
            }

            try {
                const response = await callApi('POST', '/orders/pay', {
                    orderId: orderId
                });

                if (response.status === 200) {
                    setIsPaymentProcessed(true);
                } else {
                    setPaymentError('Payment processing failed');
                }
            } catch (error) {
                console.error('Payment processing error:', error);
                setPaymentError('Payment processing failed');
            }
        };

        processPayment();
    }, [searchParams]);

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <Card className="text-center">
                <CardHeader className="pb-4">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl text-green-600">
                        Payment Successful!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {paymentError ? (
                        <>
                            <p className="text-red-600">
                                {paymentError}
                            </p>
                            <p className="text-sm text-gray-500">
                                Please contact support if you continue to experience issues.
                            </p>
                        </>
                    ) : isPaymentProcessed ? (
                        <>
                            <p className="text-gray-600">
                                Thank you for your order! Your payment has been processed successfully.
                            </p>
                            <p className="text-sm text-gray-500">
                                You will receive a confirmation email shortly with your order details.
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-600">
                            Processing your payment...
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button 
                            onClick={() => router.push('/')}
                            variant="default"
                            disabled={!isPaymentProcessed && !paymentError}
                        >
                            Continue Shopping
                        </Button>
                        <Button 
                            onClick={() => router.push('/orders')}
                            variant="outline"
                            disabled={!isPaymentProcessed && !paymentError}
                        >
                            View Orders
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;
