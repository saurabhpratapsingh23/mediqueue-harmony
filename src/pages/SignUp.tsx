import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Make sure we have a valid API URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
          role: role.toUpperCase(),
        }),
      });

      const contentType = response.headers.get("content-type");
      let errorMessage = "Registration failed";

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const textError = await response.text();
        errorMessage = textError || errorMessage;
      }

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      // Call the register function from auth context to handle the successful registration
      await register(name, email, password, role);
      // Auth context handles redirection
    } catch (error) {
      console.error("Registration failed", error);
      setError(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Link to="/landing" className="flex justify-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              M
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your information to create your MediQ account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>I am a</Label>
              <ToggleGroup type="single" value={role} onValueChange={(value) => setRole(value as "patient" | "doctor" | "admin")}>
                <ToggleGroupItem value="patient">Patient</ToggleGroupItem>
                <ToggleGroupItem value="doctor">Doctor</ToggleGroupItem>
                <ToggleGroupItem value="admin">Admin</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            {error && (
              <div className="text-red-500 text-sm text-center mt-2">
                {error}
              </div>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button variant="link" className="px-1 text-primary" onClick={() => navigate("/sign-in")}>
              Sign in
            </Button>
          </div>
          <div className="mt-8 text-center text-sm">
            <Link to="/landing" className="text-muted-foreground hover:text-primary">
              Return to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
