-- Drop existing policies
drop policy if exists "Users can manage dream tags through dream analyses" on "public"."dream_tags";

-- Enable RLS
alter table "public"."dream_tags" enable row level security;

-- Create separate policies for different operations
create policy "Users can insert dream tags"
on "public"."dream_tags"
as permissive
for insert
to authenticated
with check (
  exists (
    select 1 from dream_analyses da 
    where da.id = dream_analysis_id 
    and da.user_id = auth.uid()
  )
);

create policy "Users can view dream tags"
on "public"."dream_tags"
as permissive
for select
to authenticated
using (
  exists (
    select 1 from dream_analyses da 
    where da.id = dream_analysis_id 
    and da.user_id = auth.uid()
  )
);

-- Ensure proper grants
grant usage on schema public to authenticated;
grant all on table public.dream_tags to authenticated;
grant all on table public.tags to authenticated;