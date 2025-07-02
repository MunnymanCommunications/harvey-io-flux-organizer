
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ListCard from '../components/ListCard';
import PriorityCard from '../components/PriorityCard';
import CreateListModal from '../components/CreateListModal';
import ListView from '../components/ListView';
import { List, ListItem } from '../types';

const Index = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLists = localStorage.getItem('harvey-lists');
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    }
  }, []);

  // Save to localStorage whenever lists change
  useEffect(() => {
    localStorage.setItem('harvey-lists', JSON.stringify(lists));
  }, [lists]);

  const createList = (name: string) => {
    const newList: List = {
      id: Date.now().toString(),
      name,
      items: [],
      position: { x: Math.random() * 200, y: Math.random() * 100 }
    };
    setLists([...lists, newList]);
    setShowCreateModal(false);
  };

  const updateList = (updatedList: List) => {
    setLists(lists.map(list => list.id === updatedList.id ? updatedList : list));
  };

  const deleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId));
  };

  const getAllPriorityItems = (): (ListItem & { listName: string })[] => {
    return lists.flatMap(list => 
      list.items
        .filter(item => item.isPriority && !item.isCompleted)
        .map(item => ({ ...item, listName: list.name }))
    );
  };

  if (selectedList) {
    const list = lists.find(l => l.id === selectedList);
    if (list) {
      return (
        <ListView
          list={list}
          onUpdateList={updateList}
          onBack={() => setSelectedList(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-b border-red-100">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Harvey iO
          </h1>
          <p className="text-gray-600 text-sm mt-1">Your intelligent list organizer</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-6 relative">
        <div className="container mx-auto">
          {/* Priority Card */}
          <PriorityCard
            priorityItems={getAllPriorityItems()}
            onUpdateItem={(itemId, listName, updates) => {
              const targetList = lists.find(l => l.name === listName);
              if (targetList) {
                const updatedList = {
                  ...targetList,
                  items: targetList.items.map(item =>
                    item.id === itemId ? { ...item, ...updates } : item
                  )
                };
                updateList(updatedList);
              }
            }}
          />

          {/* List Cards */}
          {lists.map(list => (
            <ListCard
              key={list.id}
              list={list}
              onUpdateList={updateList}
              onDeleteList={deleteList}
              onSelectList={setSelectedList}
            />
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-20 animate-pulse"
      >
        <Plus size={24} />
      </button>

      {/* Create List Modal */}
      {showCreateModal && (
        <CreateListModal
          onCreateList={createList}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default Index;
