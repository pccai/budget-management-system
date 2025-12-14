"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle2 } from "lucide-react"

const calendarData = [
  { month: "1月", status: "closed", deadline: "2024-12-20" },
  { month: "2月", status: "closed", deadline: "2025-01-20" },
  { month: "3月", status: "closed", deadline: "2025-02-20" },
  { month: "4月", status: "closed", deadline: "2025-03-20" },
  { month: "5月", status: "closed", deadline: "2025-04-20" },
  { month: "6月", status: "closed", deadline: "2025-05-20" },
  { month: "7月", status: "closed", deadline: "2025-06-20" },
  { month: "8月", status: "closed", deadline: "2025-07-20" },
  { month: "9月", status: "closed", deadline: "2025-08-20" },
  { month: "10月", status: "closed", deadline: "2025-09-20" },
  { month: "11月", status: "current", deadline: "2025-10-20" },
  { month: "12月", status: "open", deadline: "2025-11-20" },
]

export default function CalendarPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">预算日历</h1>
            <p className="text-muted-foreground">定义预算年度、期间及编制周期</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Calendar className="w-4 h-4 mr-2" />
            配置日历
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前年度</p>
                <p className="text-2xl font-bold">2025</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前期间</p>
                <p className="text-2xl font-bold">11月</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已关闭期间</p>
                <p className="text-2xl font-bold">10</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">2025年度预算日历</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {calendarData.map((item) => (
                <Card
                  key={item.month}
                  className={`${
                    item.status === "current"
                      ? "border-primary bg-primary/5"
                      : item.status === "open"
                        ? "border-warning bg-warning/5"
                        : ""
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <p className="text-lg font-bold mb-2">{item.month}</p>
                    <Badge
                      className={
                        item.status === "closed"
                          ? "bg-muted text-muted-foreground"
                          : item.status === "current"
                            ? "bg-primary/20 text-primary"
                            : "bg-warning/20 text-warning"
                      }
                    >
                      {item.status === "closed" ? "已关闭" : item.status === "current" ? "当前" : "开放"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">截止: {item.deadline}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
