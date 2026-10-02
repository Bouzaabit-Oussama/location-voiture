import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch the user's profile and tenant to check if they are a superadmin
  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', session.user.id)
    .single();

  if (!profile) {
    redirect('/dashboard');
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('is_superadmin')
    .eq('id', profile.tenant_id)
    .single();

  if (!tenant?.is_superadmin) {
    // If not superadmin, redirect to regular dashboard
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-slate-900 text-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-gradient-to-br from-indigo-500 to-purple-600">
              LV
            </div>
            <span className="text-xl font-bold tracking-tight">SuperAdmin<span className="text-indigo-400">Portal</span></span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Overview</Link>
            <Link href="/admin/tenants" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Agencies (Tenants)</Link>
            <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium">Back to Agency</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
