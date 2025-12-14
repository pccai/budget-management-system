"use client"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, GitBranch, CheckCircle2, Clock, Lock, Copy } from "lucide-react"

const versions = [
  {
    id: "1",
    code: "V2025-01",
    name: "2025年初始版",
    year: "2025",
    status: "locked",
    createTime: "2024-11-01",
    creator: "张明",
  },
  {
    id: "2",
    code: "V2025-02",
    name: "2025年调整版V1",
    year: "2025",
    status: "active",
    createTime: "2025-03-15",
    creator: "李华",
  },
  {
    id: "3",
    code: "V2025-03",
    name: "2025年调整版V2",
    year: "2025",
    status: "draft",
    createTime: "2025-06-01",
    creator: "王芳",
  },
  {
    id: "4",
    code: "V2024-FINAL",
    name: "2024年最终版",
    year: "2024",
    status: "locked",
    createTime: "2024-12-31",
    creator: "张明",
  },
]

export default function VersionsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">版本管理</h1>
            <p className="text-muted-foreground">管理预算版本，支持多版本共存与对比</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            新建版本
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">版本总数</p>
                <p className="text-2xl font-bold">{versions.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前版本</p>
                <p className="text-2xl font-bold">V2025-02</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">草稿版本</p>
                <p className="text-2xl font-bold">{versions.filter((v) => v.status === "draft").length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已锁定</p>
                <p className="text-2xl font-bold">{versions.filter((v) => v.status === "locked").length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">版本列表</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>版本编码</TableHead>
                  <TableHead>版本名称</TableHead>
                  <TableHead>预算年度</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>创建人</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-mono">{version.code}</TableCell>
                    <TableCell className="font-medium">{version.name}</TableCell>
                    <TableCell>{version.year}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          version.status === "active"
                            ? "bg-success/20 text-success"
                            : version.status === "draft"
                              ? "bg-warning/20 text-warning"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {version.status === "active" ? "当前" : version.status === "draft" ? "草稿" : "已锁定"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{version.createTime}</TableCell>
                    <TableCell>{version.creator}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4 mr-1" />
                        复制
                      </Button>
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
