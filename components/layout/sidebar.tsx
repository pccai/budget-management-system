"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Settings2,
  FileEdit,
  ShieldCheck,
  BarChart3,
  Users,
  ChevronDown,
  TrendingUp,
  Building2,
  Layers,
  Calendar,
  Target,
  Calculator,
  RefreshCw,
  GitMerge,
  AlertTriangle,
  ArrowRightLeft,
  ClipboardList,
  PieChart,
  Activity,
  LineChart,
  UserCog,
  FileText,
  Database,
  ChevronLeft,
} from "lucide-react"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const menuItems = [
  {
    title: "管理驾驶舱",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "基础建模",
    icon: Settings2,
    basePath: "/modeling",
    children: [
      { title: "组织架构", href: "/modeling/organization", icon: Building2 },
      { title: "维度管理", href: "/modeling/dimensions", icon: Layers },
      { title: "版本管理", href: "/modeling/versions", icon: GitMerge },
      { title: "预算日历", href: "/modeling/calendar", icon: Calendar },
    ],
  },
  {
    title: "预算编制",
    icon: FileEdit,
    basePath: "/preparation",
    children: [
      { title: "目标分解", href: "/preparation/targets", icon: Target },
      { title: "预算填报", href: "/preparation/entry", icon: Calculator },
      { title: "滚动预测", href: "/preparation/forecast", icon: RefreshCw },
      { title: "汇总平衡", href: "/preparation/summary", icon: GitMerge },
    ],
  },
  {
    title: "预算控制",
    icon: ShieldCheck,
    basePath: "/control",
    children: [
      { title: "控制策略", href: "/control/policies", icon: AlertTriangle },
      { title: "预算占用", href: "/control/occupation", icon: ClipboardList },
      { title: "预算调整", href: "/control/adjustment", icon: ArrowRightLeft },
    ],
  },
  {
    title: "预算分析",
    icon: BarChart3,
    basePath: "/analysis",
    children: [
      { title: "预实对比", href: "/analysis/comparison", icon: PieChart },
      { title: "执行监控", href: "/analysis/monitoring", icon: Activity },
      { title: "情景模拟", href: "/analysis/simulation", icon: LineChart },
    ],
  },
  {
    title: "系统管理",
    icon: Users,
    basePath: "/system",
    children: [
      { title: "用户管理", href: "/system/users", icon: UserCog },
      { title: "操作日志", href: "/system/logs", icon: FileText },
      { title: "数据同步", href: "/system/sync", icon: Database },
    ],
  },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  useEffect(() => {
    const activeMenus = menuItems
      .filter((item) => item.basePath && pathname.startsWith(item.basePath))
      .map((item) => item.title)

    setExpandedItems((prev) => {
      const newExpanded = [...new Set([...prev, ...activeMenus])]
      return newExpanded
    })
  }, [pathname])

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">BMS</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
      </button>

      {/* Navigation */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href ? pathname === item.href : item.children?.some((child) => pathname === child.href)
          const isExpanded = expandedItems.includes(item.title)

          if (item.href) {
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          }

          return (
            <div key={item.title}>
              <button
                onClick={() => !collapsed && toggleExpand(item.title)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                  </>
                )}
              </button>
              {!collapsed && isExpanded && item.children && (
                <div className="mt-1 ml-4 pl-4 border-l border-sidebar-border space-y-1">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    const isChildActive = pathname === child.href
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          isChildActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                        )}
                      >
                        <ChildIcon className="w-4 h-4" />
                        <span>{child.title}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
