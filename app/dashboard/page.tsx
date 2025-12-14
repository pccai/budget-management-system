"use client"

import type React from "react"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from "recharts"

const monthlyData = [
  { month: "1月", budget: 1200, actual: 1100 },
  { month: "2月", budget: 1300, actual: 1250 },
  { month: "3月", budget: 1400, actual: 1500 },
  { month: "4月", budget: 1350, actual: 1280 },
  { month: "5月", budget: 1500, actual: 1420 },
  { month: "6月", budget: 1600, actual: 1550 },
  { month: "7月", budget: 1550, actual: 1600 },
  { month: "8月", budget: 1700, actual: 1650 },
  { month: "9月", budget: 1800, actual: 1750 },
  { month: "10月", budget: 1850, actual: 1900 },
  { month: "11月", budget: 1900, actual: 1820 },
  { month: "12月", budget: 2000, actual: 1950 },
]

const departmentData = [
  { name: "研发部", budget: 5000, used: 4200, rate: 84 },
  { name: "市场部", budget: 3000, used: 3200, rate: 107, warning: true },
  { name: "销售部", budget: 4500, used: 3800, rate: 84 },
  { name: "行政部", budget: 2000, used: 1600, rate: 80 },
  { name: "人力部", budget: 1500, used: 1200, rate: 80 },
]

const pieData = [
  { name: "人工成本", value: 45, color: "#a69f49" },
  { name: "运营费用", value: 25, color: "#7a9f49" },
  { name: "市场投入", value: 18, color: "#49839f" },
  { name: "研发投入", value: 12, color: "#9f4983" },
]

const pendingTasks = [
  { id: 1, title: "研发部Q4预算审批", department: "研发部", status: "待审批", time: "2小时前" },
  { id: 2, title: "市场部追加预算申请", department: "市场部", status: "待审批", time: "4小时前" },
  { id: 3, title: "销售部预算调剂", department: "销售部", status: "处理中", time: "1天前" },
]

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">管理驾驶舱</h1>
            <p className="text-muted-foreground">2025年度预算执行概览</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              数据更新于 10:30
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              导出报表
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="年度预算总额"
            value="¥ 1.86亿"
            change="+12.5%"
            trend="up"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KPICard
            title="累计执行"
            value="¥ 1.52亿"
            subtitle="执行率 81.7%"
            icon={<Target className="w-5 h-5" />}
            progress={81.7}
          />
          <KPICard
            title="预警事项"
            value="3"
            subtitle="超支部门"
            change="需关注"
            trend="warning"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <KPICard title="待办事项" value="8" subtitle="待审批流程" icon={<CheckCircle2 className="w-5 h-5" />} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">预算执行趋势</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted-foreground">预算</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-chart-2" />
                  <span className="text-muted-foreground">实际</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a69f49" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a69f49" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#49839f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#49839f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="budget"
                      stroke="#a69f49"
                      strokeWidth={2}
                      fill="url(#budgetGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#49839f"
                      strokeWidth={2}
                      fill="url(#actualGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Budget Structure Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">预算结构分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-medium ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Budgets & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Department Budget Execution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">部门预算执行</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                查看全部 <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dept.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          ¥{dept.used}万 / ¥{dept.budget}万
                        </span>
                        <span className={`text-sm font-medium ${dept.warning ? "text-destructive" : "text-success"}`}>
                          {dept.rate}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(dept.rate, 100)}
                      className={`h-2 ${dept.warning ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">待办事项</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                全部待办 <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.department} · {task.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.status === "待审批" ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

function KPICard({
  title,
  value,
  subtitle,
  change,
  trend,
  icon,
  progress,
}: {
  title: string
  value: string
  subtitle?: string
  change?: string
  trend?: "up" | "down" | "warning"
  icon: React.ReactNode
  progress?: number
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            {change && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-warning"
                }`}
              >
                {trend === "up" && <TrendingUp className="w-4 h-4" />}
                {trend === "down" && <TrendingDown className="w-4 h-4" />}
                {trend === "warning" && <AlertTriangle className="w-4 h-4" />}
                <span>{change}</span>
              </div>
            )}
            {progress !== undefined && <Progress value={progress} className="h-1.5 mt-2" />}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
