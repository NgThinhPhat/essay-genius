"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSendEmailVerificationMutation, useSignUpMutation } from "@/hooks/mutations/auth.mutation"
import { SendEmailVerificationBodySchema, signUpBodySchema, SignUpBodySchema } from "@/lib/schemas/auth.schema"
import { mapFieldErrorToFormError } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

export default function SignUp() {
  const router = useRouter();

  const form = useForm<SignUpBodySchema>({
    resolver: zodResolver(signUpBodySchema),
    defaultValues: {
      firstName: "Nguyen",
      lastName: "Thinh Phat",
      email: "nguyenthinhphat3009+1@gmail.com",
      password: "phat12",
      passwordConfirmation: "phat12"
    },
  });
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const mutation = useSignUpMutation();
  const sendEmailVerificationMutation = useSendEmailVerificationMutation();


  const onSubmit = (data: SignUpBodySchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Signed up successfully!");

        const emailVerificationData: SendEmailVerificationBodySchema = {
          email: data.email,
          type: "VERIFY_EMAIL_WITH_BOTH",
        };
        console.log("emailVerificationData" + JSON.stringify(emailVerificationData));

        sendEmailVerificationMutation.mutate(emailVerificationData, {
          onSuccess: () => {
            toast.success("Verification email sent!");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        });

        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.errorCode === "common/validation-error") {
          mapFieldErrorToFormError(setError, error.errors);
        }
      },
    });
  };


  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Phat"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nguyen"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

