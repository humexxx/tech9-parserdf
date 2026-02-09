import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL;

console.log('Testing connection to:', connectionString?.replace(/:([^:@]+)@/, ':****@'));

async function testConnection() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  try {
    const sql = postgres(connectionString, { max: 1 });
    const result = await sql`SELECT now()`;
    console.log('✅ Connection successful!', result);
    await sql.end();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
