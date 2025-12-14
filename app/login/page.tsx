"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User, TrendingUp, Shield, BarChart3 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("[v0] Login attempt with username:", username)

    // Simulated login delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (username === "admin" && password === "123456") {
      console.log("[v0] Login successful, setting localStorage")
      localStorage.setItem("bms_logged_in", "true")
      localStorage.setItem(
        "bms_user",
        JSON.stringify({
          username: "admin",
          name: "系统管理员",
          role: "超级管理员",
          department: "财务部",
        }),
      )
      console.log("[v0] Redirecting to dashboard")
      window.location.href = "/dashboard"
    } else {
      console.log("[v0] Login failed - invalid credentials")
      setError("用户名或密码错误")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-sidebar-foreground">BMS</span>
            </div>
            <p className="text-sidebar-foreground/60 text-sm">Budget Management System</p>
          </div>

          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight">
              企业预算管理
              <br />
              <span className="text-primary">智能化平台</span>
            </h1>
            <p className="text-sidebar-foreground/70 text-lg max-w-md">
              实现战略落地、资源优化配置和经营风险管控的闭环管理
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FeatureCard
                icon={<BarChart3 className="w-5 h-5" />}
                title="多维分析"
                description="支持组织、科目、项目等多维度数据建模"
              />
              <FeatureCard
                icon={<Shield className="w-5 h-5" />}
                title="预算管控"
                description="刚性控制与柔性预警相结合"
              />
            </div>
          </div>

          <div className="text-sidebar-foreground/40 text-sm">© 2025 BMS预算管理系统 · 版本 3.2.1</div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-10 top-1/3 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BMS 预算管理系统</span>
          </div>

          <Card className="border-0 shadow-xl bg-card">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold">登录系统</CardTitle>
              <CardDescription>请输入您的账户信息以继续</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    用户名
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="请输入用户名"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    密码
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      登录中...
                    </span>
                  ) : (
                    "登 录"
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-center text-sm text-muted-foreground">
                  演示账户: <code className="bg-muted px-2 py-1 rounded text-xs">admin</code> /{" "}
                  <code className="bg-muted px-2 py-1 rounded text-xs">123456</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-sidebar-accent/50 backdrop-blur rounded-xl p-4">
      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-sidebar-foreground mb-1">{title}</h3>
      <p className="text-sm text-sidebar-foreground/60">{description}</p>
    </div>
  )
}
