import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

interface FormModalProps {
  title: string;
  layout: string[][];
  inputs: { [key: string]: React.ReactNode };
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  width?: string;
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  isLastStep?: boolean;
  errors?: { [key: string]: string };
  isSubmitting?: boolean;
}

const FormModal: React.FC<FormModalProps> = ({
  title,
  layout,
  inputs,
  onSubmit,
  onCancel,
  submitLabel,
  width,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isLastStep = false,
  errors = {},
  isSubmitting = false
}) => {
  const isMultiStep = currentStep !== undefined && totalSteps !== undefined && totalSteps > 1;

  return (
    <div className="fixed inset-0 flex bg-black bg-opacity-40 items-center justify-center z-50 overflow-y-auto py-10">
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg w-full ${width ? width : 'max-w-[40%]'} shadow-xl my-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            {isMultiStep ? `${title} - Paso ${currentStep} de ${totalSteps}` : title}
          </h2>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {isMultiStep && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep! / totalSteps!) * 100}%` }}
            ></div>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <ul className="list-disc list-inside">
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </div>
        )}

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
            {isMultiStep ? (
              <>
                {currentStep! > 1 && (
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
                  >
                    Anterior
                  </button>
                )}
                
                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={onNext}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Guardando...' : submitLabel}
                  </button>
                )}
              </>
            ) : (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : submitLabel}
              </button>
            )}

            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
