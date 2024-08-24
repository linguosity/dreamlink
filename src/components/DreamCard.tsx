// src/components/DreamCard.tsx
'use client';

import React, { useState } from 'react';
import { Card, Badge, Modal, Button } from 'flowbite-react';
import { Database } from '@/lib/utils/supabase/database.types';
import { createSupabaseClient } from '@/lib/utils/supabase/browser-client';

type DreamWithRelations = Database['public']['Tables']['dream_analyses']['Row'] & {
  dream_tags: Array<{
    tags: Database['public']['Tables']['tags']['Row']
  }>,
  dream_entries: Database['public']['Tables']['dream_entries']['Row'][],
  verses: Database['public']['Tables']['verses']['Row'][],
  interpretation_elements: Database['public']['Tables']['interpretation_elements']['Row'][]
};

const DreamCard: React.FC<{ dream: DreamWithRelations }> = ({ dream }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createSupabaseClient();

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  // You can add more client-side operations here using the supabase client

  return (
    <>
      <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={handleCardClick}>
        <h3 className="text-lg font-bold mb-2">{dream.title}</h3>
        <div className="mb-4">
          {dream.original_dream.substring(0, 100)}...
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {dream.dream_tags.map((tagObj, index) => (
            <Badge key={index} color="indigo">#{tagObj.tags.name}</Badge>
          ))}
        </div>
      </Card>

      <Modal dismissible show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>{dream.title}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Original Dream</h3>
            <p>{dream.original_dream}</p>
            <hr className="my-4" />
            <h3 className="text-lg font-semibold">Interpretation</h3>
            <p>{typeof dream.dream_entries[0]?.analysis === 'string' 
                ? dream.dream_entries[0].analysis 
                : JSON.stringify(dream.dream_entries[0]?.analysis)}</p>
            {dream.gematria_interpretation && (
              <>
                <hr className="my-4" />
                <h3 className="text-lg font-semibold">Gematria Interpretation</h3>
                <p>{dream.gematria_interpretation}</p>
              </>
            )}
            {dream.color_symbolism && (
              <>
                <hr className="my-4" />
                <h3 className="text-lg font-semibold">Color Symbolism</h3>
                <p>{dream.color_symbolism}</p>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DreamCard;