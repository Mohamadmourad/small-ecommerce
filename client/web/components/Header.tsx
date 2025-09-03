"use client";

import { useUser } from "@/context/userContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

const Header = () => {
    const { isLoggedIn, isAdmin, logout } = useUser();
    const [userRole, setUserRole] = useState<string>("NOT-LOGGED-IN");

    useEffect(() => {
        if (isLoggedIn) {
            setUserRole(isAdmin ? "ADMIN" : "USER");
        } else {
            setUserRole("NOT-LOGGED-IN");
        }
    }, [isLoggedIn, isAdmin]);

    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white w-full">
            <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">
                V8 Store
            </Link>
            <nav>
                <ul className="flex space-x-4">
                    {isLoggedIn ? (
                      <>
                        <li>
                          <Link href="/cart" className="hover:underline flex items-center">
                            <ShoppingCart className="w-5 h-5" />
                          </Link>
                        </li>
                        <li>
                          <Link href="/orders" className="hover:underline">My Orders</Link>
                        </li>
                        {
                            userRole === "ADMIN" && (
                                <li><Link href="/admin" className="hover:underline">Admin Dashboard</Link></li>
                            )
                        }
                      </>
                    ) : (
                      <>
                        <li><Link href="/login" className="hover:underline">Login</Link></li>
                        <li><Link href="/register" className="hover:underline">Register</Link></li>
                      </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;