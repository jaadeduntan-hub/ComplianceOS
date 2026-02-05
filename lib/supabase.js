import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Fetch End Users
export async function getEndUsers() {
  const { data, error } = await supabase
    .from('end_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching end users:', error);
    return [];
  }

  return data;
}

// Fetch Alerts
export async function getAlerts() {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('alert_date', { ascending: false });

  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }

  return data;
}

// Fetch Companies
export async function getCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('company_name', { ascending: true });

  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }

  return data;
}

// Fetch Customers
export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*');

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }

  return data;
}

export default supabase;