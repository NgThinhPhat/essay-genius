"use client"

import { useRef, useState } from "react"
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
import { useCurrentUser } from "@/hooks/use-current-user"
import { useUploadAvatarMutation } from "@/hooks/mutations/auth.mutation"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormProvider, useForm } from "react-hook-form"
import { UserInfo } from "@/constracts/essay.constract"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useUpdateProfileMutation } from "@/hooks/mutations/essay.mutation"

export default function EditProfile() {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { data: user, isLoading } = useCurrentUser();
  const form = useForm<UserInfo>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });
  const { control, handleSubmit } = form;

  const avatarForm = useForm<{ avatar: File | null }>({
    defaultValues: { avatar: null },
  });
  const { handleSubmit: handleSubmitAvatar, setValue: setAvatarValue, watch: watchAvatar } = avatarForm;
  const selectedFile = watchAvatar("avatar");
  const uploadAvatarMutation = useUploadAvatarMutation();
  const queryClient = useQueryClient();

  const onUploadAvatar = (data: { avatar: File | null }) => {
    if (!data.avatar) return;

    uploadAvatarMutation.mutate(data.avatar, {
      onSuccess: () => {
        toast.success("Upload success!");
        queryClient.invalidateQueries({ queryKey: ['current_user'] });
      },
      onError: () => {
        toast.error("Upload failed");
      },
    });
  };

  const openFileDialog = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const updateProfileMutation = useUpdateProfileMutation();

  const handleSaveProfile = (values: {
    firstName: string;
    lastName: string;
    bio?: string;
  }) => {
    if (!user?.id) return;

    updateProfileMutation.mutate(
      {
        userId: user.id,
        body: values,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          queryClient.invalidateQueries({ queryKey: ["me"] });
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      }
    );
  };

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
              <FormProvider {...avatarForm}>
                <form onSubmit={handleSubmitAvatar(onUploadAvatar)}>
                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={user?.avatar || "/placeholder.svg"}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        className="rounded-full object-cover"
                      />
                      <AvatarFallback className="text-lg">
                        {user?.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-center sm:items-start space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={inputFileRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            setAvatarValue("avatar", file);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => inputFileRef.current?.click()}
                        size="sm"
                        className="mb-2 flex items-center"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {selectedFile ? selectedFile.name : "Select Avatar"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        type="submit"
                        disabled={uploadAvatarMutation.isLoading || !selectedFile}
                      >
                        {uploadAvatarMutation.isLoading ? "Uploading..." : "Change Avatar"}
                      </Button>

                      <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>
                </form>
              </FormProvider>

              <FormProvider {...form}>
                <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-4">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" {...field} />
                      </div>
                    )}
                  />

                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" {...field} />
                      </div>
                    )}
                  />

                  <FormField
                    control={control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            id="bio"
                            className="min-h-[100px]"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed on your public profile.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" >
                    Save
                  </Button>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Privacy */}
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
                  // value={formData.currentPassword}
                  // onChange={(e) => handleChange("currentPassword", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                  // value={formData.newPassword}
                  // onChange={(e) => handleChange("newPassword", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                  // value={formData.confirmPassword}
                  // onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                // disabled={
                //   !formData.currentPassword ||
                //   !formData.newPassword ||
                //   formData.newPassword !== formData.confirmPassword ||
                //   isLoading
                // }
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
                {/* <div className="flex items-center justify-between"> */}
                {/*   <div className="space-y-0.5"> */}
                {/*     <Label htmlFor="email-notifications">Email Notifications</Label> */}
                {/*     <p className="text-sm text-muted-foreground"> */}
                {/*       Receive email notifications about your essays and comments */}
                {/*     </p> */}
                {/*   </div> */}
                {/*   <Switch */}
                {/*     id="email-notifications" */}
                {/*     checked={formData.emailNotifications} */}
                {/*     onCheckedChange={(checked) => handleChange("emailNotifications", checked)} */}
                {/*   /> */}
                {/* </div> */}
                {/* <div className="flex items-center justify-between"> */}
                {/*   <div className="space-y-0.5"> */}
                {/*     <Label htmlFor="public-profile">Public Profile</Label> */}
                {/*     <p className="text-sm text-muted-foreground">Allow others to view your profile and public essays</p> */}
                {/*   </div> */}
                {/*   <Switch */}
                {/*     id="public-profile" */}
                {/*     checked={formData.publicProfile} */}
                {/*     onCheckedChange={(checked) => handleChange("publicProfile", checked)} */}
                {/*   /> */}
                {/* </div> */}
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
