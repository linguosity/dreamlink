-- Enable the pgvector extension
create extension if not exists vector;

-- Add vector column to dream_analyses
alter table dream_analyses 
add column if not exists search_vector tsvector 
generated always as (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(original_dream, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(topic_sentence, '')), 'C')
) stored;

-- Create GIN index for fast full-text search
create index if not exists dream_analyses_search_idx 
on dream_analyses using gin(search_vector);

-- Create a function to search dreams with relevance ranking
create or replace function search_dreams(
  search_query text,
  p_user_id uuid,
  tag_filter text default null
)
returns table (
  id uuid,
  title text,
  relevance real
) language plpgsql as $$
begin
  return query
  select 
    da.id,
    da.title,
    ts_rank(da.search_vector, websearch_to_tsquery('english', search_query)) as relevance
  from dream_analyses da
  left join dream_tags dt on da.id = dt.dream_analysis_id
  left join tags t on dt.tag_id = t.id
  where 
    da.user_id = p_user_id
    and da.search_vector @@ websearch_to_tsquery('english', search_query)
    and (tag_filter is null or t.name = tag_filter)
  group by da.id, da.title, da.search_vector
  order by relevance desc;
end;
$$; 