import { createSupabaseServerComponentClient } from "@/lib/utils/supabase/server-client";
import { DreamItem } from '@/types/dreamAnalysis';
import DreamList from '../components/DreamList';
import DreamInputWrapper from '../components/DreamInputWrapper';
import ClientDreamsWrapper from '../components/ClientDreamsWrapper';

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

export default async function DreamsPage() {
  const supabase = createSupabaseServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  console.log('DreamsPage - User:', user ? 'Authenticated' : 'Not authenticated');

  if (!user) {
    console.log('DreamsPage - No user found');
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Dream Journal</h1>
        <p>Please log in to view and add dreams.</p>
      </div>
    );
  }

  const initialDreams = await fetchDreams(supabase, user.id);

  return (
    <ClientDreamsWrapper initialDreams={initialDreams}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Dream Journal</h1>
        <DreamInputWrapper userId={user.id} />
        <DreamList userId={user.id} />
      </div>
    </ClientDreamsWrapper>
  );
}