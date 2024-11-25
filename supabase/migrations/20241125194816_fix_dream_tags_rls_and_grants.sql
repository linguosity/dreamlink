-- First, ensure RLS is enabled
alter table "public"."dream_tags" enable row level security;

-- Drop existing policy if it exists
drop policy if exists "Users can manage dream tags through dream analyses" on "public"."dream_tags";

-- Create new policy with proper checks
create policy "Users can manage dream tags through dream analyses"
on "public"."dream_tags"
as permissive
for all
to authenticated
using (
  exists (
    select 1 
    from dream_analyses da 
    where da.id = dream_analysis_id 
    and da.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 
    from dream_analyses da 
    where da.id = dream_analysis_id 
    and da.user_id = auth.uid()
  )
);

-- Ensure proper grants are in place
grant usage on schema public to authenticated;
grant all privileges on table public.dream_tags to authenticated;