-- Modify the dream_tags RLS policy to handle new insertions
drop policy if exists "Users can manage dream tags through dream analyses" on "public"."dream_tags";

create policy "Users can manage dream tags through dream analyses"
on "public"."dream_tags"
as permissive
for all
to authenticated
using (
  exists (
    select 1 from dream_analyses 
    where id = dream_analysis_id 
    and user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from dream_analyses 
    where id = dream_analysis_id 
    and user_id = auth.uid()
  )
);