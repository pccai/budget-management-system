"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("bms_logged_in")
    if (isLoggedIn !== "true") {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={cn("hidden lg:block", mobileMenuOpen && "!block")}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Main content */}
      <div className={cn("transition-all duration-300", sidebarCollapsed ? "lg:ml-16" : "lg:ml-64")}>
        <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
