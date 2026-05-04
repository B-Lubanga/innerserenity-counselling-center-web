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
import { FileText, Download, Send, Plus, Eye, Trash2 } from "lucide-react"

interface Invoice {
  id: string
  clientName: string
  clientEmail: string
  amount: number
  issueDate: string
  dueDate: string
  status: "sent" | "pending" | "paid" | "overdue"
  sessions: number
}

// Start with empty invoices - no dummy data
const mockInvoices: Invoice[] = []

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendInvoice = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId)
    if (!invoice) {
      alert("Invoice not found")
      return
    }
    
    if (invoice.status === "paid") {
      alert("This invoice is already paid")
      return
    }
    
    if (!invoice.clientEmail || invoice.clientEmail === "") {
      alert("Client email is required to send invoice")
      return
    }
    
    if (invoice.amount <= 0) {
      alert("Invoice amount must be greater than 0")
      return
    }
    
    // TODO: connect to backend email service
    // Sending invoice to client
    setInvoices(
      invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "sent" as const } : inv
      )
    )
    alert(`Invoice sent to ${invoice.clientEmail}`)
  }

  const handleDelete = (invoiceId: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== invoiceId))
  }

  const statusColors = {
    sent: "bg-blue-500/10 text-blue-700 border-blue-300",
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-300",
    paid: "bg-green-500/10 text-green-700 border-green-300",
    overdue: "bg-red-500/10 text-red-700 border-red-300",
  }

  const totalRevenue = invoices.reduce((sum: number, inv: Invoice) => sum + inv.amount, 0)
  const paidAmount = invoices.filter((inv: Invoice) => inv.status === "paid").reduce((sum: number, inv: Invoice) => sum + inv.amount, 0)
  const pendingAmount = invoices.filter((inv: Invoice) => inv.status === "pending" || inv.status === "overdue").reduce((sum: number, inv: Invoice) => sum + inv.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="border-b border-primary/10 bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Invoicing</h1>
            <p className="text-sm text-muted-foreground">Manage and send client invoices</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>Generate an invoice for a client</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Client Name" type="text" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Amount" type="number" />
                <Input placeholder="Number of Sessions" type="number" />
                <Input placeholder="Due Date" type="date" />
                <Button className="w-full bg-primary hover:bg-primary/90 rounded-lg">Create Invoice</Button>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">KES {totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">KES {paidAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">KES {pendingAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{invoices.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search by client name or invoice ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full border-primary/20"
          />
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.length === 0 ? (
            <Card className="border-primary/10">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No invoices yet</h3>
                <p className="text-muted-foreground mb-6">Invoices will appear here once bookings are confirmed</p>
                <Button className="bg-primary hover:bg-primary/90 rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <Card className="border-primary/10">
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="border-b border-primary/10 bg-secondary/50">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Invoice</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Client</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Amount</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Due Date</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                        <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10">
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{invoice.id}</td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{invoice.clientName}</p>
                              <p className="text-xs text-muted-foreground">{invoice.clientEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground">
                          {invoice.amount > 0 ? `KES ${invoice.amount.toLocaleString()}` : '—'}
                        </td>
                          <td className="px-6 py-4 text-muted-foreground">{invoice.dueDate}</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={statusColors[invoice.status]}>
                              {invoice.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                title="View Invoice"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                title="Send"
                                onClick={() => handleSendInvoice(invoice.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full text-destructive"
                                title="Delete"
                                onClick={() => handleDelete(invoice.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
