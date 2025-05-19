
import { useState, useEffect } from 'react';
import { useAuth, AppRole } from '@/contexts/AuthContext'; // Added AppRole
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Added RadioGroup

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('student'); // Added state for role selection
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, signUpWithEmail, session, roles } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast({ title: "Signed in successfully!" });
      // Navigation will be handled by the useEffect below once roles are populated
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
      toast({ title: "Sign in failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUpWithEmail(email, password, fullName, selectedRole); // Pass selectedRole
      toast({ title: "Sign up successful!", description: "Please check your email to confirm your account if required." });
      // User will be signed in automatically if email confirmation is off or after confirming.
      // Reset form fields
      setEmail('');
      setPassword('');
      setFullName('');
      setSelectedRole('student');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up.');
      toast({ title: "Sign up failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Redirect after login/role fetch
  useEffect(() => {
    // Check if session exists and roles are populated
    if (session && roles.length > 0) {
      if (roles.includes('admin')) navigate('/admin', { replace: true });
      else if (roles.includes('instructor')) navigate('/instructor', { replace: true });
      else if (roles.includes('student')) navigate('/student', { replace: true });
      else navigate('/', { replace: true }); // Fallback, or to a specific default dashboard
    }
  }, [session, roles, navigate]);


  return (
    <Tabs defaultValue="signin" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <form onSubmit={handleSignIn} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="email-signin">Email</Label>
            <Input
              id="email-signin"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password-signin">Password</Label>
            <Input
              id="password-signin"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={handleSignUp} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="fullname-signup">Full Name</Label>
            <Input
              id="fullname-signup"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Your Name"
            />
          </div>
          <div>
            <Label htmlFor="email-signup">Email</Label>
            <Input
              id="email-signup"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password-signup">Password</Label>
            <Input
              id="password-signup"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Choose a strong password"
            />
          </div>
          <div>
            <Label>Sign up as</Label>
            <RadioGroup
              defaultValue="student"
              onValueChange={(value) => setSelectedRole(value as AppRole)}
              className="flex space-x-4 mt-2"
              value={selectedRole}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="role-student" />
                <Label htmlFor="role-student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instructor" id="role-instructor" />
                <Label htmlFor="role-instructor">Instructor</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-gray-500 mt-1">Admin accounts are created manually.</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;
