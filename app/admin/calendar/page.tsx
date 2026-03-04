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
import { Calendar, Clock, User, Edit2, Trash2, Plus, X } from "lucide-react"

interface Appointment {
  id: string
  client: string
  counsellor: string
  date: string
  time: string
  duration: number
  type: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
}

const mockAppointments: Appointment[] = [
  {
    id: "apt-001",
    client: "John Smith",
    counsellor: "Dr. Sarah Johnson",
    date: "2024-01-15",
    time: "14:00",
    duration: 50,
    type: "Individual",
    status: "confirmed",
  },
  {
    id: "apt-002",
    client: "Emma & James Wilson",
    counsellor: "Dr. Michael Brown",
    date: "2024-01-15",
    time: "15:30",
    duration: 50,
    type: "Couples",
    status: "confirmed",
  },
  {
    id: "apt-003",
    client: "Lisa Chen",
    counsellor: "Dr. Rachel Green",
    date: "2024-01-15",
    time: "16:45",
    duration: 50,
    type: "Individual",
    status: "pending",
  },
  {
    id: "apt-004",
    client: "Mark Johnson",
    counsellor: "Dr. Sarah Johnson",
    date: "2024-01-16",
    time: "10:00",
    duration: 50,
    type: "Individual",
    status: "confirmed",
  },
]

const counsellors = ["Dr. Sarah Johnson", "Dr. Michael Brown", "Dr. Rachel Green", "Dr. James Wilson"]

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.counsellor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id))
  }

  const statusColors = {
    confirmed: "bg-green-500/10 text-green-700 border-green-300",
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-300",
    completed: "bg-blue-500/10 text-blue-700 border-blue-300",
    cancelled: "bg-red-500/10 text-red-700 border-red-300",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="border-b border-primary/10 bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendar Management</h1>
            <p className="text-sm text-muted-foreground">Schedule and manage counselling sessions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>Create a new counselling session</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Client Name" type="text" />
                <select className="w-full border border-primary/20 rounded-lg p-2 bg-background">
                  <option>Select Counsellor</option>
                  {counsellors.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <Input placeholder="Date" type="date" />
                <Input placeholder="Time" type="time" />
                <select className="w-full border border-primary/20 rounded-lg p-2 bg-background">
                  <option>Individual</option>
                  <option>Couples</option>
                  <option>Family</option>
                  <option>Group</option>
                </select>
                <Button className="w-full bg-primary hover:bg-primary/90 rounded-lg">Create Appointment</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search by client or counsellor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full border-primary/20"
          />
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="border-primary/10">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No appointments found</p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-primary/10 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{appointment.client}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{appointment.counsellor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                            {appointment.time} ({appointment.duration}min)
                          </span>
                        </div>
                        <div>
                          <Badge variant="outline" className={statusColors[appointment.status]}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setEditingId(appointment.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full text-destructive"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
