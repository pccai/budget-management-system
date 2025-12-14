"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, ChevronRight, ChevronDown, Plus, Edit2, Trash2, Search, Users, Wallet } from "lucide-react"

interface OrgNode {
  id: string
  name: string
  code: string
  type: "集团" | "公司" | "部门" | "成本中心"
  budgetOrg?: string
  accountOrg?: string
  children?: OrgNode[]
  expanded?: boolean
}

const initialOrgData: OrgNode[] = [
  {
    id: "1",
    name: "集团总部",
    code: "HQ001",
    type: "集团",
    budgetOrg: "B001",
    accountOrg: "A001",
    expanded: true,
    children: [
      {
        id: "1-1",
        name: "北方区域公司",
        code: "NR001",
        type: "公司",
        budgetOrg: "B002",
        accountOrg: "A002",
        expanded: true,
        children: [
          { id: "1-1-1", name: "研发部", code: "NR-RD", type: "部门", budgetOrg: "B003", accountOrg: "A003" },
          { id: "1-1-2", name: "市场部", code: "NR-MK", type: "部门", budgetOrg: "B004", accountOrg: "A004" },
          { id: "1-1-3", name: "销售部", code: "NR-SL", type: "部门", budgetOrg: "B005", accountOrg: "A005" },
        ],
      },
      {
        id: "1-2",
        name: "南方区域公司",
        code: "SR001",
        type: "公司",
        budgetOrg: "B006",
        accountOrg: "A006",
        children: [
          { id: "1-2-1", name: "研发部", code: "SR-RD", type: "部门", budgetOrg: "B007", accountOrg: "A007" },
          { id: "1-2-2", name: "市场部", code: "SR-MK", type: "部门", budgetOrg: "B008", accountOrg: "A008" },
        ],
      },
      {
        id: "1-3",
        name: "财务共享中心",
        code: "FSC001",
        type: "成本中心",
        budgetOrg: "B009",
        accountOrg: "A009",
      },
    ],
  },
]

export default function OrganizationPage() {
  const [orgData, setOrgData] = useState<OrgNode[]>(initialOrgData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const toggleExpand = (nodeId: string) => {
    const updateNodes = (nodes: OrgNode[]): OrgNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) }
        }
        return node
      })
    }
    setOrgData(updateNodes(orgData))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "集团":
        return "bg-primary text-primary-foreground"
      case "公司":
        return "bg-chart-2 text-white"
      case "部门":
        return "bg-chart-4 text-white"
      case "成本中心":
        return "bg-chart-3 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const renderOrgTree = (nodes: OrgNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors ${
            selectedNode?.id === node.id ? "bg-secondary" : ""
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          onClick={() => setSelectedNode(node)}
        >
          {node.children && node.children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(node.id)
              }}
              className="p-1 hover:bg-muted rounded"
            >
              {node.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <span className="w-6" />
          )}
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{node.name}</span>
              <Badge variant="secondary" className={`text-xs ${getTypeColor(node.type)}`}>
                {node.type}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{node.code}</span>
          </div>
        </div>
        {node.expanded && node.children && renderOrgTree(node.children, level + 1)}
      </div>
    ))
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">组织架构管理</h1>
            <p className="text-muted-foreground">管理行政组织、预算组织与核算组织的映射关系</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                新增组织
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增组织节点</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>组织名称</Label>
                  <Input placeholder="请输入组织名称" />
                </div>
                <div className="space-y-2">
                  <Label>组织编码</Label>
                  <Input placeholder="请输入组织编码" />
                </div>
                <div className="space-y-2">
                  <Label>组织类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择组织类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="集团">集团</SelectItem>
                      <SelectItem value="公司">公司</SelectItem>
                      <SelectItem value="部门">部门</SelectItem>
                      <SelectItem value="成本中心">成本中心</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>上级组织</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择上级组织" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HQ001">集团总部</SelectItem>
                      <SelectItem value="NR001">北方区域公司</SelectItem>
                      <SelectItem value="SR001">南方区域公司</SelectItem>
                    </SelectContent>
                  </Select>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organization Tree */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">组织树</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索组织..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">{renderOrgTree(orgData)}</CardContent>
          </Card>

          {/* Detail Panel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">组织详情</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{selectedNode.name}</h3>
                      <Badge className={getTypeColor(selectedNode.type)}>{selectedNode.type}</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">组织编码</span>
                      <span className="font-medium">{selectedNode.code}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">预算组织</span>
                      <span className="font-medium">{selectedNode.budgetOrg || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">核算组织</span>
                      <span className="font-medium">{selectedNode.accountOrg || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">下级数量</span>
                      <span className="font-medium">{selectedNode.children?.length || 0}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Card className="p-4 bg-secondary/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">人员数</span>
                      </div>
                      <p className="text-xl font-bold">128</p>
                    </Card>
                    <Card className="p-4 bg-secondary/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Wallet className="w-4 h-4" />
                        <span className="text-sm">预算额</span>
                      </div>
                      <p className="text-xl font-bold">¥500万</p>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit2 className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      删除
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>选择一个组织查看详情</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
