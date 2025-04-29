import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured. Please check your .env file.");
      }

      // Encode the email for use in URL
      const encodedEmail = encodeURIComponent(email);
      const url = `${apiUrl}/api/auth/forgotPassword?email=${encodedEmail}`;
      
      console.log("Sending request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        let errorMessage = "Failed to send reset email";
        try {
          const data = await response.json();
          console.log("Error response data:", data);
          errorMessage = data.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          // If we can't parse the JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Try to parse the response as JSON, but don't fail if it's empty
      try {
        const data = await response.json();
        console.log("Success response data:", data);
        if (data.message) {
          toast.success(data.message);
        }
      } catch (parseError) {
        console.log("No JSON response received or parsing failed:", parseError);
        // If there's no JSON response, that's okay - we'll use our default success message
      }

      setIsEmailSent(true);
      toast.success("Password reset instructions sent to your email");
    } catch (err) {
      console.error("Password reset request failed", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
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
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <p className="text-sm text-muted-foreground">
            {isEmailSent 
              ? "Check your email for password reset instructions"
              : "Enter your email address and we'll send you instructions to reset your password"}
          </p>
        </CardHeader>
        <CardContent>
          {!isEmailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset instructions"
                )}
              </Button>
              {error && (
                <div className="text-red-500 text-sm text-center mt-2">
                  {error}
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                If you don't receive an email within a few minutes, please check your spam folder.
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/sign-in")}
              >
                Return to Sign In
              </Button>
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            Remember your password?{" "}
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

export default ForgotPassword; 