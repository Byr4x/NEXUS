// src/components/modals/ViewModal.tsx
import React, { useCallback, useRef } from 'react';
import { RiCloseLine } from 'react-icons/ri';

interface ViewModalProps {
  title: string;
  layout: string[][];
  content: { [key: string]: React.ReactNode };
  onClose: () => void;
  width?: string;
}

const ViewModal: React.FC<ViewModalProps> = ({ title, layout, content, onClose, width }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-auto py-8" onClick={handleOutsideClick}>
      <div ref={modalRef} className={`bg-white dark:bg-gray-800 p-6 rounded-lg w-full my-auto ${width || 'max-w-lg'} shadow-xl`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
            <RiCloseLine size={24} />
          </button>
        </div>
        <div>
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-4 mb-4">
              {row.map((key) => (
                <div key={key} className="flex-1">
                  {content[key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
