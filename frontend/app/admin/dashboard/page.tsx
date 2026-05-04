"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  Settings,
  LogOut,
  MoreVertical,
  Download,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock data for demonstration
const mockMetrics = {
  totalClients: 247,
  activeClients: 189,
  totalSessions: 1250,
  completedSessions: 1205,
  totalRevenue: 145000,
  thisMonthRevenue: 12500,
  thisMonthSessions: 95,
}

const mockSessionData = [
  { month: "Jan", sessions: 85, revenue: 10200 },
  { month: "Feb", sessions: 92, revenue: 11040 },
  { month: "Mar", sessions: 88, revenue: 10560 },
  { month: "Apr", sessions: 95, revenue: 11400 },
  { month: "May", sessions: 102, revenue: 12240 },
  { month: "Jun", sessions: 95, revenue: 12500 },
]

const mockSessionTypes = [
  { name: "Individual", value: 450, fill: "#1B5E20" },
  { name: "Couples", value: 280, fill: "#BF5700" },
  { name: "Family", value: 320, fill: "#2E7D32" },
  { name: "Group", value: 155, fill: "#558B2F" },
]

const mockUpcomingSessions = [
  {
    id: 1,
    client: "John Smith",
    counsellor: "Dr. Sarah Johnson",
    time: "2:00 PM - 3:00 PM",
    type: "Individual",
    status: "confirmed",
  },
  {
    id: 2,
    client: "Emma & James Wilson",
    counsellor: "Dr. Michael Brown",
    time: "3:30 PM - 4:30 PM",
    type: "Couples",
    status: "confirmed",
  },
  {
    id: 3,
    client: "Lisa Chen",
    counsellor: "Dr. Rachel Green",
    time: "4:45 PM - 5:45 PM",
    type: "Individual",
    status: "pending",
  },
]

const mockCounsellors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Anxiety & Depression",
    sessionsThisMonth: 24,
    rating: 4.8,
    revenue: 2880,
  },
  {
    id: 2,
    name: "Dr. Michael Brown",
    specialization: "Couples Therapy",
    sessionsThisMonth: 18,
    rating: 4.7,
    revenue: 3600,
  },
  {
    id: 3,
    name: "Dr. Rachel Green",
    specialization: "Family Therapy",
    sessionsThisMonth: 22,
    rating: 4.9,
    revenue: 2860,
  },
]

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="border-b border-primary/10 bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Inner Serenity Counselling Centre</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full bg-background/50"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <Link href="/admin/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-primary/20 bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockMetrics.totalClients}</div>
              <p className="text-xs text-green-600 mt-1">+12 this month</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockMetrics.thisMonthSessions}</div>
              <p className="text-xs text-green-600 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">${mockMetrics.thisMonthRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+8% vs last month</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">96.4%</div>
              <p className="text-xs text-green-600 mt-1">Excellent performance</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">7</div>
              <p className="text-xs text-blue-600 mt-1">Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-secondary border border-primary/10 rounded-full p-1">
            <TabsTrigger value="overview" className="rounded-full">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sessions" className="rounded-full">
              Sessions
            </TabsTrigger>
            <TabsTrigger value="clients" className="rounded-full">
              Clients
            </TabsTrigger>
            <TabsTrigger value="counsellors" className="rounded-full">
              Counsellors
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-full">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-primary/10">
                <CardHeader>
                  <CardTitle>Session & Revenue Trend</CardTitle>
                  <CardDescription>Last 6 months performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockSessionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="sessions"
                        stroke="#1B5E20"
                        name="Sessions"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#BF5700"
                        name="Revenue ($)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle>Session Breakdown</CardTitle>
                  <CardDescription>By session type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={mockSessionTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockSessionTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Sessions */}
            <Card className="border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Today's Sessions</CardTitle>
                  <CardDescription>Upcoming appointments</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUpcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{session.client}</h4>
                        <p className="text-sm text-muted-foreground">with {session.counsellor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{session.time}</p>
                        <Badge
                          variant="outline"
                          className={`mt-1 ${
                            session.status === "confirmed"
                              ? "bg-green-500/10 text-green-700 border-green-300"
                              : "bg-yellow-500/10 text-yellow-700 border-yellow-300"
                          }`}
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>View and manage all counselling sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Session management interface coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Client Database</CardTitle>
                <CardDescription>Manage client profiles and information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Client management interface coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="counsellors" className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Counsellor Performance</CardTitle>
                <CardDescription>Track counsellor metrics and productivity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCounsellors.map((counsellor) => (
                    <div key={counsellor.id} className="p-4 bg-secondary/50 rounded-lg border border-primary/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{counsellor.name}</h4>
                          <p className="text-sm text-muted-foreground">{counsellor.specialization}</p>
                        </div>
                        <Badge className="bg-primary/20 text-primary">⭐ {counsellor.rating}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Sessions</p>
                          <p className="font-bold text-foreground">{counsellor.sessionsThisMonth}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-bold text-foreground">${counsellor.revenue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300 mt-1">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Generate and view detailed reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-primary hover:bg-primary/90 rounded-lg">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Monthly Report
                  </Button>
                  <Button variant="outline" className="w-full rounded-lg">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Quarterly Report
                  </Button>
                  <Button variant="outline" className="w-full rounded-lg">
                    <Download className="h-4 w-4 mr-2" />
                    Export Client Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
