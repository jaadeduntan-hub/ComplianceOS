// This is a one-time migration script
const Airtable = require('airtable');
const { createClient } = require('@supabase/supabase-js');

// Airtable config
const airtableBase = new Airtable({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID);

// Supabase config
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function migrateEndUsers() {
  const records = await airtableBase('End Users').select().all();
  
  const users = records.map(record => ({
    full_name: record.fields['Full Name'],
    email: record.fields['Email'],
    phone: record.fields['Phone'],
    risk_score: record.fields['Risk Score'],
    risk_category: record.fields['Risk Category'],
    status: record.fields['Status'],
    pep_status: record.fields['PEP Status'],
    sanctions_match: record.fields['Sanctions Match'],
    last_checked: record.fields['Last Checked'],
  }));

  const { data, error } = await supabase
    .from('end_users')
    .insert(users);

  if (error) {
    console.error('Migration error:', error);
  } else {
    console.log(`Migrated ${users.length} end users`);
  }
}

async function migrateAlerts() {
  const records = await airtableBase('Alerts').select().all();
  
  const alerts = records.map(record => ({
    alert_date: record.fields['Alert Date'],
    alert_type: record.fields['Alert Type'],
    severity: record.fields['Severity'],
    status: record.fields['Status'],
    alert_title: record.fields['Alert Title'],
    alert_description: record.fields['Alert Description'],
  }));

  const { data, error } = await supabase
    .from('alerts')
    .insert(alerts);

  if (error) {
    console.error('Migration error:', error);
  } else {
    console.log(`Migrated ${alerts.length} alerts`);
  }
}

async function migrateCompanies() {
  const records = await airtableBase('Companies').select().all();
  
  const companies = records.map(record => ({
    company_name: record.fields['Company Name'],
    registration_number: record.fields['Registration Number'],
    directors_count: record.fields['Directors Count'],
    psc_count: record.fields['PSC Count'],
    status: record.fields['Status'],
    last_checked: record.fields['Last Checked'],
    changes_detected: record.fields['Changes Detected'] || 0,
  }));

  const { data, error } = await supabase
    .from('companies')
    .insert(companies);

  if (error) {
    console.error('Migration error:', error);
  } else {
    console.log(`Migrated ${companies.length} companies`);
  }
}

// Run migration
async function migrate() {
  console.log('Starting migration...');
  await migrateEndUsers();
  await migrateAlerts();
  await migrateCompanies();
  console.log('Migration complete!');
}

migrate();