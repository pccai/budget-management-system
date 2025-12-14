"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Play, RefreshCw, Save, Plus, Trash2, Copy } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface Scenario {
  id: string
  name: string
  revenueChange: number
  costChange: number
  materialChange: number
  laborChange: number
  description: string
  createdAt: string
}

const initialScenarios: Scenario[] = [
  {
    id: "1",
    name: "基准情景",
    revenueChange: 0,
    costChange: 0,
    materialChange: 0,
    laborChange: 0,
    description: "当前预算基准",
    createdAt: "2025-12-01",
  },
  {
    id: "2",
    name: "乐观情景",
    revenueChange: 15,
    costChange: -5,
    materialChange: -3,
    laborChange: 5,
    description: "市场需求增长，成本控制良好",
    createdAt: "2025-12-01",
  },
  {
    id: "3",
    name: "保守情景",
    revenueChange: -10,
    costChange: 5,
    materialChange: 8,
    laborChange: 3,
    description: "市场收缩，原材料价格上涨",
    createdAt: "2025-12-01",
  },
]

const sensitivityData = [
  { factor: "收入变化", impact: 1.0, direction: "positive" },
  { factor: "原材料成本", impact: -0.6, direction: "negative" },
  { factor: "人工成本", impact: -0.3, direction: "negative" },
  { factor: "管理费用", impact: -0.15, direction: "negative" },
  { factor: "销售费用", impact: -0.1, direction: "negative" },
]

export default function SimulationPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios)
  const [activeScenario, setActiveScenario] = useState<Scenario>(initialScenarios[0])
  const [revenueChange, setRevenueChange] = useState([0])
  const [costChange, setCostChange] = useState([0])
  const [materialChange, setMaterialChange] = useState([0])
  const [laborChange, setLaborChange] = useState([0])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [newScenarioName, setNewScenarioName] = useState("")
  const [newScenarioDesc, setNewScenarioDesc] = useState("")
  const [activeTab, setActiveTab] = useState("simulation")

  const baseRevenue = 23000
  const baseCost = 16000
  const baseMaterial = 8000
  const baseLabor = 5000
  const baseProfit = baseRevenue - baseCost

  const simulatedRevenue = baseRevenue * (1 + revenueChange[0] / 100)
  const simulatedMaterial = baseMaterial * (1 + materialChange[0] / 100)
  const simulatedLabor = baseLabor * (1 + laborChange[0] / 100)
  const simulatedOther = baseCost - baseMaterial - baseLabor
  const simulatedCost = simulatedMaterial + simulatedLabor + simulatedOther * (1 + costChange[0] / 100)
  const simulatedProfit = simulatedRevenue - simulatedCost
  const profitChange = (((simulatedProfit - baseProfit) / baseProfit) * 100).toFixed(1)
  const profitMargin = ((simulatedProfit / simulatedRevenue) * 100).toFixed(1)

  const chartData = [
    { name: "基准", revenue: baseRevenue, cost: baseCost, profit: baseProfit },
    { name: "模拟", revenue: simulatedRevenue, cost: simulatedCost, profit: simulatedProfit },
  ]

  const radarData = scenarios.map((s) => ({
    scenario: s.name,
    收入: 50 + s.revenueChange,
    成本控制: 50 - s.costChange,
    原材料: 50 - s.materialChange,
    人工: 50 - s.laborChange,
    利润率: 50 + (s.revenueChange - s.costChange) / 2,
  }))

  const handleReset = () => {
    setRevenueChange([0])
    setCostChange([0])
    setMaterialChange([0])
    setLaborChange([0])
  }

  const handleLoadScenario = (scenario: Scenario) => {
    setActiveScenario(scenario)
    setRevenueChange([scenario.revenueChange])
    setCostChange([scenario.costChange])
    setMaterialChange([scenario.materialChange])
    setLaborChange([scenario.laborChange])
  }

  const handleSaveScenario = () => {
    const newScenario: Scenario = {
      id: String(scenarios.length + 1),
      name: newScenarioName,
      revenueChange: revenueChange[0],
      costChange: costChange[0],
      materialChange: materialChange[0],
      laborChange: laborChange[0],
      description: newScenarioDesc,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setScenarios((prev) => [...prev, newScenario])
    setSaveDialogOpen(false)
    setNewScenarioName("")
    setNewScenarioDesc("")
  }

  const handleDeleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id))
  }

  const handleDuplicateScenario = (scenario: Scenario) => {
    const newScenario: Scenario = {
      ...scenario,
      id: String(scenarios.length + 1),
      name: `${scenario.name} (副本)`,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setScenarios((prev) => [...prev, newScenario])
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">情景模拟</h1>
            <p className="text-muted-foreground">修改关键假设，模拟对利润的影响</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重置
            </Button>
            <Button variant="outline" onClick={() => setSaveDialogOpen(true)}>
              <Save className="w-4 h-4 mr-2" />
              保存情景
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              运行模拟
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="simulation">情景模拟</TabsTrigger>
            <TabsTrigger value="scenarios">情景管理</TabsTrigger>
            <TabsTrigger value="sensitivity">敏感性分析</TabsTrigger>
            <TabsTrigger value="comparison">情景对比</TabsTrigger>
          </TabsList>

          <TabsContent value="simulation" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Parameters */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">模拟参数</CardTitle>
                    <Select
                      value={activeScenario.id}
                      onValueChange={(v) => {
                        const scenario = scenarios.find((s) => s.id === v)
                        if (scenario) handleLoadScenario(scenario)
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scenarios.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>收入变化</Label>
                      <span className={`font-mono ${revenueChange[0] >= 0 ? "text-success" : "text-destructive"}`}>
                        {revenueChange[0] >= 0 ? "+" : ""}
                        {revenueChange[0]}%
                      </span>
                    </div>
                    <Slider value={revenueChange} onValueChange={setRevenueChange} min={-30} max={30} step={1} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>其他成本变化</Label>
                      <span className={`font-mono ${costChange[0] <= 0 ? "text-success" : "text-destructive"}`}>
                        {costChange[0] >= 0 ? "+" : ""}
                        {costChange[0]}%
                      </span>
                    </div>
                    <Slider value={costChange} onValueChange={setCostChange} min={-30} max={30} step={1} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>原材料成本变化</Label>
                      <span className={`font-mono ${materialChange[0] <= 0 ? "text-success" : "text-destructive"}`}>
                        {materialChange[0] >= 0 ? "+" : ""}
                        {materialChange[0]}%
                      </span>
                    </div>
                    <Slider value={materialChange} onValueChange={setMaterialChange} min={-30} max={30} step={1} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>人工成本变化</Label>
                      <span className={`font-mono ${laborChange[0] <= 0 ? "text-success" : "text-destructive"}`}>
                        {laborChange[0] >= 0 ? "+" : ""}
                        {laborChange[0]}%
                      </span>
                    </div>
                    <Slider value={laborChange} onValueChange={setLaborChange} min={-30} max={30} step={1} />
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">模拟结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <Card className="bg-secondary/50">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">模拟收入</p>
                        <p className="text-xl font-bold">¥{(simulatedRevenue / 10000).toFixed(2)}亿</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">模拟成本</p>
                        <p className="text-xl font-bold">¥{(simulatedCost / 10000).toFixed(2)}亿</p>
                      </CardContent>
                    </Card>
                    <Card
                      className={`${Number(profitChange) >= 0 ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"}`}
                    >
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">模拟利润</p>
                        <p
                          className={`text-xl font-bold ${Number(profitChange) >= 0 ? "text-success" : "text-destructive"}`}
                        >
                          ¥{(simulatedProfit / 10000).toFixed(2)}亿
                        </p>
                        <p className={`text-sm ${Number(profitChange) >= 0 ? "text-success" : "text-destructive"}`}>
                          {Number(profitChange) >= 0 ? "+" : ""}
                          {profitChange}%
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">利润率</p>
                        <p className="text-xl font-bold">{profitMargin}%</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#a69f49" name="收入" />
                        <Bar dataKey="cost" fill="#9f4983" name="成本" />
                        <Bar dataKey="profit" fill="#49839f" name="利润" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">已保存情景</CardTitle>
                  <Button size="sm" onClick={() => setSaveDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    新建情景
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>情景名称</TableHead>
                      <TableHead>收入变化</TableHead>
                      <TableHead>成本变化</TableHead>
                      <TableHead>原材料变化</TableHead>
                      <TableHead>人工变化</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>创建日期</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarios.map((scenario) => (
                      <TableRow key={scenario.id}>
                        <TableCell className="font-medium">{scenario.name}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              scenario.revenueChange >= 0
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }
                          >
                            {scenario.revenueChange >= 0 ? "+" : ""}
                            {scenario.revenueChange}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              scenario.costChange <= 0
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }
                          >
                            {scenario.costChange >= 0 ? "+" : ""}
                            {scenario.costChange}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              scenario.materialChange <= 0
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }
                          >
                            {scenario.materialChange >= 0 ? "+" : ""}
                            {scenario.materialChange}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              scenario.laborChange <= 0
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }
                          >
                            {scenario.laborChange >= 0 ? "+" : ""}
                            {scenario.laborChange}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{scenario.description}</TableCell>
                        <TableCell className="text-muted-foreground">{scenario.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleLoadScenario(scenario)}>
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDuplicateScenario(scenario)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteScenario(scenario.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sensitivity" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">敏感性分析</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">分析各因素变化1%对利润的影响程度</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>影响因素</TableHead>
                      <TableHead>影响方向</TableHead>
                      <TableHead>敏感系数</TableHead>
                      <TableHead>影响程度</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sensitivityData.map((item) => (
                      <TableRow key={item.factor}>
                        <TableCell className="font-medium">{item.factor}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.direction === "positive"
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }
                          >
                            {item.direction === "positive" ? "正向" : "负向"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{item.impact.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.direction === "positive" ? "bg-success" : "bg-destructive"}`}
                              style={{ width: `${Math.abs(item.impact) * 100}%` }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">情景对比雷达图</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="scenario" stroke="var(--muted-foreground)" fontSize={12} />
                      <PolarRadiusAxis stroke="var(--muted-foreground)" fontSize={10} />
                      <Radar name="收入" dataKey="收入" stroke="#a69f49" fill="#a69f49" fillOpacity={0.3} />
                      <Radar name="成本控制" dataKey="成本控制" stroke="#49839f" fill="#49839f" fillOpacity={0.3} />
                      <Radar name="利润率" dataKey="利润率" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Scenario Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>保存情景</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>情景名称</Label>
                <Input
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="输入情景名称"
                />
              </div>
              <div className="space-y-2">
                <Label>情景描述</Label>
                <Input
                  value={newScenarioDesc}
                  onChange={(e) => setNewScenarioDesc(e.target.value)}
                  placeholder="简要描述该情景"
                />
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm font-medium mb-2">当前参数</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>收入变化: {revenueChange[0]}%</span>
                  <span>成本变化: {costChange[0]}%</span>
                  <span>原材料变化: {materialChange[0]}%</span>
                  <span>人工变化: {laborChange[0]}%</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                取消
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveScenario}>
                保存情景
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
