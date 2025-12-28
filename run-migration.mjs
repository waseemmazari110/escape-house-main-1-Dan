import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const TURSO_DATABASE_URL = process.env.TURSO_CONNECTION_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('❌ Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

async function runMigration() {
  console.log('🚀 Starting database migration...\n');

  const client = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  try {
    // Read the migration SQL file
    const migrationSQL = readFileSync(
      join(__dirname, 'migration-approval-workflow.sql'),
      'utf-8'
    );

    console.log('📄 Migration SQL loaded');
    console.log('🔄 Executing migration...\n');

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty lines
      if (statement.startsWith('--') || statement.length === 0) {
        continue;
      }

      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await client.execute(statement);
        console.log(`✅ Statement ${i + 1} completed`);
      } catch (error) {
        // If column already exists, that's okay
        if (error.message?.includes('duplicate column name') || 
            error.message?.includes('already exists')) {
          console.log(`⚠️  Statement ${i + 1} skipped (already exists)`);
        } else {
          console.error(`❌ Statement ${i + 1} failed:`, error.message);
          throw error;
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Verifying properties table...');

    // Verify the migration
    try {
      const result = await client.execute(`
        SELECT 
          status,
          COUNT(*) as count
        FROM properties
        GROUP BY status
      `);

      console.log('\nProperty Status Distribution:');
      console.table(result.rows);
    } catch (verifyError) {
      console.log('⚠️  Could not verify with status query');
      console.log('Checking if table is accessible...');
      
      try {
        await client.execute(`SELECT * FROM properties LIMIT 1`);
        console.log('✅ Properties table accessible - migration likely succeeded');
      } catch (tableError) {
        throw new Error(`Table verification failed: ${tableError.message}`);
      }
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

runMigration();
