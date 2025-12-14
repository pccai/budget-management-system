"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShieldCheck, ShieldAlert, Bell, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react"

interface ControlPolicy {
  id: string
  name: string
  type: "hard" | "soft" | "warning"
  scope: string
  dimension: string
  threshold: number
  enabled: boolean
  description: string
}

const initialPolicies: ControlPolicy[] = [
  {
    id: "1",
    name: "费用预算刚性控制",
    type: "hard",
    scope: "全公司",
    dimension: "科目",
    threshold: 100,
    enabled: true,
    description: "费用类科目超预算时禁止提交报销申请",
  },
  {
    id: "2",
    name: "差旅费柔性控制",
    type: "soft",
    scope: "销售部",
    dimension: "科目",
    threshold: 120,
    enabled: true,
    description: "差旅费超预算120%时需要额外审批",
  },
  {
    id: "3",
    name: "季度预算预警",
    type: "warning",
    scope: "全公司",
    dimension: "时间",
    threshold: 80,
    enabled: true,
    description: "季度预算执行率达到80%时发送预警通知",
  },
  {
    id: "4",
    name: "项目预算控制",
    type: "hard",
    scope: "研发部",
    dimension: "项目",
    threshold: 100,
    enabled: false,
    description: "项目预算超支时禁止新增费用",
  },
]

export default function ControlPoliciesPage() {
  const [policies, setPolicies] = useState<ControlPolicy[]>(initialPolicies)
  const [dialogOpen, setDialogOpen] = useState(false)

  const togglePolicy = (id: string) => {
    setPolicies((prev) => prev.map((policy) => (policy.id === id ? { ...policy, enabled: !policy.enabled } : policy)))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hard":
        return <ShieldCheck className="w-5 h-5" />
      case "soft":
        return <ShieldAlert className="w-5 h-5" />
      case "warning":
        return <Bell className="w-5 h-5" />
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "hard":
        return (
          <Badge className="bg-destructive/20 text-destructive">
            <ShieldCheck className="w-3 h-3 mr-1" />
            刚性控制
          </Badge>
        )
      case "soft":
        return (
          <Badge className="bg-warning/20 text-warning">
            <ShieldAlert className="w-3 h-3 mr-1" />
            柔性控制
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-primary/20 text-primary">
            <Bell className="w-3 h-3 mr-1" />
            预警提醒
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">控制策略配置</h1>
            <p className="text-muted-foreground">定义预算控制规则和预警策略</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                新增策略
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>新增控制策略</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>策略名称</Label>
                  <Input placeholder="请输入策略名称" />
                </div>
                <div className="space-y-2">
                  <Label>控制类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择控制类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hard">刚性控制（超预算禁止）</SelectItem>
                      <SelectItem value="soft">柔性控制（超预算提示）</SelectItem>
                      <SelectItem value="warning">预警提醒</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>适用范围</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择适用范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全公司</SelectItem>
                      <SelectItem value="research">研发部</SelectItem>
                      <SelectItem value="marketing">市场部</SelectItem>
                      <SelectItem value="sales">销售部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>控制维度</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择控制维度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subject">科目</SelectItem>
                      <SelectItem value="project">项目</SelectItem>
                      <SelectItem value="time">时间</SelectItem>
                      <SelectItem value="total">总额</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>阈值 (%)</Label>
                  <Input type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label>策略说明</Label>
                  <Input placeholder="请输入策略说明" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => setDialogOpen(false)}>
                    确定
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">刚性控制</p>
                <p className="text-2xl font-bold">{policies.filter((p) => p.type === "hard" && p.enabled).length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">柔性控制</p>
                <p className="text-2xl font-bold">{policies.filter((p) => p.type === "soft" && p.enabled).length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">预警规则</p>
                <p className="text-2xl font-bold">{policies.filter((p) => p.type === "warning" && p.enabled).length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已启用策略</p>
                <p className="text-2xl font-bold">{policies.filter((p) => p.enabled).length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policies Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">策略列表</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>策略名称</TableHead>
                  <TableHead>控制类型</TableHead>
                  <TableHead>适用范围</TableHead>
                  <TableHead>控制维度</TableHead>
                  <TableHead className="text-center">阈值</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            policy.type === "hard"
                              ? "bg-destructive/10 text-destructive"
                              : policy.type === "soft"
                                ? "bg-warning/10 text-warning"
                                : "bg-primary/10 text-primary"
                          }`}
                        >
                          {getTypeIcon(policy.type)}
                        </div>
                        <div>
                          <p className="font-medium">{policy.name}</p>
                          <p className="text-xs text-muted-foreground">{policy.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(policy.type)}</TableCell>
                    <TableCell>{policy.scope}</TableCell>
                    <TableCell>{policy.dimension}</TableCell>
                    <TableCell className="text-center font-mono">{policy.threshold}%</TableCell>
                    <TableCell className="text-center">
                      <Switch checked={policy.enabled} onCheckedChange={() => togglePolicy(policy.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
