"use client"

import { ReactNode, useEffect } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/userContext'
import { Home, Package, ShoppingCart, TrendingDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Loading from "@/components/Loading"

const adminMenuItems = [
  {
    title: "Back to Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders", 
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Low Stock",
    url: "/admin/low-stock",
    icon: TrendingDown,
  },
]

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { isAdmin, loading } = useUser()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
    }
  }, [loading, isAdmin, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading />
      </div>
    )
  }

  if (!loading && !isAdmin) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                Admin Dashboard
              </h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 lg:hidden">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
