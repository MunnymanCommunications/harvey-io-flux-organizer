
import React, { useState, useRef } from 'react';
import { Fire, Trash2 } from 'lucide-react';
import { List } from '../types';

interface ListCardProps {
  list: List;
  onUpdateList: (list: List) => void;
  onDeleteList: (listId: string) => void;
  onSelectList: (listId: string) => void;
}

const ListCard: React.FC<ListCardProps> = ({ list, onUpdateList, onDeleteList, onSelectList }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      onUpdateList({ ...list, position: newPosition });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const visibleItems = list.items.filter(item => !item.isCompleted).slice(0, 3);
  const priorityCount = list.items.filter(item => item.isPriority && !item.isCompleted).length;

  return (
    <div
      ref={cardRef}
      className={`absolute w-80 bg-white rounded-xl shadow-lg border border-red-100 p-6 cursor-move transition-all duration-300 hover:shadow-xl ${
        isDragging ? 'scale-105 shadow-2xl' : ''
      }`}
      style={{
        left: `${list.position.x}px`,
        top: `${list.position.y}px`,
        zIndex: isDragging ? 1000 : 1
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-red-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onSelectList(list.id);
          }}
        >
          {list.name}
        </h3>
        <div className="flex items-center gap-2">
          {priorityCount > 0 && (
            <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full">
              <Fire size={12} className="text-red-500" />
              <span className="text-xs text-red-600 font-medium">{priorityCount}</span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteList(list.id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Preview Items */}
      <div className="space-y-2">
        {visibleItems.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No items yet</p>
        ) : (
          visibleItems.map(item => (
            <div key={item.id} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-red-300 rounded-full"></div>
              <span className={item.isPriority ? 'text-red-600 font-medium' : ''}>{item.text}</span>
              {item.isPriority && <Fire size={12} className="text-red-500" />}
            </div>
          ))
        )}
        {list.items.filter(item => !item.isCompleted).length > 3 && (
          <p className="text-xs text-gray-400 mt-2">
            +{list.items.filter(item => !item.isCompleted).length - 3} more items
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
        <span>{list.items.filter(item => !item.isCompleted).length} active</span>
        <span>{list.items.filter(item => item.isCompleted).length} completed</span>
      </div>
    </div>
  );
};

export default ListCard;
