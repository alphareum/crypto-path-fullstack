import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Client-side validation
  const validateForm = () => {
    if (name.length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, passwordConfirmation);
      // Redirect to modules page after successful registration
      navigate('/modules');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 8) return { label: 'Too short', color: 'text-destructive' };
    if (password.length < 12) return { label: 'Good', color: 'text-yellow-500' };
    return { label: 'Strong', color: 'text-success' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>
                Enter your information to get started
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  {passwordStrength && (
                    <p className={`text-xs ${passwordStrength.color} flex items-center gap-1`}>
                      {passwordStrength.label === 'Strong' && <CheckCircle2 className="w-3 h-3" />}
                      Password strength: {passwordStrength.label}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    placeholder="Confirm your password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  {passwordConfirmation && password !== passwordConfirmation && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Passwords do not match
                    </p>
                  )}
                  {passwordConfirmation && password === passwordConfirmation && password.length >= 8 && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
