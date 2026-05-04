"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Mail, Phone, FileText, UserPlus, Plus, Edit2, Download, Send } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  sessionType: string
  assignedCounsellor: string
  totalSessions: number
  outstandingBalance: number
  status: "active" | "inactive" | "completed"
  joinDate: string
}

const mockClients: Client[] = [
  {
    id: "cl-001",
    name: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    sessionType: "Individual",
    assignedCounsellor: "Dr. Sarah Johnson",
    totalSessions: 12,
    outstandingBalance: 0,
    status: "active",
    joinDate: "2023-11-15",
  },
  {
    id: "cl-002",
    name: "Emma & James Wilson",
    email: "emma.j.wilson@example.com",
    phone: "(555) 234-5678",
    sessionType: "Couples",
    assignedCounsellor: "Dr. Michael Brown",
    totalSessions: 8,
    outstandingBalance: 300,
    status: "active",
    joinDate: "2023-12-01",
  },
  {
    id: "cl-003",
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    phone: "(555) 345-6789",
    sessionType: "Individual",
    assignedCounsellor: "Dr. Rachel Green",
    totalSessions: 5,
    outstandingBalance: 150,
    status: "active",
    joinDate: "2024-01-05",
  },
]

const counsellors = ["Dr. Sarah Johnson", "Dr. Michael Brown", "Dr. Rachel Green", "Dr. James Wilson"]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAssignCounsellor = (clientId: string, counsellorName: string) => {
    setClients(
      clients.map((client) =>
        client.id === clientId ? { ...client, assignedCounsellor: counsellorName } : client
      )
    )
  }

  const handleSendInvoice = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (client) {
      // Sending invoice to client
      alert(`Invoice sent to ${client.email}`)
    }
  }

  const statusColors = {
    active: "bg-green-500/10 text-green-700 border-green-300",
    inactive: "bg-gray-500/10 text-gray-700 border-gray-300",
    completed: "bg-blue-500/10 text-blue-700 border-blue-300",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="border-b border-primary/10 bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Client Database</h1>
            <p className="text-sm text-muted-foreground">Manage clients and assignments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Create a new client profile</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Client Name" type="text" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Phone" type="tel" />
                <select className="w-full border border-primary/20 rounded-lg p-2 bg-background">
                  <option>Select Session Type</option>
                  <option>Individual</option>
                  <option>Couples</option>
                  <option>Family</option>
                  <option>Group</option>
                </select>
                <select className="w-full border border-primary/20 rounded-lg p-2 bg-background">
                  <option>Assign Counsellor</option>
                  {counsellors.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <Button className="w-full bg-primary hover:bg-primary/90 rounded-lg">Create Client</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{clients.length}</div>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{clients.filter((c) => c.status === "active").length}</div>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ${clients.reduce((sum, c) => sum + c.outstandingBalance, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {clients.reduce((sum, c) => sum + c.totalSessions, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full border-primary/20"
          />
        </div>

        {/* Clients Table */}
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <Card className="border-primary/10">
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No clients found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <Card className="border-primary/10">
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="border-b border-primary/10 bg-secondary/50">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Name</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Counsellor</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Type</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Sessions</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Balance</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10">
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{client.name}</p>
                              <p className="text-xs text-muted-foreground">{client.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full"
                                  onClick={() => setSelectedClient(client)}
                                >
                                  {client.assignedCounsellor}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Assign Counsellor</DialogTitle>
                                  <DialogDescription>Select a counsellor for {client.name}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                  {counsellors.map((counsellor) => (
                                    <Button
                                      key={counsellor}
                                      variant={client.assignedCounsellor === counsellor ? "default" : "outline"}
                                      className="w-full rounded-lg"
                                      onClick={() => {
                                        handleAssignCounsellor(client.id, counsellor)
                                        setIsDialogOpen(false)
                                      }}
                                    >
                                      {counsellor}
                                    </Button>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{client.sessionType}</td>
                          <td className="px-6 py-4 font-medium text-foreground">{client.totalSessions}</td>
                          <td className="px-6 py-4">
                            {client.outstandingBalance > 0 ? (
                              <span className="text-red-600 font-medium">${client.outstandingBalance}</span>
                            ) : (
                              <span className="text-green-600">Paid</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={statusColors[client.status]}>
                              {client.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                title="Send Invoice"
                                onClick={() => handleSendInvoice(client.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                title="View Records"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
