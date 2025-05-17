
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

type FormValues = {
  email: string;
  password: string;
};

const Index = () => {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto mt-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">UserVerse</h1>
            <p className="text-gray-600">Access the user management platform</p>
          </div>

          <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Log in to your account</CardTitle>
              <CardDescription>
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Entered value does not match email format",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      placeholder="Enter password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <span className="loader"></span> : "Log in"}
                </Button>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-primary font-medium hover:underline"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-xs text-muted-foreground">
                <p className="mb-1">Demo accounts:</p>
                <p><strong>Admin:</strong> admin@admin.com / admin123</p>
                <p><strong>User:</strong> Sincere@april.biz / Bret</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
