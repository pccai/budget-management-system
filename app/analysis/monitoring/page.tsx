"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Search,
  Bell,
  BellOff,
  Eye,
  TrendingUp,
  TrendingDown,
  Settings,
  RefreshCw,
  Download,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"

interface MonitoringItem {
  id: string
  department: string
  budget: number
  used: number
  rate: number
  trend: "up" | "down" | "stable"
  lastMonth: number
  alertEnabled: boolean
  alertThreshold: number
}

const initialData: MonitoringItem[] = [
  {
    id: "1",
    department: "研发部",
    budget: 5000,
    used: 4200,
    rate: 84,
    trend: "stable",
    lastMonth: 82,
    alertEnabled: true,
    alertThreshold: 90,
  },
  {
    id: "2",
    department: "市场部",
    budget: 3000,
    used: 3200,
    rate: 107,
    trend: "up",
    lastMonth: 98,
    alertEnabled: true,
    alertThreshold: 90,
  },
  {
    id: "3",
    department: "销售部",
    budget: 4500,
    used: 3800,
    rate: 84,
    trend: "stable",
    lastMonth: 80,
    alertEnabled: true,
    alertThreshold: 90,
  },
  {
    id: "4",
    department: "行政部",
    budget: 2000,
    used: 1850,
    rate: 93,
    trend: "up",
    lastMonth: 88,
    alertEnabled: true,
    alertThreshold: 90,
  },
  {
    id: "5",
    department: "人力部",
    budget: 1500,
    used: 1380,
    rate: 92,
    trend: "stable",
    lastMonth: 90,
    alertEnabled: false,
    alertThreshold: 90,
  },
  {
    id: "6",
    department: "财务部",
    budget: 800,
    used: 750,
    rate: 94,
    trend: "down",
    lastMonth: 96,
    alertEnabled: true,
    alertThreshold: 90,
  },
]

const trendData = [
  { month: "7月", 研发部: 70, 市场部: 72, 销售部: 68, 行政部: 75 },
  { month: "8月", 研发部: 75, 市场部: 78, 销售部: 72, 行政部: 80 },
  { month: "9月", 研发部: 78, 市场部: 85, 销售部: 76, 行政部: 82 },
  { month: "10月", 研发部: 80, 市场部: 92, 销售部: 78, 行政部: 85 },
  { month: "11月", 研发部: 82, 市场部: 98, 销售部: 80, 行政部: 88 },
  { month: "12月", 研发部: 84, 市场部: 107, 销售部: 84, 行政部: 93 },
]

const alertHistory = [
  {
    time: "2025-12-03 10:30",
    department: "市场部",
    type: "超支预警",
    message: "预算执行率已超过100%，当前107%",
    status: "unread",
  },
  {
    time: "2025-12-02 16:45",
    department: "行政部",
    type: "临界预警",
    message: "预算执行率已达93%，接近预警阈值",
    status: "read",
  },
  {
    time: "2025-12-01 09:15",
    department: "财务部",
    type: "临界预警",
    message: "预算执行率已达94%，接近预警阈值",
    status: "read",
  },
  {
    time: "2025-11-28 14:20",
    department: "市场部",
    type: "临界预警",
    message: "预算执行率已达98%，接近预警阈值",
    status: "read",
  },
]

export default function MonitoringPage() {
  const [data, setData] = useState<MonitoringItem[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MonitoringItem | null>(null)

  const filteredData = data.filter((item) => {
    const matchSearch = item.department.includes(searchTerm)
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "warning" && item.rate > 100) ||
      (statusFilter === "critical" && item.rate > 90 && item.rate <= 100) ||
      (statusFilter === "normal" && item.rate <= 90)
    return matchSearch && matchStatus
  })

  const warningCount = data.filter((d) => d.rate > 100).length
  const criticalCount = data.filter((d) => d.rate > 90 && d.rate <= 100).length
  const normalCount = data.filter((d) => d.rate <= 90).length

  const handleViewDetail = (item: MonitoringItem) => {
    setSelectedItem(item)
    setDetailDialogOpen(true)
  }

  const handleOpenSettings = (item: MonitoringItem) => {
    setSelectedItem(item)
    setSettingsDialogOpen(true)
  }

  const handleToggleAlert = (id: string) => {
    setData((prev) => prev.map((d) => (d.id === id ? { ...d, alertEnabled: !d.alertEnabled } : d)))
  }

  const handleUpdateThreshold = (threshold: number) => {
    if (selectedItem) {
      setData((prev) => prev.map((d) => (d.id === selectedItem.id ? { ...d, alertThreshold: threshold } : d)))
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">执行监控</h1>
            <p className="text-muted-foreground">实时监控预算执行情况，红绿灯预警</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAlertDialogOpen(true)}>
              <Bell className="w-4 h-4 mr-2" />
              预警记录
              {alertHistory.filter((a) => a.status === "unread").length > 0 && (
                <Badge className="ml-2 bg-destructive">
                  {alertHistory.filter((a) => a.status === "unread").length}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">监控单位</p>
                <p className="text-2xl font-bold">{data.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">正常</p>
                <p className="text-2xl font-bold text-success">{normalCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">临界预警</p>
                <p className="text-2xl font-bold text-warning">{criticalCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">超支预警</p>
                <p className="text-2xl font-bold text-destructive">{warningCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">执行率趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 120]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <ReferenceLine
                    y={100}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    label={{ value: "100%", fill: "#ef4444" }}
                  />
                  <ReferenceLine
                    y={90}
                    stroke="#eab308"
                    strokeDasharray="5 5"
                    label={{ value: "90%", fill: "#eab308" }}
                  />
                  <Line type="monotone" dataKey="研发部" stroke="#a69f49" strokeWidth={2} />
                  <Line type="monotone" dataKey="市场部" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="销售部" stroke="#49839f" strokeWidth={2} />
                  <Line type="monotone" dataKey="行政部" stroke="#9f4983" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Filter & Cards */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索部门..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="warning">超支预警</SelectItem>
              <SelectItem value="critical">临界预警</SelectItem>
              <SelectItem value="normal">正常</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <Card
              key={item.id}
              className={item.rate > 100 ? "border-destructive/50" : item.rate > 90 ? "border-warning/50" : ""}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.department}</h3>
                    {item.alertEnabled ? (
                      <Bell className="w-4 h-4 text-primary" />
                    ) : (
                      <BellOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
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
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">执行率</span>
                    <span className="font-bold flex items-center gap-1">
                      {item.rate}%{item.trend === "up" && <TrendingUp className="w-4 h-4 text-destructive" />}
                      {item.trend === "down" && <TrendingDown className="w-4 h-4 text-success" />}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(item.rate, 100)}
                    className={`h-2 ${
                      item.rate > 100
                        ? "[&>div]:bg-destructive"
                        : item.rate > 90
                          ? "[&>div]:bg-warning"
                          : "[&>div]:bg-success"
                    }`}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>已用: ¥{item.used}万</span>
                    <span>预算: ¥{item.budget}万</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>上月: {item.lastMonth}%</span>
                    <span>预警阈值: {item.alertThreshold}%</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleViewDetail(item)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    详情
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleOpenSettings(item)}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    设置
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedItem?.department} - 执行详情</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">预算金额</p>
                      <p className="text-xl font-bold">¥{selectedItem.budget}万</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">已使用</p>
                      <p className="text-xl font-bold">¥{selectedItem.used}万</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">剩余额度</p>
                      <p className="text-xl font-bold">¥{selectedItem.budget - selectedItem.used}万</p>
                    </CardContent>
                  </Card>
                  <Card className={selectedItem.rate > 100 ? "border-destructive/50" : ""}>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">执行率</p>
                      <p className={`text-xl font-bold ${selectedItem.rate > 100 ? "text-destructive" : ""}`}>
                        {selectedItem.rate}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">执行进度</p>
                  <Progress
                    value={Math.min(selectedItem.rate, 100)}
                    className={`h-3 ${selectedItem.rate > 100 ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">上月执行率: {selectedItem.lastMonth}%</span>
                  <span className="text-muted-foreground">
                    环比:
                    <span className={selectedItem.rate > selectedItem.lastMonth ? "text-destructive" : "text-success"}>
                      {selectedItem.rate > selectedItem.lastMonth ? "+" : ""}
                      {(selectedItem.rate - selectedItem.lastMonth).toFixed(1)}%
                    </span>
                  </span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedItem?.department} - 预警设置</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>启用预警</Label>
                    <p className="text-sm text-muted-foreground">当执行率达到阈值时发送预警通知</p>
                  </div>
                  <Switch
                    checked={selectedItem.alertEnabled}
                    onCheckedChange={() => handleToggleAlert(selectedItem.id)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>预警阈值 (%)</Label>
                  <Input
                    type="number"
                    value={selectedItem.alertThreshold}
                    onChange={(e) => handleUpdateThreshold(Number(e.target.value))}
                    disabled={!selectedItem.alertEnabled}
                  />
                  <p className="text-xs text-muted-foreground">当执行率达到此阈值时触发预警</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
                取消
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setSettingsDialogOpen(false)}>
                保存设置
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert History Dialog */}
        <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>预警记录</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>预警类型</TableHead>
                    <TableHead>预警内容</TableHead>
                    <TableHead className="text-center">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertHistory.map((alert, idx) => (
                    <TableRow key={idx} className={alert.status === "unread" ? "bg-destructive/5" : ""}>
                      <TableCell className="text-muted-foreground">{alert.time}</TableCell>
                      <TableCell className="font-medium">{alert.department}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            alert.type === "超支预警"
                              ? "bg-destructive/20 text-destructive"
                              : "bg-warning/20 text-warning"
                          }
                        >
                          {alert.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{alert.message}</TableCell>
                      <TableCell className="text-center">
                        {alert.status === "unread" ? (
                          <Badge className="bg-primary/20 text-primary">未读</Badge>
                        ) : (
                          <Badge variant="outline">已读</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
