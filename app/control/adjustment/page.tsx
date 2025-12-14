"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowRightLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Eye,
  Send,
  MoreHorizontal,
  Search,
  Download,
  RotateCcw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdjustmentRecord {
  id: string
  type: "add" | "reduce" | "transfer"
  from: string
  to: string
  fromSubject: string
  toSubject: string
  amount: number
  status: "draft" | "pending" | "approved" | "rejected"
  applicant: string
  reason: string
  createTime: string
  approveTime?: string
  approver?: string
  rejectReason?: string
}

const initialData: AdjustmentRecord[] = [
  {
    id: "ADJ001",
    type: "add",
    from: "-",
    to: "研发部",
    fromSubject: "-",
    toSubject: "人工成本",
    amount: 200,
    status: "approved",
    applicant: "财务部-张经理",
    reason: "研发人员扩招，需追加人工成本预算",
    createTime: "2025-11-15 09:00",
    approveTime: "2025-11-16 14:30",
    approver: "王总监",
  },
  {
    id: "ADJ002",
    type: "transfer",
    from: "行政部",
    to: "市场部",
    fromSubject: "办公费用",
    toSubject: "办公费用",
    amount: 50,
    status: "pending",
    applicant: "市场部-李经理",
    reason: "市场部Q4推广活动增加，需从行政部调剂办公费用",
    createTime: "2025-12-01 10:30",
  },
  {
    id: "ADJ003",
    type: "reduce",
    from: "销售部",
    to: "-",
    fromSubject: "差旅费用",
    toSubject: "-",
    amount: 100,
    status: "approved",
    applicant: "销售部-赵经理",
    reason: "Q4销售策略调整，减少出差频率，释放差旅预算",
    createTime: "2025-10-20 14:00",
    approveTime: "2025-10-22 11:00",
    approver: "钱总监",
  },
  {
    id: "ADJ004",
    type: "transfer",
    from: "研发部",
    to: "销售部",
    fromSubject: "培训费用",
    toSubject: "业务招待费",
    amount: 30,
    status: "rejected",
    applicant: "销售部-周经理",
    reason: "销售部招待费用紧张，申请从研发部培训费用调剂",
    createTime: "2025-11-25 16:00",
    approveTime: "2025-11-26 10:00",
    approver: "王总监",
    rejectReason: "研发部培训计划紧张，建议通过追加方式解决",
  },
  {
    id: "ADJ005",
    type: "add",
    from: "-",
    to: "人力部",
    fromSubject: "-",
    toSubject: "培训费用",
    amount: 80,
    status: "draft",
    applicant: "人力部-孙经理",
    reason: "年底培训需求增加，需追加培训预算",
    createTime: "2025-12-03 08:30",
  },
]

const departments = ["研发部", "市场部", "销售部", "行政部", "人力部", "财务部"]
const subjects = ["人工成本", "办公费用", "差旅费用", "业务招待费", "培训费用", "市场推广费"]

export default function AdjustmentPage() {
  const [data, setData] = useState<AdjustmentRecord[]>(initialData)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AdjustmentRecord | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<AdjustmentRecord | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const [formData, setFormData] = useState({
    type: "add" as "add" | "reduce" | "transfer",
    from: "",
    to: "",
    fromSubject: "",
    toSubject: "",
    amount: 0,
    reason: "",
  })

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicant.includes(searchTerm) ||
      item.reason.includes(searchTerm)
    const matchStatus = statusFilter === "all" || item.status === statusFilter
    const matchType = typeFilter === "all" || item.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  const addAmount = data
    .filter((d) => d.type === "add" && d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0)
  const reduceAmount = data
    .filter((d) => d.type === "reduce" && d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0)
  const transferAmount = data
    .filter((d) => d.type === "transfer" && d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0)
  const pendingCount = data.filter((d) => d.status === "pending" || d.status === "draft").length

  const handleOpenCreate = () => {
    setEditingRecord(null)
    setFormData({
      type: "add",
      from: "",
      to: "",
      fromSubject: "",
      toSubject: "",
      amount: 0,
      reason: "",
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (record: AdjustmentRecord) => {
    setEditingRecord(record)
    setFormData({
      type: record.type,
      from: record.from,
      to: record.to,
      fromSubject: record.fromSubject,
      toSubject: record.toSubject,
      amount: record.amount,
      reason: record.reason,
    })
    setDialogOpen(true)
  }

  const handleSave = (submitForApproval = false) => {
    const now = new Date().toLocaleString()
    if (editingRecord) {
      setData((prev) =>
        prev.map((d) =>
          d.id === editingRecord.id
            ? {
                ...d,
                ...formData,
                status: submitForApproval ? ("pending" as const) : d.status,
              }
            : d,
        ),
      )
    } else {
      const newRecord: AdjustmentRecord = {
        id: `ADJ${String(data.length + 1).padStart(3, "0")}`,
        type: formData.type,
        from: formData.type === "add" ? "-" : formData.from,
        to: formData.type === "reduce" ? "-" : formData.to,
        fromSubject: formData.type === "add" ? "-" : formData.fromSubject,
        toSubject: formData.type === "reduce" ? "-" : formData.toSubject,
        amount: formData.amount,
        status: submitForApproval ? "pending" : "draft",
        applicant: "当前用户",
        reason: formData.reason,
        createTime: now,
      }
      setData((prev) => [...prev, newRecord])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingId) {
      setData((prev) => prev.filter((d) => d.id !== deletingId))
      setDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  const handleSubmitForApproval = (record: AdjustmentRecord) => {
    setData((prev) => prev.map((d) => (d.id === record.id ? { ...d, status: "pending" as const } : d)))
  }

  const handleWithdraw = (record: AdjustmentRecord) => {
    setData((prev) => prev.map((d) => (d.id === record.id ? { ...d, status: "draft" as const } : d)))
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "add":
        return "追加"
      case "reduce":
        return "追减"
      case "transfer":
        return "调剂"
      default:
        return type
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "add":
        return <Badge className="bg-success/20 text-success">追加</Badge>
      case "reduce":
        return <Badge className="bg-destructive/20 text-destructive">追减</Badge>
      case "transfer":
        return <Badge className="bg-primary/20 text-primary">调剂</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">草稿</Badge>
      case "pending":
        return <Badge className="bg-warning/20 text-warning">审批中</Badge>
      case "approved":
        return <Badge className="bg-success/20 text-success">已审批</Badge>
      case "rejected":
        return <Badge className="bg-destructive/20 text-destructive">已驳回</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">预算调整</h1>
            <p className="text-muted-foreground">预算追加、追减与部门间调剂</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出记录
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              新建调整
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">追加金额</p>
                <p className="text-2xl font-bold text-success">+¥{addAmount}万</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">追减金额</p>
                <p className="text-2xl font-bold text-destructive">-¥{reduceAmount}万</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">调剂金额</p>
                <p className="text-2xl font-bold">¥{transferAmount}万</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Send className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">待处理</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Adjustments Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-base font-medium">调整记录</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索单据号/申请人/原因..."
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="add">追加</SelectItem>
                    <SelectItem value="reduce">追减</SelectItem>
                    <SelectItem value="transfer">调剂</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="pending">审批中</SelectItem>
                    <SelectItem value="approved">已审批</SelectItem>
                    <SelectItem value="rejected">已驳回</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>单据编号</TableHead>
                  <TableHead>调整类型</TableHead>
                  <TableHead>调出方</TableHead>
                  <TableHead>调入方</TableHead>
                  <TableHead>预算科目</TableHead>
                  <TableHead className="text-right">金额(万)</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead>申请人</TableHead>
                  <TableHead>申请日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.id}</TableCell>
                    <TableCell>{getTypeBadge(item.type)}</TableCell>
                    <TableCell>{item.from}</TableCell>
                    <TableCell>{item.to}</TableCell>
                    <TableCell>
                      {item.type === "transfer"
                        ? `${item.fromSubject} → ${item.toSubject}`
                        : item.type === "add"
                          ? item.toSubject
                          : item.fromSubject}
                    </TableCell>
                    <TableCell className="text-right font-medium">{item.amount}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.applicant}</TableCell>
                    <TableCell className="text-muted-foreground">{item.createTime.split(" ")[0]}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRecord(item)
                              setDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            查看详情
                          </DropdownMenuItem>
                          {item.status === "draft" && (
                            <>
                              <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                                <Edit className="w-4 h-4 mr-2" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSubmitForApproval(item)}>
                                <Send className="w-4 h-4 mr-2" />
                                提交审批
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setDeletingId(item.id)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </>
                          )}
                          {item.status === "pending" && (
                            <DropdownMenuItem onClick={() => handleWithdraw(item)}>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              撤回申请
                            </DropdownMenuItem>
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

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingRecord ? "编辑预算调整" : "新建预算调整"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>调整类型</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, type: v as "add" | "reduce" | "transfer" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择调整类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">追加预算 - 增加预算总额</SelectItem>
                    <SelectItem value="reduce">追减预算 - 减少预算总额</SelectItem>
                    <SelectItem value="transfer">预算调剂 - 部门/科目间转移</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type !== "add" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>调出部门</Label>
                    <Select value={formData.from} onValueChange={(v) => setFormData((prev) => ({ ...prev, from: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择部门" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>调出科目</Label>
                    <Select
                      value={formData.fromSubject}
                      onValueChange={(v) => setFormData((prev) => ({ ...prev, fromSubject: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择科目" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {formData.type !== "reduce" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>调入部门</Label>
                    <Select value={formData.to} onValueChange={(v) => setFormData((prev) => ({ ...prev, to: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择部门" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>调入科目</Label>
                    <Select
                      value={formData.toSubject}
                      onValueChange={(v) => setFormData((prev) => ({ ...prev, toSubject: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择科目" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>调整金额(万元)</Label>
                <Input
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="请输入金额"
                />
              </div>
              <div className="space-y-2">
                <Label>调整原因</Label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="请说明预算调整的原因"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button variant="outline" onClick={() => handleSave(false)}>
                保存草稿
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => handleSave(true)}>
                <Send className="w-4 h-4 mr-2" />
                提交审批
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>调整详情</DialogTitle>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">单据编号</p>
                    <p className="font-mono font-medium">{selectedRecord.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">调整类型</p>
                    {getTypeBadge(selectedRecord.type)}
                  </div>
                  {selectedRecord.type !== "add" && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">调出部门</p>
                        <p className="font-medium">{selectedRecord.from}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">调出科目</p>
                        <p className="font-medium">{selectedRecord.fromSubject}</p>
                      </div>
                    </>
                  )}
                  {selectedRecord.type !== "reduce" && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">调入部门</p>
                        <p className="font-medium">{selectedRecord.to}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">调入科目</p>
                        <p className="font-medium">{selectedRecord.toSubject}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">调整金额</p>
                    <p className="font-medium text-lg">¥{selectedRecord.amount}万</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">当前状态</p>
                    {getStatusBadge(selectedRecord.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">申请人</p>
                    <p className="font-medium">{selectedRecord.applicant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">申请时间</p>
                    <p className="font-medium">{selectedRecord.createTime}</p>
                  </div>
                  {selectedRecord.approver && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">审批人</p>
                        <p className="font-medium">{selectedRecord.approver}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">审批时间</p>
                        <p className="font-medium">{selectedRecord.approveTime}</p>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">调整原因</p>
                  <p className="font-medium">{selectedRecord.reason}</p>
                </div>
                {selectedRecord.rejectReason && (
                  <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">驳回原因</p>
                    <p className="text-sm">{selectedRecord.rejectReason}</p>
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

        {/* Delete Confirm Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>确定要删除此预算调整申请吗？删除后将无法恢复。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  )
}
