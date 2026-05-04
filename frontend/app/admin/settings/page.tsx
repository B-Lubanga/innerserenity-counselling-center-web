"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Building, Phone, Mail, MapPin, Clock, Lock, Bell } from "lucide-react"

interface CentreSettings {
  name: string
  phone: string
  email: string
  address: string
  whatsapp: string
}

interface OfficeHours {
  [key: string]: {
    isOpen: boolean
    openTime: string
    closeTime: string
  }
}

interface NotificationSettings {
  emailNotifications: boolean
  whatsappNotifications: boolean
}

const defaultCentreSettings: CentreSettings = {
  name: "Inner Serenity Counselling Centre",
  phone: "+254 700 000 000",
  email: "info@innerserenity.co.ke",
  address: "123 Wellness Street, Nairobi, Kenya",
  whatsapp: "+254 700 000 000"
}

const defaultOfficeHours: OfficeHours = {
  monday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  tuesday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  wednesday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  thursday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  friday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  saturday: { isOpen: false, openTime: "10:00", closeTime: "16:00" },
  sunday: { isOpen: false, openTime: "10:00", closeTime: "16:00" }
}

const defaultNotifications: NotificationSettings = {
  emailNotifications: true,
  whatsappNotifications: true
}

export default function SettingsPage() {
  const [centreSettings, setCentreSettings] = useState<CentreSettings>(defaultCentreSettings)
  const [officeHours, setOfficeHours] = useState<OfficeHours>(defaultOfficeHours)
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveCentreSettings = () => {
    setIsLoading(true)
    // TODO: connect to backend settings endpoint
    localStorage.setItem("centreSettings", JSON.stringify(centreSettings))
    setTimeout(() => {
      setIsLoading(false)
      alert("Settings saved successfully")
    }, 1000)
  }

  const handleSaveOfficeHours = () => {
    setIsLoading(true)
    // TODO: connect to backend settings endpoint
    localStorage.setItem("officeHours", JSON.stringify(officeHours))
    setTimeout(() => {
      setIsLoading(false)
      alert("Office hours saved successfully")
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setIsLoading(true)
    // TODO: connect to backend settings endpoint
    localStorage.setItem("notifications", JSON.stringify(notifications))
    setTimeout(() => {
      setIsLoading(false)
      alert("Notification settings saved successfully")
    }, 1000)
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match")
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters")
      return
    }
    
    setIsLoading(true)
    // TODO: connect to backend password change endpoint
    setTimeout(() => {
      setIsLoading(false)
      alert("Password changed successfully")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    }, 1000)
  }

  const updateOfficeHour = (day: string, field: keyof OfficeHours[string], value: any) => {
    setOfficeHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-fern mb-2">Settings</h1>
          <p className="text-fern/70">Manage your centre information and preferences</p>
        </div>

        <div className="space-y-8">
          {/* Centre Information */}
          <Card className="bg-white border-fern/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-apricot" />
                <CardTitle className="text-fern">Centre Information</CardTitle>
              </div>
              <CardDescription className="text-fern/70">
                Update your counselling centre's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-fern">Centre Name</Label>
                  <Input
                    id="name"
                    value={centreSettings.name}
                    onChange={(e) => setCentreSettings(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-fern">Phone Number</Label>
                  <Input
                    id="phone"
                    value={centreSettings.phone}
                    onChange={(e) => setCentreSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-fern">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={centreSettings.email}
                    onChange={(e) => setCentreSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp" className="text-fern">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={centreSettings.whatsapp}
                    onChange={(e) => setCentreSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address" className="text-fern">Physical Address</Label>
                <Input
                  id="address"
                  value={centreSettings.address}
                  onChange={(e) => setCentreSettings(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleSaveCentreSettings}
                disabled={isLoading}
                className="bg-fern hover:bg-fern-light text-ivory rounded-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Centre Info"}
              </Button>
            </CardContent>
          </Card>

          {/* Office Hours */}
          <Card className="bg-white border-fern/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-apricot" />
                <CardTitle className="text-fern">Office Hours</CardTitle>
              </div>
              <CardDescription className="text-fern/70">
                Configure your weekly operating hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(officeHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between p-4 border border-fern/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={hours.isOpen}
                      onCheckedChange={(checked) => updateOfficeHour(day, "isOpen", checked)}
                    />
                    <span className="font-medium text-fern capitalize">{day}</span>
                  </div>
                  {hours.isOpen && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours.openTime}
                        onChange={(e) => updateOfficeHour(day, "openTime", e.target.value)}
                        className="w-24"
                      />
                      <span className="text-fern/70">to</span>
                      <Input
                        type="time"
                        value={hours.closeTime}
                        onChange={(e) => updateOfficeHour(day, "closeTime", e.target.value)}
                        className="w-24"
                      />
                    </div>
                  )}
                  {!hours.isOpen && (
                    <span className="text-fern/50 italic">Closed</span>
                  )}
                </div>
              ))}
              <Button 
                onClick={handleSaveOfficeHours}
                disabled={isLoading}
                className="bg-fern hover:bg-fern-light text-ivory rounded-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Office Hours"}
              </Button>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="bg-white border-fern/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-apricot" />
                <CardTitle className="text-fern">Account Settings</CardTitle>
              </div>
              <CardDescription className="text-fern/70">
                Change your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-fern">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-fern">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-fern">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleChangePassword}
                disabled={isLoading}
                className="bg-fern hover:bg-fern-light text-ivory rounded-full"
              >
                <Lock className="h-4 w-4 mr-2" />
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white border-fern/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-apricot" />
                <CardTitle className="text-fern">Notifications</CardTitle>
              </div>
              <CardDescription className="text-fern/70">
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-fern/10 rounded-lg">
                <div>
                  <p className="font-medium text-fern">Email Notifications</p>
                  <p className="text-sm text-fern/70">Receive email alerts for new bookings</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-fern/10 rounded-lg">
                <div>
                  <p className="font-medium text-fern">WhatsApp Notifications</p>
                  <p className="text-sm text-fern/70">Receive WhatsApp alerts for new bookings</p>
                </div>
                <Switch
                  checked={notifications.whatsappNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, whatsappNotifications: checked }))}
                />
              </div>
              <Button 
                onClick={handleSaveNotifications}
                disabled={isLoading}
                className="bg-fern hover:bg-fern-light text-ivory rounded-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Notification Settings"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
