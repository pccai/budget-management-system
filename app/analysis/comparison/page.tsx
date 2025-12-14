"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts"

interface DrillDownData {
  id: string
  name: string
  budget: number
  actual: number
  rate: number
  variance: number
  varianceRate: number
  children?: DrillDownData[]
}

const departmentDrillData: DrillDownData[] = [
  {
    id: "dept-1",
    name: "研发部",
    budget: 5000,
    actual: 4200,
    rate: 84,
    variance: -800,
    varianceRate: -16,
    children: [
      {
        id: "dept-1-1",
        name: "软件研发组",
        budget: 3000,
        actual: 2600,
        rate: 86.7,
        variance: -400,
        varianceRate: -13.3,
      },
      {
        id: "dept-1-2",
        name: "硬件研发组",
        budget: 1200,
        actual: 1000,
        rate: 83.3,
        variance: -200,
        varianceRate: -16.7,
      },
      { id: "dept-1-3", name: "测试组", budget: 800, actual: 600, rate: 75, variance: -200, varianceRate: -25 },
    ],
  },
  {
    id: "dept-2",
    name: "市场部",
    budget: 3000,
    actual: 3200,
    rate: 106.7,
    variance: 200,
    varianceRate: 6.7,
    children: [
      {
        id: "dept-2-1",
        name: "品牌推广组",
        budget: 1500,
        actual: 1700,
        rate: 113.3,
        variance: 200,
        varianceRate: 13.3,
      },
      { id: "dept-2-2", name: "市场调研组", budget: 800, actual: 780, rate: 97.5, variance: -20, varianceRate: -2.5 },
      { id: "dept-2-3", name: "活动策划组", budget: 700, actual: 720, rate: 102.9, variance: 20, varianceRate: 2.9 },
    ],
  },
  {
    id: "dept-3",
    name: "销售部",
    budget: 4500,
    actual: 3800,
    rate: 84.4,
    variance: -700,
    varianceRate: -15.6,
    children: [
      { id: "dept-3-1", name: "华北区", budget: 1500, actual: 1300, rate: 86.7, variance: -200, varianceRate: -13.3 },
      { id: "dept-3-2", name: "华东区", budget: 1800, actual: 1500, rate: 83.3, variance: -300, varianceRate: -16.7 },
      { id: "dept-3-3", name: "华南区", budget: 1200, actual: 1000, rate: 83.3, variance: -200, varianceRate: -16.7 },
    ],
  },
]

const monthlyTrendData = [
  { month: "1月", budget: 1400, actual: 1200 },
  { month: "2月", budget: 1300, actual: 1250 },
  { month: "3月", budget: 1500, actual: 1400 },
  { month: "4月", budget: 1400, actual: 1350 },
  { month: "5月", budget: 1600, actual: 1500 },
  { month: "6月", budget: 1500, actual: 1600 },
  { month: "7月", budget: 1400, actual: 1300 },
  { month: "8月", budget: 1500, actual: 1450 },
  { month: "9月", budget: 1600, actual: 1550 },
  { month: "10月", budget: 1700, actual: 1650 },
  { month: "11月", budget: 1500, actual: 1480 },
  { month: "12月", budget: 1400, actual: 1200 },
]

const comparisonData = [
  { department: "研发部", budget: 5000, actual: 4200, rate: 84, variance: -800, varianceRate: -16 },
  { department: "市场部", budget: 3000, actual: 3200, rate: 106.7, variance: 200, varianceRate: 6.7 },
  { department: "销售部", budget: 4500, actual: 3800, rate: 84.4, variance: -700, varianceRate: -15.6 },
  { department: "行政部", budget: 2000, actual: 1850, rate: 92.5, variance: -150, varianceRate: -7.5 },
  { department: "人力部", budget: 1500, actual: 1380, rate: 92, variance: -120, varianceRate: -8 },
  { department: "财务部", budget: 800, actual: 750, rate: 93.8, variance: -50, varianceRate: -6.3 },
]

const chartData = comparisonData.map((item) => ({
  name: item.department,
  预算: item.budget,
  实际: item.actual,
}))

const subjectData = [
  { code: "6001", name: "人工成本", budget: 8000, actual: 7500, rate: 93.8 },
  { code: "6002", name: "办公费用", budget: 1200, actual: 1100, rate: 91.7 },
  { code: "6003", name: "差旅费用", budget: 2000, actual: 2200, rate: 110 },
  { code: "6004", name: "业务招待费", budget: 800, actual: 850, rate: 106.3 },
  { code: "6005", name: "培训费用", budget: 600, actual: 450, rate: 75 },
  { code: "6006", name: "市场推广费", budget: 3000, actual: 2800, rate: 93.3 },
]

export default function ComparisonPage() {
  const [dimension, setDimension] = useState("department")
  const [period, setPeriod] = useState("ytd")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<DrillDownData | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const totalBudget = comparisonData.reduce((sum, item) => sum + item.budget, 0)
  const totalActual = comparisonData.reduce((sum, item) => sum + item.actual, 0)
  const overBudgetCount = comparisonData.filter((item) => item.rate > 100).length

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleViewDetail = (dept: DrillDownData) => {
    setSelectedDepartment(dept)
    setDetailDialogOpen(true)
  }

  const renderDrillRow = (item: DrillDownData, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedRows.has(item.id)

    return (
      <>
        <TableRow key={item.id} className={level > 0 ? "bg-secondary/30" : ""}>
          <TableCell style={{ paddingLeft: `${level * 24 + 16}px` }}>
            <div className="flex items-center gap-2">
              {hasChildren && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleRow(item.id)}>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              )}
              {!hasChildren && <span className="w-6" />}
              <span className="font-medium">{item.name}</span>
            </div>
          </TableCell>
          <TableCell className="text-right">{item.budget.toLocaleString()}</TableCell>
          <TableCell className="text-right">{item.actual.toLocaleString()}</TableCell>
          <TableCell className="text-right font-medium">{item.rate}%</TableCell>
          <TableCell className="text-right">
            <span
              className={`flex items-center justify-end gap-1 ${item.variance >= 0 ? "text-destructive" : "text-success"}`}
            >
              {item.variance >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {item.varianceRate >= 0 ? "+" : ""}
              {item.varianceRate.toFixed(1)}%
            </span>
          </TableCell>
          <TableCell className="text-center">
            <Badge
              className={
                item.rate > 100
                  ? "bg-destructive/20 text-destructive"
                  : item.rate > 90
                    ? "bg-warning/20 text-warning"
                    : "bg-success/20 text-success"
              }
            >
              {item.rate > 100 ? "超支" : item.rate > 90 ? "临界" : "正常"}
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm" onClick={() => handleViewDetail(item)}>
              <Eye className="w-4 h-4 mr-1" />
              详情
            </Button>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && item.children!.map((child) => renderDrillRow(child, level + 1))}
      </>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">预实对比分析</h1>
            <p className="text-muted-foreground">预算与实际执行数据的差异分析</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新数据
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出报表
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">分析维度:</span>
                <Select value={dimension} onValueChange={setDimension}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department">按部门</SelectItem>
                    <SelectItem value="subject">按科目</SelectItem>
                    <SelectItem value="project">按项目</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">统计期间:</span>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ytd">本年累计</SelectItem>
                    <SelectItem value="q4">Q4季度</SelectItem>
                    <SelectItem value="m11">11月</SelectItem>
                    <SelectItem value="m12">12月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                更多筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">预算总额</p>
              <p className="text-2xl font-bold">¥{(totalBudget / 10000).toFixed(2)}亿</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <span>年度计划</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">实际执行</p>
              <p className="text-2xl font-bold">¥{(totalActual / 10000).toFixed(2)}亿</p>
              <div className="flex items-center gap-1 text-sm text-success mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>累计发生</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">执行率</p>
              <p className="text-2xl font-bold">{((totalActual / totalBudget) * 100).toFixed(1)}%</p>
              <Progress value={(totalActual / totalBudget) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card className={overBudgetCount > 0 ? "border-destructive/50" : ""}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">超支项目</p>
              <p className={`text-2xl font-bold ${overBudgetCount > 0 ? "text-destructive" : "text-success"}`}>
                {overBudgetCount}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <span>需重点关注</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="drilldown">钻取分析</TabsTrigger>
            <TabsTrigger value="trend">趋势分析</TabsTrigger>
            <TabsTrigger value="subject">科目分析</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">预实对比图</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          width={60}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="预算" fill="#a69f49" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="实际" fill="#49839f" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Variance Table */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">差异明细</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => setActiveTab("drilldown")}
                    >
                      查看详情 <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>部门</TableHead>
                        <TableHead className="text-right">预算</TableHead>
                        <TableHead className="text-right">实际</TableHead>
                        <TableHead className="text-right">差异</TableHead>
                        <TableHead className="text-center">状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonData.map((item) => (
                        <TableRow key={item.department}>
                          <TableCell className="font-medium">{item.department}</TableCell>
                          <TableCell className="text-right">{item.budget}</TableCell>
                          <TableCell className="text-right">{item.actual}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`flex items-center justify-end gap-1 ${
                                item.variance >= 0 ? "text-destructive" : "text-success"
                              }`}
                            >
                              {item.variance >= 0 ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              {item.varianceRate >= 0 ? "+" : ""}
                              {item.varianceRate.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                item.rate > 100
                                  ? "bg-destructive/20 text-destructive"
                                  : item.rate > 90
                                    ? "bg-warning/20 text-warning"
                                    : "bg-success/20 text-success"
                              }
                            >
                              {item.rate > 100 ? "超支" : item.rate > 90 ? "临界" : "正常"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drilldown" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">多级钻取分析</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedRows(new Set(departmentDrillData.map((d) => d.id)))}
                    >
                      全部展开
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setExpandedRows(new Set())}>
                      全部收起
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>部门/组别</TableHead>
                      <TableHead className="text-right">预算(万)</TableHead>
                      <TableHead className="text-right">实际(万)</TableHead>
                      <TableHead className="text-right">执行率</TableHead>
                      <TableHead className="text-right">差异率</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{departmentDrillData.map((item) => renderDrillRow(item))}</TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">月度执行趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
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
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="budget"
                        stroke="#a69f49"
                        strokeWidth={2}
                        name="预算"
                        dot={{ fill: "#a69f49" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#49839f"
                        strokeWidth={2}
                        name="实际"
                        dot={{ fill: "#49839f" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subject" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">科目维度分析</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>科目编码</TableHead>
                      <TableHead>科目名称</TableHead>
                      <TableHead className="text-right">预算金额(万)</TableHead>
                      <TableHead className="text-right">实际金额(万)</TableHead>
                      <TableHead className="text-right">执行率</TableHead>
                      <TableHead>执行进度</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectData.map((item) => (
                      <TableRow key={item.code}>
                        <TableCell className="font-mono">{item.code}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.budget.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.actual.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">{item.rate}%</TableCell>
                        <TableCell className="w-32">
                          <Progress
                            value={Math.min(item.rate, 100)}
                            className={`h-2 ${
                              item.rate > 100
                                ? "[&>div]:bg-destructive"
                                : item.rate > 90
                                  ? "[&>div]:bg-warning"
                                  : "[&>div]:bg-primary"
                            }`}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              item.rate > 100
                                ? "bg-destructive/20 text-destructive"
                                : item.rate > 90
                                  ? "bg-warning/20 text-warning"
                                  : "bg-success/20 text-success"
                            }
                          >
                            {item.rate > 100 ? "超支" : item.rate > 90 ? "临界" : "正常"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedDepartment?.name} - 预算执行详情</DialogTitle>
            </DialogHeader>
            {selectedDepartment && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">预算金额</p>
                      <p className="text-2xl font-bold">¥{selectedDepartment.budget}万</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">实际金额</p>
                      <p className="text-2xl font-bold">¥{selectedDepartment.actual}万</p>
                    </CardContent>
                  </Card>
                  <Card className={selectedDepartment.rate > 100 ? "border-destructive/50" : ""}>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">执行率</p>
                      <p className={`text-2xl font-bold ${selectedDepartment.rate > 100 ? "text-destructive" : ""}`}>
                        {selectedDepartment.rate}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">执行进度</p>
                  <Progress
                    value={Math.min(selectedDepartment.rate, 100)}
                    className={`h-3 ${selectedDepartment.rate > 100 ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`}
                  />
                </div>
                {selectedDepartment.children && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">下级单位明细</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>名称</TableHead>
                          <TableHead className="text-right">预算</TableHead>
                          <TableHead className="text-right">实际</TableHead>
                          <TableHead className="text-right">执行率</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDepartment.children.map((child) => (
                          <TableRow key={child.id}>
                            <TableCell>{child.name}</TableCell>
                            <TableCell className="text-right">{child.budget}</TableCell>
                            <TableCell className="text-right">{child.actual}</TableCell>
                            <TableCell className="text-right">{child.rate}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                导出报表
              </Button>
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
