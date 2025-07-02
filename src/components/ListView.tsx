
import React, { useState } from 'react';
import { ArrowDown, Plus, Fire, Octagon, Trash2, Edit2 } from 'lucide-react';
import { List, ListItem } from '../types';

interface ListViewProps {
  list: List;
  onUpdateList: (list: List) => void;
  onBack: () => void;
}

const ListView: React.FC<ListViewProps> = ({ list, onUpdateList, onBack }) => {
  const [newItemText, setNewItemText] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: ListItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        isCompleted: false,
        isPriority: false,
        createdAt: Date.now()
      };
      onUpdateList({
        ...list,
        items: [...list.items, newItem]
      });
      setNewItemText('');
    }
  };

  const togglePriority = (itemId: string) => {
    const updatedItems = list.items.map(item => {
      if (item.id === itemId) {
        return { ...item, isPriority: !item.isPriority };
      }
      return item;
    });

    // Sort items: priority items first, then by creation date
    const sortedItems = updatedItems.sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;
      return a.createdAt - b.createdAt;
    });

    onUpdateList({ ...list, items: sortedItems });
  };

  const toggleComplete = (itemId: string) => {
    const updatedItems = list.items.map(item => {
      if (item.id === itemId) {
        return { ...item, isCompleted: !item.isCompleted, isPriority: false };
      }
      return item;
    });

    // Sort completed items to bottom
    const sortedItems = updatedItems.sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return a.createdAt - b.createdAt;
    });

    onUpdateList({ ...list, items: sortedItems });
  };

  const deleteItem = (itemId: string) => {
    onUpdateList({
      ...list,
      items: list.items.filter(item => item.id !== itemId)
    });
  };

  const startEdit = (item: ListItem) => {
    setEditingItem(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      onUpdateList({
        ...list,
        items: list.items.map(item =>
          item.id === editingItem ? { ...item, text: editText.trim() } : item
        )
      });
    }
    setEditingItem(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-b border-red-100">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <ArrowDown size={24} className="rotate-90" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{list.name}</h1>
            <p className="text-sm text-gray-600">
              {list.items.filter(item => !item.isCompleted).length} active, {list.items.filter(item => item.isCompleted).length} completed
            </p>
          </div>
        </div>
      </div>

      {/* Add Item Input */}
      <div className="fixed top-20 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder="Add new item..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={addItem}
              disabled={!newItemText.trim()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="pt-44 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-3">
            {list.items.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 shadow-sm border transition-all duration-300 ${
                  item.isCompleted 
                    ? 'opacity-60 border-gray-200' 
                    : item.isPriority 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Complete Button */}
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className={`transition-colors ${
                      item.isCompleted 
                        ? 'text-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Octagon size={18} />
                  </button>

                  {/* Item Text */}
                  <div className="flex-1">
                    {editingItem === item.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-800"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span 
                        className={`${
                          item.isCompleted 
                            ? 'line-through text-gray-500' 
                            : item.isPriority 
                              ? 'text-red-700 font-medium' 
                              : 'text-gray-800'
                        }`}
                        style={item.isCompleted ? {
                          background: 'linear-gradient(to right, red 0%, red 50%, transparent 50%)',
                          backgroundSize: '200% 2px',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'left bottom',
                          animation: 'laser-strike 0.5s ease-out'
                        } : {}}
                      >
                        {item.text}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => togglePriority(item.id)}
                      className={`transition-colors ${
                        item.isPriority 
                          ? 'text-red-500' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Fire size={18} />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {list.items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No items yet</p>
                <p className="text-gray-300 text-sm mt-2">Add your first item above</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={addItem}
        disabled={!newItemText.trim()}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-20 disabled:opacity-50"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default ListView;
