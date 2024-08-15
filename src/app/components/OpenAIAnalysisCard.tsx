import React, { useState } from 'react';
import { Card, Badge, Popover, Modal, Button, TextInput, Textarea } from 'flowbite-react';
import { DreamAnalysis, Verse, InterpretationElement } from '../types/dreamAnalysis';

interface OpenAIAnalysisCardProps {
  dream: DreamAnalysis;
  onDelete: (id: string) => void;
  onUpdate: (updatedDream: DreamAnalysis) => void;
}

const renderInterpretation = (interpretation: string | InterpretationElement[], verses: Verse[]): JSX.Element[] => {
  if (!interpretation) return [];

  if (typeof interpretation === 'string') {
    const parts = interpretation.split(/(<popover>[^<]+<\/popover>)/g);

    return parts.map((part, index) => {
      if (part.startsWith('<popover>') && part.endsWith('</popover>')) {
        const verseReference = part.slice(9, -10);
        const verse = verses.find(v => v.reference === verseReference);

        if (verse) {
          return (
            <Popover
              key={index}
              trigger="hover"
              content={
                <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                  <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{verse.reference}</h3>
                  </div>
                  <div className="px-3 py-2">
                    <p>{verse.text}</p>
                  </div>
                </div>
              }
            >
              <span className="text-blue-500 underline cursor-pointer">{verse.reference}</span>
            </Popover>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  } else if (Array.isArray(interpretation)) {
    return interpretation.map((element, index) => {
      if (typeof element === 'string') {
        return <span key={index}>{element}</span>;
      } else if (element.type === 'Popover') {
        const verse = verses.find(v => v.reference === element.props.children[0]);
        return (
          <Popover
            key={index}
            trigger={element.props.trigger}
            content={
              <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{element.props.children[0]}</h3>
                </div>
                <div className="px-3 py-2">
                  <p>{verse ? verse.text : element.props.content}</p>
                </div>
              </div>
            }
          >
            <span className="text-blue-500 underline cursor-pointer">{element.props.children[0]}</span>
          </Popover>
        );
      }
      return null;
    }).filter((element): element is JSX.Element => element !== null);
  }

  return [];
};

const FullDreamModal: React.FC<{ dream: DreamAnalysis; isOpen: boolean; onClose: () => void; onEdit: () => void; onDelete: () => void }> = ({ dream, isOpen, onClose, onEdit, onDelete }) => {
  return (
    <Modal dismissible show={isOpen} onClose={onClose}>
      <Modal.Header>{dream.title}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Original Dream</h3>
          <p>{dream.originalDream}</p>
          <hr className="my-4" />
          <h3 className="text-lg font-semibold">Interpretation</h3>
          <div>{renderInterpretation(dream.interpretation, dream.verses)}</div>
          {dream.gematriaInterpretation && (
            <>
              <hr className="my-4" />
              <h3 className="text-lg font-semibold">Gematria Interpretation</h3>
              <p>{dream.gematriaInterpretation}</p>
            </>
          )}
          {dream.colorSymbolism && (
            <>
              <hr className="my-4" />
              <h3 className="text-lg font-semibold">Color Symbolism</h3>
              <p>{dream.colorSymbolism}</p>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-wrap gap-2 mt-4">
          {dream.tags.map((tag, index) => (
            <Badge key={index} color="indigo">#{tag}</Badge>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button color="light" onClick={onEdit}>
            Edit
          </Button>
          <Button color="failure" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const EditDreamModal: React.FC<{ dream: DreamAnalysis; isOpen: boolean; onClose: () => void; onSave: (updatedDream: DreamAnalysis) => void }> = ({ dream, isOpen, onClose, onSave }) => {
  const [editedDream, setEditedDream] = useState<DreamAnalysis>(dream);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDream(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setEditedDream(prev => ({ ...prev, tags }));
  };

  const handleSave = () => {
    onSave(editedDream);
    onClose();
  };

  return (
    <Modal dismissible show={isOpen} onClose={onClose}>
      <Modal.Header>Edit Dream Analysis</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
            <TextInput
              id="title"
              name="title"
              value={editedDream.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="interpretation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interpretation</label>
            <Textarea
              id="interpretation"
              name="interpretation"
              value={typeof editedDream.interpretation === 'string' ? editedDream.interpretation : JSON.stringify(editedDream.interpretation)}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags (comma-separated)</label>
            <TextInput
              id="tags"
              name="tags"
              value={editedDream.tags.join(', ')}
              onChange={handleTagsChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>Save</Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const OpenAIAnalysisCard: React.FC<OpenAIAnalysisCardProps> = ({ dream, onDelete, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    console.log('Delete button clicked for dream:', dream.id);
    setIsModalOpen(false);
    console.log('Calling onDelete function');
    onDelete(dream.id);  // Update this line
    console.log('onDelete function called');
  };

  const renderInterpretationPreview = () => {
    if (typeof dream.interpretation === 'string') {
      // Remove HTML-like tags and get the first sentence
      const cleanInterpretation = dream.interpretation.replace(/<[^>]*>/g, '');
      const firstSentence = cleanInterpretation.split('.')[0];
      return firstSentence ? `${firstSentence}.` : 'No interpretation available.';
    }
    return 'No interpretation available.';
  };

  return (
    <>
      <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={handleCardClick}>
        <h3 className="text-lg font-bold mb-2">{dream.title}</h3>
        <div className="mb-4">
          {renderInterpretationPreview()}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {dream.tags.map((tag, index) => (
            <Badge key={index} color="indigo">#{tag}</Badge>
          ))}
        </div>
      </Card>
      <FullDreamModal 
        dream={dream} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditDreamModal 
        dream={dream} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={onUpdate}
      />
    </>
  );
};

export default OpenAIAnalysisCard;