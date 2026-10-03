import { createClient } from '@/lib/supabase/server';
import { Building2, Users, Car, CreditCard } from 'lucide-react';

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Fetch some quick platform metrics
  const { count: tenantCount } = await supabase.from('tenants').select('*', { count: 'exact', head: true });
  const { count: userCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true });
  const { count: vehicleCount } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500 mt-1">Global statistics across all agencies on Location Voiture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Total Agencies</h3>
            <Building2 className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{tenantCount || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Active tenants on the platform</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Total Users</h3>
            <Users className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{userCount || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Registered staff members</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Total Vehicles</h3>
            <Car className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{vehicleCount || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Managed cars across agencies</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Estimated MRR</h3>
            <CreditCard className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">-- DH</div>
            <p className="text-xs text-slate-500 mt-1">Pending billing integration</p>
          </div>
        </div>
      </div>
    </div>
  );
}
