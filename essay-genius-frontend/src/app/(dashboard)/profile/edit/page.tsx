"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function EditProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "IELTS teacher and examiner with 10+ years of experience.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    publicProfile: true,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, redirect to profile page or show success message
    }, 1500)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-8 space-x-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center sm:items-start">
                  <Button variant="outline" size="sm" className="mb-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">This will be displayed on your public profile.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleChange("currentPassword", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={
                    !formData.currentPassword ||
                    !formData.newPassword ||
                    formData.newPassword !== formData.confirmPassword ||
                    isLoading
                  }
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy and notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications about your essays and comments
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Allow others to view your profile and public essays</p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={formData.publicProfile}
                    onCheckedChange={(checked) => handleChange("publicProfile", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
