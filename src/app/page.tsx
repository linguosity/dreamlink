// app/page.tsx
import { createSupabaseServerComponentClient } from "@/lib/utils/supabase/server-client";
import { DreamItem } from '@/types/dreamAnalysis';
import DreamList from '../components/DreamList';
import DreamInputWrapper from '../components/DreamInputWrapper';
import ClientDreamsWrapper from '../components/ClientDreamsWrapper';
import DetailsButtonServer from '../components/DetailsButtonServer';

async function fetchDreams(supabase: any, userId: string): Promise<DreamItem[]> {
  const { data: rawDreams, error } = await supabase
    .from('dream_analyses')
    .select(`
      *,
      dream_tags(tags(*)),
      dream_entries(*),
      verses(*),
      interpretation_elements(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dreams:', error);
    return [];
  }

  return rawDreams as DreamItem[];
}

export default async function HomePage() {
  const supabase = createSupabaseServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  console.log('HomePage - User:', user ? 'Authenticated' : 'Not authenticated');

  let initialDreams: DreamItem[] = [];
  if (user) {
    initialDreams = await fetchDreams(supabase, user.id);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to DreamLink</h1>
      
      <DetailsButtonServer />
      
      {user ? (
        <ClientDreamsWrapper initialDreams={initialDreams}>
          <h2 className="text-2xl font-bold mt-8 mb-6">My Dream Journal</h2>
          <DreamInputWrapper userId={user.id} />
          <DreamList userId={user.id} />
        </ClientDreamsWrapper>
      ) : (
        <p>Please log in to view and add dreams.</p>
      )}
    </div>
  );
}