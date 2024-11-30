import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
export const sql = neon(`postgres://neondb_owner:3xQHq0EWbPOT@ep-rough-dust-a40wd8ab-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`);

