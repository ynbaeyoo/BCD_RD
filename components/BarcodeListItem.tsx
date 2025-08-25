
import React, { useState } from 'react';
import { BarcodeItem } from '../types';

interface BarcodeListItemProps {
  item: BarcodeItem;
  isHighlighted: boolean;
  onUpdateMemo: (id: number, memo: string) => void;
  onToggleCheck: (id: number) => void;
  onDelete: (id: number) => void;
}

const BarcodeListItem: React.FC<BarcodeListItemProps> = ({ item, isHighlighted, onUpdateMemo, onToggleCheck, onDelete }) => {
  const [memo, setMemo] = useState(item.memo);

  const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value);
  };

  const handleMemoBlur = () => {
    if (memo !== item.memo) {
        onUpdateMemo(item.id, memo);
    }
  };
  
  const handleMemoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  return (
    <div className={`bg-gray-800 rounded-lg p-4 shadow-md flex flex-col gap-3 transition-all duration-300 ${isHighlighted ? 'animate-highlight ring-2 ring-indigo-500' : ''} ${item.checked ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => onToggleCheck(item.id)}
            className="h-6 w-6 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <div className="flex-grow">
            <p className={`font-mono text-lg ${item.checked ? 'line-through text-gray-500' : 'text-white'}`}>{item.data}</p>
            <p className="text-xs text-gray-400">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Delete item"
        >
          <TrashIcon />
        </button>
      </div>
      <div>
        <input
          type="text"
          value={memo}
          onChange={handleMemoChange}
          onBlur={handleMemoBlur}
          onKeyDown={handleMemoKeyDown}
          placeholder="Add a memo..."
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default BarcodeListItem;
