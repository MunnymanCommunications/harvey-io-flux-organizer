
import React from 'react';
import { Fire, Octagon } from 'lucide-react';
import { ListItem } from '../types';

interface PriorityCardProps {
  priorityItems: (ListItem & { listName: string })[];
  onUpdateItem: (itemId: string, listName: string, updates: Partial<ListItem>) => void;
}

const PriorityCard: React.FC<PriorityCardProps> = ({ priorityItems, onUpdateItem }) => {
  const handleComplete = (item: ListItem & { listName: string }) => {
    onUpdateItem(item.id, item.listName, { 
      isCompleted: true, 
      isPriority: false 
    });
  };

  const handleRemovePriority = (item: ListItem & { listName: string }) => {
    onUpdateItem(item.id, item.listName, { isPriority: false });
  };

  return (
    <div className="fixed top-24 right-6 w-80 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-lg border-2 border-red-200 p-6 z-10 max-h-96 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Fire className="text-red-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Priority Tasks</h3>
      </div>

      <div className="space-y-3">
        {priorityItems.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center py-4">No priority tasks</p>
        ) : (
          priorityItems.map(item => (
            <div key={`${item.listName}-${item.id}`} className="bg-white rounded-lg p-3 border border-red-100 animate-fade-in">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.text}</p>
                  <p className="text-xs text-red-500 mt-1">{item.listName}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRemovePriority(item)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Remove priority"
                  >
                    <Fire size={14} />
                  </button>
                  <button
                    onClick={() => handleComplete(item)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Mark complete"
                  >
                    <Octagon size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PriorityCard;
