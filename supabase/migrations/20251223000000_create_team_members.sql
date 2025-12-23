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
-- Authenticated users can view all team members
CREATE POLICY "Authenticated users can view team members"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can add team members
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

-- Only admins can remove team members
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

-- Create a view for team members with user details (for easier querying)
CREATE OR REPLACE VIEW public.team_members_with_details AS
SELECT 
  tm.id,
  tm.user_id,
  tm.added_by,
  tm.created_at,
  p.email,
  p.full_name,
  p.avatar_url,
  ur.role
FROM public.team_members tm
JOIN public.profiles p ON tm.user_id = p.id
LEFT JOIN public.user_roles ur ON tm.user_id = ur.user_id;

-- Grant access to the view
GRANT SELECT ON public.team_members_with_details TO authenticated;
