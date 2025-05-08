import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Login form validation schema
const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { loginMutation } = useAuth();
  const [, setLocation] = useLocation();

  // Initialize the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-br from-revalpro-blue to-revalpro-teal hover:from-revalpro-blue/90 hover:to-revalpro-teal/90"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Demo Account Info */}
        <div className="text-sm text-muted-foreground text-center">
          <p>Demo Account</p>
          <p>Username: <span className="font-mono">demouser</span></p>
          <p>Password: <span className="font-mono">password123</span></p>
        </div>
      </form>
    </Form>
  );
}