const Airtable = require('airtable');

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID);

// Helper function to fetch all records from a table
async function getAllRecords(tableName) {
  try {
    const records = await base(tableName).select().all();
    return records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    return [];
  }
}

// Fetch End Users
export async function getEndUsers() {
  return getAllRecords('End Users');
}

// Fetch Alerts
export async function getAlerts() {
  return getAllRecords('Alerts');
}

// Fetch Customers
export async function getCustomers() {
  return getAllRecords('Customers');
}

// Fetch Companies
export async function getCompanies() {
  return getAllRecords('Companies');
}

// Fetch KYC Checks
export async function getKYCChecks() {
  return getAllRecords('KYC Checks');
}

// Fetch Audit Trail
export async function getAuditTrail() {
  return getAllRecords('Audit Trail');
}