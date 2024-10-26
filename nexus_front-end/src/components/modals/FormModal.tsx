// src/components/modals/FormModal.tsx
import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

interface FormModalProps {
  title: string;
  layout: string[][];
  inputs: { [key: string]: React.ReactNode };
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}

const FormModal: React.FC<FormModalProps> = ({ title, layout, inputs, onSubmit, onCancel, submitLabel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{title}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
            <RiCloseLine size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-4 mb-4">
              {row.map((key) => (
                <div key={key} className="flex-1">
                  {inputs[key]}
                </div>
              ))}
            </div>
          ))}
          <div className="flex space-x-4">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors">
              {submitLabel}
            </button>
            <button type="button" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;

