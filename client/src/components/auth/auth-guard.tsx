import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900">
        <Card className="w-full max-w-md mx-4 bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900">
        <Card className="w-full max-w-md mx-4 bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-slate-200">Authentication Required</h1>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Please log in to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireAdmin && !user.isAdmin) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900">
        <Card className="w-full max-w-md mx-4 bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-slate-200">Admin Access Required</h1>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              You need administrator privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
