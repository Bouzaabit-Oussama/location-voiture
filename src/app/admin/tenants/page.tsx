import { supabaseServer } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default async function AdminTenantsPage() {
  const supabase = supabaseServer();

  // Fetch all tenants with some basic metrics (this is naive, usually would use RPC or aggregations)
  const { data: tenants } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agencies</h1>
          <p className="text-slate-500 mt-1">Manage all tenant workspaces on the platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Agencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Agency Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">ICE / IF</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants?.map((tenant) => (
                  <tr key={tenant.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {tenant.name}
                      {tenant.is_superadmin && (
                        <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-800">SuperAdmin</Badge>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-slate-900">{tenant.email}</div>
                      <div className="text-slate-500 text-xs">{tenant.phone}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-slate-900">{tenant.ice}</div>
                      <div className="text-slate-500 text-xs">{tenant.if_number}</div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={tenant.is_active ? 'default' : 'destructive'}>
                        {tenant.is_active ? 'Active' : 'Suspended'}
                      </Badge>
                      <div className="text-xs mt-1 text-slate-500 capitalize">
                        {tenant.subscription_status || 'Trial'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {format(new Date(tenant.created_at), 'dd MMM yyyy')}
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">Manage</button>
                    </td>
                  </tr>
                ))}
                
                {(!tenants || tenants.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No agencies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
