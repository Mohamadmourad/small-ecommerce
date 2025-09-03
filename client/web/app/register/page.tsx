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
import callApi from "@/utils/callApi"
import Link from "next/link"
import { useRef, useState } from "react"
import { useUser } from "@/context/userContext"
import { useRouter } from "next/navigation"

const RegisterPage = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");
    const { checkUserStatus } = useUser();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;
        
        console.log('Register data:', { email, password, confirmPassword });
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        const data = await callApi("POST", "/auth/register", { email, password });
        console.log(data);
        if(data.message == "Server error"){
            setError(data.data);
            return;
        }

        localStorage.setItem('auth', data.data);
        await checkUserStatus();
        router.push('/');
        
    };    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create a new account
                    </CardDescription>
                    <CardAction>
                        <Link href="/login" className="cursor-pointer">
                            <Button variant="link">Login</Button>
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
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                </div>
                                <Input
                                    ref={confirmPasswordRef}
                                    id="confirmPassword"
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
                                Register
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
 
export default RegisterPage;