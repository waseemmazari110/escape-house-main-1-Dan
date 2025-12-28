/**
 * Create Missing Database Tables
 * 
 * This script creates all missing tables in your Turso database
 * Run with: node create-tables.mjs
 */

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || process.env.TURSO_CONNECTION_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env file');
  process.exit(1);
}

console.log('🗄️  Creating missing database tables...\n');
console.log('📍 Database:', TURSO_DATABASE_URL.split('@')[1] || TURSO_DATABASE_URL);

// Create database client
const db = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Read SQL file
const sqlContent = readFileSync('create-missing-tables.sql', 'utf-8');

// Remove comments and split into individual statements
const cleanedSQL = sqlContent
  .split('\n')
  .filter(line => !line.trim().startsWith('--'))
  .join('\n');

const statements = cleanedSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`\n📝 Found ${statements.length} SQL statements to execute\n`);

// Execute statements
let successCount = 0;
let errorCount = 0;

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i];
  
  // Extract table name from CREATE TABLE statement
  const tableMatch = statement.match(/CREATE TABLE.*?(\w+)\s*\(/i);
  const indexMatch = statement.match(/CREATE INDEX.*?(\w+)\s+ON/i);
  const name = tableMatch ? tableMatch[1] : (indexMatch ? indexMatch[1] : `Statement ${i + 1}`);
  
  try {
    await db.execute(statement);
    console.log(`✓ ${name}`);
    successCount++;
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log(`⊙ ${name} (already exists)`);
      successCount++;
    } else {
      console.error(`✗ ${name}: ${error.message}`);
      errorCount++;
    }
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`✓ Success: ${successCount}`);
if (errorCount > 0) {
  console.log(`✗ Errors: ${errorCount}`);
}
console.log(`${'='.repeat(50)}\n`);

if (errorCount === 0) {
  console.log('🎉 All tables created successfully!');
  console.log('\n📋 Next steps:');
  console.log('   1. Restart your dev server: npm run dev');
  console.log('   2. Test the subscription plans API: http://localhost:3000/api/subscriptions/plans');
  console.log('   3. Test public properties API: http://localhost:3000/api/public/properties\n');
} else {
  console.log('⚠️  Some tables could not be created. Check the errors above.');
}

process.exit(errorCount > 0 ? 1 : 0);
