"use client";

import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  signInBodySchema,
  SignInBodySchema,
} from "@/lib/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useSignInMutation } from "@/hooks/mutations/auth.mutation";
import { mapFieldErrorToFormError } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function SignIn() {
  const router = useRouter();

  const form = useForm<SignInBodySchema>({
    resolver: zodResolver(signInBodySchema),
    defaultValues: {
      email: "nguyenthinhphat3009@gmail.com",
      password: "phat12",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const mutation = useSignInMutation();

  const onSubmit = (data: SignInBodySchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Signed in successfully!");
        router.push("/");
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
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

