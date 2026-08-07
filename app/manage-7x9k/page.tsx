'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { loginUser, checkAuthStatus, verifyAccessCode } from '@/lib/actions/auth-actions';
import { useUserStore } from '@/store/use-user';

export default function SecureLoginPage() {
  const router = useRouter();
  const { setUser, logout } = useUserStore();

  // Access code gate
  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessError, setAccessError] = useState(false);
  // Holds the server's own explanation (e.g. rate limiting) so a throttled
  // or degraded attempt isn't misreported as a wrong code.
  const [accessErrorMsg, setAccessErrorMsg] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await checkAuthStatus();
        if (cancelled) return;
        if (res.authorized) {
          if (res.user?.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
          return;
        }
      } catch {
        await logout();
      } finally {
        if (!cancelled) setIsCheckingAuth(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingCode(true);
    setAccessError(false);
    setAccessErrorMsg('');

    try {
      const result = await verifyAccessCode(accessCode);
      if (result.valid) {
        setIsUnlocked(true);
      } else {
        setAccessError(true);
        // verifyAccessCode returns a message when the attempt was throttled
        // rather than wrong. Showing it prevents an infrastructure problem
        // from looking like a credential problem.
        setAccessErrorMsg('error' in result && result.error ? result.error : '');
      }
    } catch {
      setAccessError(true);
      setAccessErrorMsg('');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    if (!email || !password) {
      setError(true);
      setIsLoading(false);
      return;
    }

    try {
      const res = await loginUser(email, password);

      if (res.error) {
        setError(true);
      } else {
        setUser(res.user ?? null);

        if (res.user?.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-700" />
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Access code gate
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-3">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Restricted Access</h1>
            <p className="text-gray-500">Enter the access code to continue</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              {accessError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{accessErrorMsg || 'Invalid access code.'}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleAccessCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Access Code</Label>
                  <Input
                    id="accessCode"
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="••••••••"
                    disabled={isVerifyingCode}
                    required
                    autoFocus
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isVerifyingCode}>
                  {isVerifyingCode && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isVerifyingCode ? 'Verifying...' : 'Continue'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Login form (only shown after access code is verified)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-700 mb-3">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-gray-500">Garden State Abolitionists</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Invalid email or password. Please try again.</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
