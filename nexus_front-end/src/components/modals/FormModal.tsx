import React from 'react';
import { RiCloseLine, RiErrorWarningFill } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa';

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
  stepErrors?: { [key: number]: boolean };
  scrollableRef?: React.RefObject<HTMLDivElement>;
  additionalInfo?: React.ReactNode;
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
  isSubmitting = false,
  stepErrors = {},
  scrollableRef = null,
  additionalInfo
}) => {
  const isMultiStep = currentStep !== undefined && totalSteps !== undefined && totalSteps > 1;

  const renderStepIndicator = () => {
    return (
      <div className="relative mb-8 px-4">
        <div className="flex justify-center">
          <div className="relative w-full max-w-3xl">
            <div className="absolute top-4 left-0 right-0">
              <div className="absolute h-1 w-full bg-gray-200"></div>
              <div
                className="absolute h-1 bg-green-500 transition-all duration-300 ease-in-out"
                style={{
                  width: `${((currentStep! - 1) / (totalSteps! - 1)) * 100}%`,
                  maxWidth: '100%'
                }}
              ></div>
            </div>
            <div className="relative flex justify-between">
              {Array.from({ length: totalSteps! }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 transition-colors duration-200
                      ${step === currentStep
                        ? 'bg-blue-500 text-white'
                        : step < currentStep!
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      } ${stepErrors[step] && step === currentStep ? 'bg-red-500 text-white' : ''}`}
                  >
                    {stepErrors[step] && step === currentStep ? (
                      <RiErrorWarningFill size={16} />
                    ) : step < currentStep! ? (
                      <FaCheck size={12} />
                    ) : (
                      step
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex bg-black bg-opacity-40 items-center justify-center z-50 overflow-y-auto py-10" ref={scrollableRef}>
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg w-full ${width ? width : 'max-w-[40%]'} shadow-xl my-auto flex`}>
        {additionalInfo && (
          <div className="w-1/3 p-4 ">
            {additionalInfo}
          </div>
        )}
        <div className="flex-1 p-4">
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

          {isMultiStep && renderStepIndicator()}

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

            {Object.keys(errors).length > 0 && currentStep && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                <ul className="list-disc list-inside">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={`flex ${isMultiStep ? 'justify-between' : 'justify-end space-x-3'}`}>
              {!isMultiStep && (
                <button
                  type="button"
                  className="w-36 px-6 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg shadow-lg hover:shadow-gray-500/30 hover:bg-gray-600 active:transform active:scale-95 transition-all duration-200"
                  onClick={onCancel}
                >
                  Cancelar
                </button>
              )}

              {isMultiStep ? (
                <>
                  <button
                    type="button"
                    onClick={onPrevious}
                    disabled={currentStep! <= 1}
                    className={`w-36 px-6 py-2 text-sm font-medium text-white rounded-lg shadow-lg transition-all duration-200 
                      ${currentStep! <= 1
                        ? 'bg-gray-500 opacity-50'
                        : 'bg-gray-500 hover:bg-gray-600 active:transform active:scale-95 hover:shadow-gray-500/30'}`}
                  >
                    ← Anterior
                  </button>

                  {!isLastStep ? (
                    <button
                      type="button"
                      onClick={onNext}
                      className={`w-36 px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow-lg active:transform active:scale-95 transition-all duration-200
                          ${stepErrors[currentStep!] ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-500/30 hover:bg-blue-600'}`}
                      disabled={stepErrors[currentStep!]}
                    >
                      Siguiente →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onSubmit}
                      className={`w-36 px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-lg active:transform active:scale-95 transition-all duration-200 
                          ${stepErrors[currentStep!] ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-green-500/30 hover:bg-green-600'}`}
                      disabled={isSubmitting || stepErrors[currentStep!]}
                    >
                      {isSubmitting ? 'Guardando...' : submitLabel}
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  className={`w-36 px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-lg active:transform active:scale-95 transition-all duration-200 
                      ${stepErrors[currentStep!] ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-green-500/30 hover:bg-green-600'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : submitLabel}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormModal;