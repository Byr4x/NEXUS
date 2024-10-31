import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ label, name, value, onChange, placeholder, onBlur, required, disabled, multiple }) => (
  <div>
    <label htmlFor={name} className="block mb-1 font-medium text-gray-700 dark:text-gray-300">{label} {required && <span className="text-red-500">*</span>}</label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-400"
      onBlur={onBlur}
      disabled={disabled}
      multiple={multiple}
    />
  </div>
);

// NumberInput Component
interface NumberInputProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  step?: number;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, name, value, onChange, placeholder, onBlur, required, min, step, disabled }) => (
  <div>
    <label htmlFor={name} className="block mb-1 font-medium text-gray-700 dark:text-gray-300">{label} {required && <span className="text-red-500">*</span>}</label>
    <input
      type="number"
      id={name}
      name={name}
      value={value ? value : ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-400"
      onBlur={onBlur}
      min={min}
      step={step}
      disabled={disabled}
    />
  </div>
);

// SelectInput Component
interface SelectInputProps {
  label: string;
  name: string;
  value: any;
  onChange: (selectedOption: any) => void;
  options: { value: any; label: string }[];
  required?: boolean;
  disabled?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, name, value, onChange, options, required, disabled }) => (
  <div>
    <label htmlFor={name} className="block mb-1 font-medium text-gray-700 dark:text-gray-300">{label} {required && <span className="text-red-500">*</span>}</label>
    <Select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      className="react-select-container"
      classNamePrefix="react-select"
      isClearable
      isDisabled={disabled}
      styles={{
        control: (provided) => ({
          ...provided,
          padding: '2px',
          backgroundColor: 'var(--input-bg)',
          borderColor: 'var(--input-border)',
          '&:hover': {
            borderColor: 'var(--input-border-hover)',
          },
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: 'var(--input-bg)',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? 'var(--input-selected-bg)' : 'var(--input-bg)',
          color: state.isSelected ? 'var(--input-selected-text)' : 'var(--input-text)',
          '&:hover': {
            backgroundColor: 'var(--input-hover-bg)',
          },
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'var(--input-text)',
        }),
        input: (provided) => ({
          ...provided,
          color: 'var(--input-text)',
        }),
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: 'var(--input-focus)',
          primary25: 'var(--input-hover-bg)',
        },
      })}
    />
  </div>
);

// RadioInput Component
interface RadioInputProps {
  label: string;
  name: string;
  options: { value: any; label: string }[];
  selectedValue: any;
  onChange: (value: any) => void;
  required?: boolean;
}

export const RadioInput: React.FC<RadioInputProps> = ({ label, name, options, selectedValue, onChange, required }) => (
  <div>
    <p className="block mb-1 text-gray-700 dark:text-gray-300">{label} {required && <span className="text-red-500">*</span>}</p>
    {options.map(option => (
      <label key={option.value} className="inline-flex items-center mr-4">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={selectedValue === option.value}
          onChange={() => onChange(option.value)}
          className="form-radio text-sky-500"
        />
        <span className="ml-2 text-gray-900 dark:text-gray-100">{option.label}</span>
      </label>
    ))}
  </div>
);

// DateInput Component
interface DateInputProps {
  label: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
  name?: string;
  disabled?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({ label, selectedDate, onChange, required, name, disabled }) => (
  <div>
    <label className="block mb-1 text-gray-700 dark:text-gray-300">{label} {required && <span className="text-red-500">*</span>}</label>
    <DatePicker
      name={name}
      selected={selectedDate}
      onChange={onChange}
      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
      disabled={disabled}
    />
  </div>
);

// TimeInput Component
interface TimeInputProps {
  label: string;
  selectedTime: Date | null;
  onChange: (time: Date | null) => void;
  required?: boolean;
  name?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({ label, selectedTime, onChange, required, name }) => (
  <div>
    <label className="block mb-1 text-gray-700 dark:text-gray-300">{label} {required && <span className="text-red-500">*</span>}</label>
    <DatePicker
      name={name}
      selected={selectedTime}
      onChange={onChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
    />
  </div>
);

// TextArea Component
interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label htmlFor={name} className="block mb-1 text-gray-700 dark:text-gray-300">{label} {required && <span className="text-red-500">*</span>}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
      rows={4}
    />
  </div>
);

// ImageInput Component
interface ImageInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  accept?: string;
  required?: boolean;
}

export const ImageInput: React.FC<ImageInputProps> = ({ label, name, value, onChange, onDelete, accept, required }) => (
  <div>
    <label htmlFor={name} className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {value ? (
      <div className="relative mt-2 w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
        <img src={value} alt="Preview" className="w-full h-full object-contain" />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            type="button"
            onClick={() => document.getElementById(name)?.click()}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    ) : (
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm justify-center text-gray-600">
            <label
              htmlFor={name}
              className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500"
            >
              <span className="text-center p-1">Subir un archivo</span>
              <input
                id={name}
                name={name}
                type="file"
                className="sr-only"
                onChange={onChange}
                accept={accept}
              />
            </label>  
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
        </div>
      </div>
    )}
  </div>
);

// Add this at the end of the file
const styles = `
  :root {
    --input-bg: #ffffff;
    --input-text: #1f2937;
    --input-border: #d1d5db;
    --input-border-hover: #9ca3af;
    --input-focus: #3b82f6;
    --input-selected-bg: #3b82f6;
    --input-selected-text: #ffffff;
    --input-hover-bg: #f3f4f6;
  }

  .dark {
    --input-bg: #374151;
    --input-text: #f3f4f6;
    --input-border: #4b5563;
    --input-border-hover: #6b7280;
    --input-focus: #60a5fa;
    --input-selected-bg: #60a5fa;
    --input-selected-text: #ffffff;
    --input-hover-bg: #4b5563;
  }

  .react-select-container .react-select__control {
    background-color: var(--input-bg);
    border-color: var(--input-border);
  }

  .react-select-container .react-select__control:hover {
    border-color: var(--input-border-hover);
  }

  .react-select-container .react-select__menu {
    background-color: var(--input-bg);
  }

  .react-select-container .react-select__option {
    background-color: var(--input-bg);
    color: var(--input-text);
  }

  .react-select-container .react-select__option--is-selected {
    background-color: var(--input-selected-bg);
    color: var(--input-selected-text);
  }

  .react-select-container .react-select__option:hover {
    background-color: var(--input-hover-bg);
  }

  .react-select-container .react-select__single-value {
    color: var(--input-text);
  }
`;

// Inject the styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}
