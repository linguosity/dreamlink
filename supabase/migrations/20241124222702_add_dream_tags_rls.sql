-- Enable RLS for dream_tags
alter table "public"."dream_tags" enable row level security;

-- Add RLS policy for dream_tags
create policy "Users can manage dream tags through dream analyses"
on "public"."dream_tags"
as permissive
for all
to authenticated
using (
  dream_analysis_id in (
    select id from dream_analyses 
    where user_id = auth.uid()
  )
)
with check (
  dream_analysis_id in (
    select id from dream_analyses 
    where user_id = auth.uid()
  )
);