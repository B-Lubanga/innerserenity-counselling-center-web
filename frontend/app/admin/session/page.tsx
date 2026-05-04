"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Search, Plus, Eye, Edit, Lock, User, X, FileText } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface SessionReport {
  id: number
  client_id: number
  client_name: string
  counsellor_id: number
  counsellor_name: string
  booking_id?: number
  session_date: string
  notes: string
  goals?: string
  progress?: string
  next_steps?: string
  is_confidential: boolean
  is_readonly: boolean
  created_at: string
}

interface Client {
  id: number
  first_name: string
  last_name: string
  email: string
}

interface Booking {
  id: number
  client_id: number
  service_type_name: string
  scheduled_at: string
}

export default function SessionReportsPage() {
  const [reports, setReports] = useState<SessionReport[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<Date | undefined>()
  const [newReportDialogOpen, setNewReportDialogOpen] = useState(false)
  const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<SessionReport | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newReport, setNewReport] = useState({
    client_id: "",
    booking_id: "",
    session_date: undefined as Date | undefined,
    notes: "",
    goals: "",
    progress: "",
    next_steps: "",
    is_confidential: true
  })

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/session-reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      } else {
        setError("Failed to load session reports")
      }
    } catch (err) {
      setError("Network error loading reports")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/admin/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (err) {
      console.error("Failed to load clients:", err)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (err) {
      console.error("Failed to load bookings:", err)
    }
  }

  useEffect(() => {
    fetchReports()
    fetchClients()
    fetchBookings()
  }, [])

  const handleCreateReport = async () => {
    if (!newReport.client_id || !newReport.notes || !newReport.session_date) {
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/session-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: parseInt(newReport.client_id),
          booking_id: newReport.booking_id ? parseInt(newReport.booking_id) : null,
          session_date: newReport.session_date.toISOString(),
          notes: newReport.notes,
          goals: newReport.goals || null,
          progress: newReport.progress || null,
          next_steps: newReport.next_steps || null,
          is_confidential: newReport.is_confidential
        })
      })

      if (response.ok) {
        await fetchReports()
        setNewReportDialogOpen(false)
        setNewReport({
          client_id: "",
          booking_id: "",
          session_date: undefined,
          notes: "",
          goals: "",
          progress: "",
          next_steps: "",
          is_confidential: true
        })
      } else {
        setError("Failed to create session report")
      }
    } catch (err) {
      setError("Network error creating report")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.counsellor_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDate = !dateFilter || 
      new Date(report.session_date).toDateString() === dateFilter.toDateString()
    
    return matchesSearch && matchesDate
  })

  const getBookingOptions = (clientId: string) => {
    return bookings.filter(b => b.client_id === parseInt(clientId))
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="border-b border-fern/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-fern">Session Reports</h1>
              <p className="text-muted-foreground">Manage and view counselling session reports</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setNewReportDialogOpen(true)}
                className="bg-apricot hover:bg-apricot/90 text-ivory"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by client name or counsellor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {dateFilter && (
            <Button
              variant="ghost"
              onClick={() => setDateFilter(undefined)}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apricot mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading session reports...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error loading reports</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchReports} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-fern mb-2">No session reports found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || dateFilter ? "Try adjusting your search criteria" : "Create your first session report to get started"}
              </p>
              {!searchTerm && !dateFilter && (
                <Button
                  onClick={() => setNewReportDialogOpen(true)}
                  className="bg-apricot hover:bg-apricot/90 text-ivory"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Report
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{report.client_name}</CardTitle>
                      <CardDescription>
                        {format(new Date(report.session_date), "PPP")}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.is_confidential && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Confidential
                        </Badge>
                      )}
                      {report.is_readonly && (
                        <Badge variant="outline" className="text-xs">
                          Read-only
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      {report.counsellor_name}
                    </div>
                    
                    {report.notes && (
                      <div>
                        <p className="text-sm font-medium text-fern mb-1">Notes</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {report.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report)
                          setViewReportDialogOpen(true)
                        }}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {!report.is_readonly && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Report Dialog */}
      <Dialog open={newReportDialogOpen} onOpenChange={setNewReportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Session Report</DialogTitle>
            <DialogDescription>
              Add a new counselling session report. All reports are marked as confidential by default.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client *</Label>
                <Select
                  value={newReport.client_id}
                  onValueChange={(value) => setNewReport(prev => ({ ...prev, client_id: value, booking_id: "" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.first_name} {client.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="booking">Link to Booking (Optional)</Label>
                <Select
                  value={newReport.booking_id}
                  onValueChange={(value) => setNewReport(prev => ({ ...prev, booking_id: value }))}
                  disabled={!newReport.client_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select booking" />
                  </SelectTrigger>
                  <SelectContent>
                    {getBookingOptions(newReport.client_id).map((booking) => (
                      <SelectItem key={booking.id} value={booking.id.toString()}>
                        {format(new Date(booking.scheduled_at), "PPP")} - {booking.service_type_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="session_date">Session Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newReport.session_date ? format(newReport.session_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newReport.session_date}
                    onSelect={(date) => date && setNewReport(prev => ({ ...prev, session_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="notes">Session Notes *</Label>
              <Textarea
                id="notes"
                placeholder="Detailed notes from the session (marked as confidential)"
                value={newReport.notes}
                onChange={(e) => setNewReport(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="goals">Goals</Label>
              <Textarea
                id="goals"
                placeholder="Client goals discussed in the session"
                value={newReport.goals}
                onChange={(e) => setNewReport(prev => ({ ...prev, goals: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="progress">Progress</Label>
              <Textarea
                id="progress"
                placeholder="Client progress and developments"
                value={newReport.progress}
                onChange={(e) => setNewReport(prev => ({ ...prev, progress: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="next_steps">Next Steps</Label>
              <Textarea
                id="next_steps"
                placeholder="Action items and next session plans"
                value={newReport.next_steps}
                onChange={(e) => setNewReport(prev => ({ ...prev, next_steps: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="confidential"
                checked={newReport.is_confidential}
                onChange={(e) => setNewReport(prev => ({ ...prev, is_confidential: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="confidential" className="text-sm">
                Mark as confidential (recommended)
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReport}
              disabled={isSaving || !newReport.client_id || !newReport.notes}
              className="bg-apricot hover:bg-apricot/90 text-ivory"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ivory mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Report"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={viewReportDialogOpen} onOpenChange={setViewReportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Report</DialogTitle>
            <DialogDescription>
              {selectedReport && `${selectedReport.client_name} - ${format(new Date(selectedReport.session_date), "PPP")}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Client</Label>
                  <p className="font-medium">{selectedReport.client_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Counsellor</Label>
                  <p className="font-medium">{selectedReport.counsellor_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <p className="font-medium">{format(new Date(selectedReport.session_date), "PPP")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2">
                    {selectedReport.is_confidential && (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Confidential
                      </Badge>
                    )}
                    {selectedReport.is_readonly && (
                      <Badge variant="outline" className="text-xs">
                        Read-only
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Session Notes</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedReport.notes || "No notes available"}</p>
                </div>
              </div>
              
              {selectedReport.goals && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Goals</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedReport.goals}</p>
                  </div>
                </div>
              )}
              
              {selectedReport.progress && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Progress</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedReport.progress}</p>
                  </div>
                </div>
              )}
              
              {selectedReport.next_steps && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Next Steps</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedReport.next_steps}</p>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setViewReportDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
