"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ClipboardList,
  Lock,
  Unlock,
  Clock,
  Search,
  Download,
  Eye,
  RefreshCw,
  ArrowRightLeft,
  MoreHorizontal,
  FileText,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface OccupationRecord {
  id: string
  type: string
  bizNo: string
  department: string
  subject: string
  amount: number
  status: "occupied" | "deducted" | "released"
  applicant: string
  time: string
  releaseTime?: string
  remark?: string
}

const initialData: OccupationRecord[] = [
  {
    id: "OCC001",
    type: "采购申请",
    bizNo: "PR2025120301",
    department: "研发部",
    subject: "办公费用",
    amount: 50,
    status: "occupied",
    applicant: "张三",
    time: "2025-12-03 09:30",
    remark: "采购办公设备",
  },
  {
    id: "OCC002",
    type: "报销单",
    bizNo: "EXP2025120301",
    department: "市场部",
    subject: "差旅费用",
    amount: 120,
    status: "deducted",
    applicant: "李四",
    time: "2025-12-03 10:15",
    remark: "上海出差报销",
  },
  {
    id: "OCC003",
    type: "合同付款",
    bizNo: "CON2025120201",
    department: "销售部",
    subject: "业务招待费",
    amount: 80,
    status: "occupied",
    applicant: "王五",
    time: "2025-12-02 16:00",
    remark: "客户招待费用",
  },
  {
    id: "OCC004",
    type: "采购申请",
    bizNo: "PR2025120101",
    department: "行政部",
    subject: "办公费用",
    amount: 30,
    status: "released",
    applicant: "赵六",
    time: "2025-12-01 14:20",
    releaseTime: "2025-12-02 09:00",
    remark: "采购申请已取消",
  },
  {
    id: "OCC005",
    type: "报销单",
    bizNo: "EXP2025113001",
    department: "人力部",
    subject: "培训费用",
    amount: 45,
    status: "deducted",
    applicant: "孙七",
    time: "2025-11-30 11:20",
    remark: "员工培训费用",
  },
]

const trendData = [
  { date: "11-25", occupied: 120, deducted: 80, released: 20 },
  { date: "11-26", occupied: 150, deducted: 100, released: 30 },
  { date: "11-27", occupied: 180, deducted: 120, released: 25 },
  { date: "11-28", occupied: 160, deducted: 140, released: 40 },
  { date: "11-29", occupied: 200, deducted: 150, released: 35 },
  { date: "11-30", occupied: 170, deducted: 160, released: 45 },
  { date: "12-01", occupied: 130, deducted: 120, released: 30 },
  { date: "12-02", occupied: 145, deducted: 130, released: 28 },
  { date: "12-03", occupied: 130, deducted: 120, released: 30 },
]

export default function OccupationPage() {
  const [data, setData] = useState<OccupationRecord[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<OccupationRecord | null>(null)
  const [activeTab, setActiveTab] = useState("list")

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bizNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.includes(searchTerm) ||
      item.applicant.includes(searchTerm)
    const matchStatus = statusFilter === "all" || item.status === statusFilter
    const matchType = typeFilter === "all" || item.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  const occupiedAmount = data.filter((d) => d.status === "occupied").reduce((sum, d) => sum + d.amount, 0)
  const deductedAmount = data.filter((d) => d.status === "deducted").reduce((sum, d) => sum + d.amount, 0)
  const releasedAmount = data.filter((d) => d.status === "released").reduce((sum, d) => sum + d.amount, 0)
  const pendingCount = data.filter((d) => d.status === "occupied").length

  const handleViewDetail = (record: OccupationRecord) => {
    setSelectedRecord(record)
    setDetailDialogOpen(true)
  }

  const handleRelease = (record: OccupationRecord) => {
    setSelectedRecord(record)
    setReleaseDialogOpen(true)
  }

  const confirmRelease = () => {
    if (selectedRecord) {
      setData((prev) =>
        prev.map((d) =>
          d.id === selectedRecord.id
            ? { ...d, status: "released" as const, releaseTime: new Date().toLocaleString() }
            : d,
        ),
      )
      setReleaseDialogOpen(false)
      setSelectedRecord(null)
    }
  }

  const handleForceDeduct = (record: OccupationRecord) => {
    setData((prev) => prev.map((d) => (d.id === record.id ? { ...d, status: "deducted" as const } : d)))
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">预算占用</h1>
            <p className="text-muted-foreground">管理预算的预占用、正式扣减与释放</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
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
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">预占用金额</p>
                <p className="text-2xl font-bold text-warning">¥{occupiedAmount}万</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已扣减金额</p>
                <p className="text-2xl font-bold text-destructive">¥{deductedAmount}万</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Unlock className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已释放金额</p>
                <p className="text-2xl font-bold text-success">¥{releasedAmount}万</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">待处理单据</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">占用明细</TabsTrigger>
            <TabsTrigger value="trend">趋势分析</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-base font-medium">占用明细</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索单据号/部门/申请人..."
                        className="pl-9 w-64"
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
                        <SelectItem value="occupied">预占用</SelectItem>
                        <SelectItem value="deducted">已扣减</SelectItem>
                        <SelectItem value="released">已释放</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="类型筛选" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="采购申请">采购申请</SelectItem>
                        <SelectItem value="报销单">报销单</SelectItem>
                        <SelectItem value="合同付款">合同付款</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>占用编号</TableHead>
                      <TableHead>业务类型</TableHead>
                      <TableHead>业务单号</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>预算科目</TableHead>
                      <TableHead>申请人</TableHead>
                      <TableHead className="text-right">金额(万)</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead>占用时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-primary">{item.bizNo}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>{item.applicant}</TableCell>
                        <TableCell className="text-right font-medium">{item.amount}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              item.status === "occupied"
                                ? "bg-warning/20 text-warning"
                                : item.status === "deducted"
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-success/20 text-success"
                            }
                          >
                            {item.status === "occupied" ? "预占用" : item.status === "deducted" ? "已扣减" : "已释放"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.time}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetail(item)}>
                                <Eye className="w-4 h-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open("#", "_blank")}>
                                <FileText className="w-4 h-4 mr-2" />
                                查看原单据
                              </DropdownMenuItem>
                              {item.status === "occupied" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleForceDeduct(item)}>
                                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                                    强制扣减
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRelease(item)}>
                                    <Unlock className="w-4 h-4 mr-2" />
                                    释放额度
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">占用趋势分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
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
                        dataKey="occupied"
                        stackId="1"
                        stroke="#eab308"
                        fill="#eab308"
                        fillOpacity={0.6}
                        name="预占用"
                      />
                      <Area
                        type="monotone"
                        dataKey="deducted"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                        name="已扣减"
                      />
                      <Area
                        type="monotone"
                        dataKey="released"
                        stackId="1"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.6}
                        name="已释放"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>占用详情</DialogTitle>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">占用编号</p>
                    <p className="font-mono font-medium">{selectedRecord.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">业务单号</p>
                    <p className="font-mono font-medium text-primary">{selectedRecord.bizNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">业务类型</p>
                    <p className="font-medium">{selectedRecord.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">部门</p>
                    <p className="font-medium">{selectedRecord.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">预算科目</p>
                    <p className="font-medium">{selectedRecord.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">申请人</p>
                    <p className="font-medium">{selectedRecord.applicant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">占用金额</p>
                    <p className="font-medium text-lg">¥{selectedRecord.amount}万</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">当前状态</p>
                    <Badge
                      className={
                        selectedRecord.status === "occupied"
                          ? "bg-warning/20 text-warning"
                          : selectedRecord.status === "deducted"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-success/20 text-success"
                      }
                    >
                      {selectedRecord.status === "occupied"
                        ? "预占用"
                        : selectedRecord.status === "deducted"
                          ? "已扣减"
                          : "已释放"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">占用时间</p>
                    <p className="font-medium">{selectedRecord.time}</p>
                  </div>
                  {selectedRecord.releaseTime && (
                    <div>
                      <p className="text-sm text-muted-foreground">释放时间</p>
                      <p className="font-medium">{selectedRecord.releaseTime}</p>
                    </div>
                  )}
                </div>
                {selectedRecord.remark && (
                  <div>
                    <p className="text-sm text-muted-foreground">备注</p>
                    <p className="font-medium">{selectedRecord.remark}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Release Confirm Dialog */}
        <AlertDialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认释放预算额度</AlertDialogTitle>
              <AlertDialogDescription>
                确定要释放此预占用的预算额度吗？释放后，该金额将恢复到可用预算中。
                {selectedRecord && (
                  <div className="mt-4 p-3 bg-secondary rounded-lg">
                    <p>单据号：{selectedRecord.bizNo}</p>
                    <p>金额：¥{selectedRecord.amount}万</p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction className="bg-primary hover:bg-primary/90" onClick={confirmRelease}>
                确认释放
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  )
}
