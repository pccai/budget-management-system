"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, Search, Layers, Tag, FolderTree } from "lucide-react"

const dimensions = [
  { id: "1", code: "ORG", name: "组织维度", members: 45, status: "active" },
  { id: "2", code: "ACC", name: "科目维度", members: 128, status: "active" },
  { id: "3", code: "PRJ", name: "项目维度", members: 32, status: "active" },
  { id: "4", code: "PRD", name: "产品维度", members: 18, status: "active" },
  { id: "5", code: "CUS", name: "客户维度", members: 256, status: "inactive" },
  { id: "6", code: "CHN", name: "渠道维度", members: 12, status: "active" },
]

const subjects = [
  { code: "6001", name: "人工成本", type: "费用", level: 1 },
  { code: "6002", name: "办公费用", type: "费用", level: 1 },
  { code: "6003", name: "差旅费用", type: "费用", level: 1 },
  { code: "6004", name: "业务招待费", type: "费用", level: 1 },
  { code: "6005", name: "培训费用", type: "费用", level: 1 },
  { code: "6006", name: "市场推广费", type: "费用", level: 1 },
]

export default function DimensionsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">维度管理</h1>
            <p className="text-muted-foreground">管理预算多维数据模型</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            新增维度
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">维度总数</p>
                <p className="text-2xl font-bold">{dimensions.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                <Tag className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">维度成员</p>
                <p className="text-2xl font-bold">{dimensions.reduce((sum, d) => sum + d.members, 0)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <FolderTree className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">启用维度</p>
                <p className="text-2xl font-bold">{dimensions.filter((d) => d.status === "active").length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dimensions">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="dimensions">维度列表</TabsTrigger>
                  <TabsTrigger value="subjects">科目维度</TabsTrigger>
                </TabsList>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="dimensions" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>维度编码</TableHead>
                      <TableHead>维度名称</TableHead>
                      <TableHead className="text-center">成员数量</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dimensions.map((dim) => (
                      <TableRow key={dim.id}>
                        <TableCell className="font-mono">{dim.code}</TableCell>
                        <TableCell className="font-medium">{dim.name}</TableCell>
                        <TableCell className="text-center">{dim.members}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              dim.status === "active" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                            }
                          >
                            {dim.status === "active" ? "启用" : "停用"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="subjects" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>科目编码</TableHead>
                      <TableHead>科目名称</TableHead>
                      <TableHead>科目类型</TableHead>
                      <TableHead className="text-center">层级</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((sub) => (
                      <TableRow key={sub.code}>
                        <TableCell className="font-mono">{sub.code}</TableCell>
                        <TableCell className="font-medium">{sub.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{sub.type}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{sub.level}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </MainLayout>
  )
}
