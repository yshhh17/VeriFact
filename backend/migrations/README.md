# Database Migrations

This folder contains SQL migration scripts for setting up the PostgreSQL database in Supabase.

## Migrations

### 001_initial_schema.sql
Creates the initial database schema with:
- Users table (extends Supabase auth.users)
- Detections table (stores AI detection and fact-check results)
- Row Level Security policies
- Indexes for performance
- Triggers for auto-updates
- Function to sync auth.users with public.users

## How to Run Migrations

### First Time Setup

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"+ New query"**
4. Copy the contents of `001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl/Cmd + Enter)
7. You should see: "Success. No rows returned"

### Verify Migration

1. Go to **Table Editor**
2. Verify these tables exist:
   - ✅ `users`
   - ✅ `detections`

3. Go to **Authentication** → **Policies**
4. Verify RLS policies are active

## Migration Best Practices

- Always backup before running migrations in production
- Test migrations in a development environment first
- Migrations are numbered sequentially (001, 002, etc.)
- Never modify a migration that has already been run
- Create new migrations for schema changes

## Future Migrations

When you need to add new tables or modify existing ones:

1. Create a new file: `002_description.sql`
2. Write your SQL changes
3. Test in development
4. Run in production
5. Document changes here

## Rollback

If you need to undo a migration:

1. Go to Supabase SQL Editor
2. Write the reverse operations (DROP TABLE, etc.)
3. Be extremely careful in production

## Common Issues

**Error: "relation already exists"**
- The tables were already created. Either drop them first or skip the migration.

**Error: "permission denied"**
- Make sure you're using the correct database credentials
- Check that your Supabase project is active

**Error: "syntax error"**
- Check that you copied the entire SQL file
- Verify no characters were corrupted during copy/paste

## Questions?

See the main [SUPABASE_MIGRATION.md](../SUPABASE_MIGRATION.md) guide for more details.
