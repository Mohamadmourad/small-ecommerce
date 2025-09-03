"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/context/userContext"
import callApi from "@/utils/callApi"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

const LoginPage = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const { checkUserStatus } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        
        const data = await callApi("POST", "/auth/login", { email, password });
        if(data.message == "Server error"){
            setError(data.data);
            return;
        }

        localStorage.setItem('auth', data.data);
        await checkUserStatus();
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                    Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Link href="/register" className="cursor-pointer">
                            <Button variant="link">Sign Up</Button>
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            ref={emailRef}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                        </div>
                        <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            
                        </div>
                        <Input
                            ref={passwordRef}
                            id="password"
                            type="password"
                            placeholder="********"
                            required
                        />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm mt-2">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                </CardFooter>
                </Card>
        </div>
    );
}
 
export default LoginPage;