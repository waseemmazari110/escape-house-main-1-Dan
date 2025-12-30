import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const TURSO_DATABASE_URL = process.env.TURSO_CONNECTION_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('❌ Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

async function runMigration() {
  const client = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  try {
    console.log('🚀 Starting database migration...\n');

    // Define migration statements
    const migrations = [
      {
        name: 'Add status column',
        sql: "ALTER TABLE properties ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'"
      },
      {
        name: 'Add rejection_reason column',
        sql: 'ALTER TABLE properties ADD COLUMN rejection_reason TEXT'
      },
      {
        name: 'Add approved_by column',
        sql: 'ALTER TABLE properties ADD COLUMN approved_by TEXT'
      },
      {
        name: 'Add approved_at column',
        sql: 'ALTER TABLE properties ADD COLUMN approved_at TEXT'
      },
      {
        name: 'Update existing properties to approved',
        sql: "UPDATE properties SET status = 'approved' WHERE is_published = 1"
      }
    ];

    // Execute each migration
    for (const migration of migrations) {
      try {
        console.log(`📝 ${migration.name}...`);
        await client.execute(migration.sql);
        console.log(`✅ ${migration.name} - SUCCESS\n`);
      } catch (error) {
        if (error.message?.includes('duplicate column') || 
            error.message?.includes('already exists')) {
          console.log(`⚠️  ${migration.name} - SKIPPED (already exists)\n`);
        } else {
          console.error(`❌ ${migration.name} - FAILED:`);
          console.error(error.message);
          throw error;
        }
      }
    }

    console.log('✅ Migration completed successfully!\n');

    // Verify the migration
    console.log('📊 Verifying migration...');
    const result = await client.execute(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
             SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM properties
    `);

    console.log('\n📈 Properties Status Summary:');
    console.table(result.rows);
    console.log('\n✅ Migration verification complete!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

runMigration();
