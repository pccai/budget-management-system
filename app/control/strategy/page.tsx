"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import {
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  Power,
  PowerOff,
  Settings2,
  History,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Strategy {
  id: string
  name: string
  type: "hard" | "soft" | "warning"
  scope: string
  subjects: string[]
  threshold: number
  action: string
  enabled: boolean
  priority: number
  description: string
  createdAt: string
  updatedAt: string
}

const initialStrategies: Strategy[] = [
  {
    id: "STR001",
    name: "费用刚性控制",
    type: "hard",
    scope: "全公司",
    subjects: ["办公费用", "差旅费用", "业务招待费"],
    threshold: 100,
    action: "超预算禁止提交",
    enabled: true,
    priority: 1,
    description: "当费用预算使用率达到100%时，禁止提交新的费用申请",
    createdAt: "2025-01-01",
    updatedAt: "2025-12-01",
  },
  {
    id: "STR002",
    name: "人工成本柔性控制",
    type: "soft",
    scope: "研发部, 市场部",
    subjects: ["人工成本"],
    threshold: 100,
    action: "超预算需额外审批",
    enabled: true,
    priority: 2,
    description: "当人工成本超预算时，允许提交但需要更高级别的审批",
    createdAt: "2025-01-01",
    updatedAt: "2025-11-15",
  },
  {
    id: "STR003",
    name: "预算预警提醒",
    type: "warning",
    scope: "全公司",
    subjects: ["所有科目"],
    threshold: 80,
    action: "发送预警通知",
    enabled: true,
    priority: 3,
    description: "当预算使用率达到80%时，向相关负责人发送预警通知",
    createdAt: "2025-01-01",
    updatedAt: "2025-10-20",
  },
  {
    id: "STR004",
    name: "项目预算控制",
    type: "hard",
    scope: "项目类预算",
    subjects: ["项目费用", "研发投入"],
    threshold: 100,
    action: "超预算禁止支付",
    enabled: false,
    priority: 4,
    description: "项目预算用完后禁止继续支付，需要进行预算追加",
    createdAt: "2025-03-01",
    updatedAt: "2025-09-10",
  },
]

const historyLogs = [
  { time: "2025-12-03 14:30", user: "张财务", action: "修改", strategy: "费用刚性控制", detail: "阈值从95%调整为100%" },
  { time: "2025-12-02 09:15", user: "李经理", action: "启用", strategy: "人工成本柔性控制", detail: "启用策略" },
  { time: "2025-12-01 16:45", user: "王总监", action: "新建", strategy: "预算预警提醒", detail: "创建新策略" },
  { time: "2025-11-28 11:00", user: "张财务", action: "禁用", strategy: "项目预算控制", detail: "临时禁用策略" },
]

export default function StrategyPage() {
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    type: "hard" as "hard" | "soft" | "warning",
    scope: "",
    subjects: "",
    threshold: 100,
    action: "",
    description: "",
    priority: 1,
  })

  const handleOpenCreate = () => {
    setEditingStrategy(null)
    setFormData({
      name: "",
      type: "hard",
      scope: "",
      subjects: "",
      threshold: 100,
      action: "",
      description: "",
      priority: strategies.length + 1,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy)
    setFormData({
      name: strategy.name,
      type: strategy.type,
      scope: strategy.scope,
      subjects: strategy.subjects.join(", "),
      threshold: strategy.threshold,
      action: strategy.action,
      description: strategy.description,
      priority: strategy.priority,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    const now = new Date().toISOString().split("T")[0]
    if (editingStrategy) {
      setStrategies((prev) =>
        prev.map((s) =>
          s.id === editingStrategy.id
            ? {
                ...s,
                ...formData,
                subjects: formData.subjects.split(",").map((s) => s.trim()),
                updatedAt: now,
              }
            : s,
        ),
      )
    } else {
      const newStrategy: Strategy = {
        id: `STR${String(strategies.length + 1).padStart(3, "0")}`,
        name: formData.name,
        type: formData.type,
        scope: formData.scope,
        subjects: formData.subjects.split(",").map((s) => s.trim()),
        threshold: formData.threshold,
        action: formData.action,
        description: formData.description,
        priority: formData.priority,
        enabled: true,
        createdAt: now,
        updatedAt: now,
      }
      setStrategies((prev) => [...prev, newStrategy])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingId) {
      setStrategies((prev) => prev.filter((s) => s.id !== deletingId))
      setDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  const handleToggleEnabled = (id: string) => {
    setStrategies((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
  }

  const handleDuplicate = (strategy: Strategy) => {
    const now = new Date().toISOString().split("T")[0]
    const newStrategy: Strategy = {
      ...strategy,
      id: `STR${String(strategies.length + 1).padStart(3, "0")}`,
      name: `${strategy.name} (副本)`,
      createdAt: now,
      updatedAt: now,
    }
    setStrategies((prev) => [...prev, newStrategy])
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hard":
        return <Shield className="w-4 h-4" />
      case "soft":
        return <ShieldCheck className="w-4 h-4" />
      case "warning":
        return <ShieldAlert className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "hard":
        return <Badge className="bg-destructive/20 text-destructive">刚性控制</Badge>
      case "soft":
        return <Badge className="bg-warning/20 text-warning">柔性控制</Badge>
      case "warning":
        return <Badge className="bg-primary/20 text-primary">预警提醒</Badge>
      default:
        return <Badge>未知</Badge>
    }
  }

  const hardCount = strategies.filter((s) => s.type === "hard" && s.enabled).length
  const softCount = strategies.filter((s) => s.type === "soft" && s.enabled).length
  const warningCount = strategies.filter((s) => s.type === "warning" && s.enabled).length

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">控制策略</h1>
            <p className="text-muted-foreground">配置预算的刚性控制、柔性控制和预警规则</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setHistoryDialogOpen(true)}>
              <History className="w-4 h-4 mr-2" />
              变更历史
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              新建策略
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Settings2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">策略总数</p>
                <p className="text-2xl font-bold">{strategies.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">刚性控制</p>
                <p className="text-2xl font-bold">{hardCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">柔性控制</p>
                <p className="text-2xl font-bold">{softCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">预警规则</p>
                <p className="text-2xl font-bold">{warningCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategies Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">策略列表</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">状态</TableHead>
                  <TableHead>策略名称</TableHead>
                  <TableHead>控制类型</TableHead>
                  <TableHead>适用范围</TableHead>
                  <TableHead>控制科目</TableHead>
                  <TableHead className="text-center">阈值</TableHead>
                  <TableHead>控制动作</TableHead>
                  <TableHead className="text-center">优先级</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategies.map((strategy) => (
                  <TableRow key={strategy.id} className={!strategy.enabled ? "opacity-50" : ""}>
                    <TableCell>
                      <Switch checked={strategy.enabled} onCheckedChange={() => handleToggleEnabled(strategy.id)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(strategy.type)}
                        <span className="font-medium">{strategy.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(strategy.type)}</TableCell>
                    <TableCell>{strategy.scope}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {strategy.subjects.slice(0, 2).map((subject, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {strategy.subjects.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{strategy.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">{strategy.threshold}%</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{strategy.action}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{strategy.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(strategy)}>
                            <Edit className="w-4 h-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(strategy)}>
                            <Copy className="w-4 h-4 mr-2" />
                            复制
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleEnabled(strategy.id)}>
                            {strategy.enabled ? (
                              <>
                                <PowerOff className="w-4 h-4 mr-2" />
                                禁用
                              </>
                            ) : (
                              <>
                                <Power className="w-4 h-4 mr-2" />
                                启用
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setDeletingId(strategy.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            删除
                          </DropdownMenuItem>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingStrategy ? "编辑控制策略" : "新建控制策略"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>策略名称</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="输入策略名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label>控制类型</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, type: v as "hard" | "soft" | "warning" }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hard">刚性控制 - 超预算禁止操作</SelectItem>
                      <SelectItem value="soft">柔性控制 - 超预算需额外审批</SelectItem>
                      <SelectItem value="warning">预警提醒 - 达到阈值发送通知</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>适用范围</Label>
                  <Input
                    value={formData.scope}
                    onChange={(e) => setFormData((prev) => ({ ...prev, scope: e.target.value }))}
                    placeholder="如：全公司、研发部"
                  />
                </div>
                <div className="space-y-2">
                  <Label>控制阈值 (%)</Label>
                  <Input
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => setFormData((prev) => ({ ...prev, threshold: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>控制科目（多个用逗号分隔）</Label>
                <Input
                  value={formData.subjects}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subjects: e.target.value }))}
                  placeholder="如：办公费用, 差旅费用, 业务招待费"
                />
              </div>
              <div className="space-y-2">
                <Label>控制动作</Label>
                <Input
                  value={formData.action}
                  onChange={(e) => setFormData((prev) => ({ ...prev, action: e.target.value }))}
                  placeholder="如：超预算禁止提交"
                />
              </div>
              <div className="space-y-2">
                <Label>策略说明</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="详细描述该控制策略的作用"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
                {editingStrategy ? "保存修改" : "创建策略"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除此控制策略吗？删除后将无法恢复，且相关的预算控制规则将失效。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* History Dialog */}
        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>变更历史</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>操作人</TableHead>
                    <TableHead>操作类型</TableHead>
                    <TableHead>策略名称</TableHead>
                    <TableHead>变更内容</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyLogs.map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-muted-foreground">{log.time}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.strategy}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.detail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
