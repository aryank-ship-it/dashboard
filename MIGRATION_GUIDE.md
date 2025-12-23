# Team Members Migration Guide

Since we cannot use Supabase CLI directly, you need to apply the migration manually through the Supabase Dashboard.

## Steps to Apply Migration:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: `rwjevnccpuovdddxsvpm`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Execute the Migration**
   - Open the file: `supabase/migrations/20251223000000_create_team_members.sql`
   - Copy the entire content
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify the Migration**
   - Go to "Table Editor" in the left sidebar
   - You should see a new table called `team_members`
   - Check that the table has the following columns:
     - id (uuid)
     - user_id (uuid)
     - added_by (uuid)
     - created_at (timestamptz)

## Alternative: Direct SQL Execution

If you prefer, you can also execute this SQL directly:

```sql
-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policies for team_members
CREATE POLICY "Authenticated users can view team members"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can add team members"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete team members"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_members_added_by ON public.team_members(added_by);
```

## After Migration

Once the migration is applied, the Team Members feature will be fully functional!
