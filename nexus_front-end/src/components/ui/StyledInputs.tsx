// src/components/inputs/StyledInputs.tsx
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
}

export const TextInput: React.FC<TextInputProps> = ({ label, name, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-400"
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
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, name, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="number"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-400"
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
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, name, value, onChange, options }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <Select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      className="react-select-container"
      classNamePrefix="react-select"
      isClearable
      styles={{
        control: (provided) => ({
          ...provided,
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
}

export const RadioInput: React.FC<RadioInputProps> = ({ label, name, options, selectedValue, onChange }) => (
  <div className="mb-4">
    <p className="block mb-2 text-gray-700 dark:text-gray-300">{label}</p>
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
}

export const DateInput: React.FC<DateInputProps> = ({ label, selectedDate, onChange }) => (
  <div className="mb-4">
    <label className="block mb-2 text-gray-700 dark:text-gray-300">{label}</label>
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
    />
  </div>
);

// TimeInput Component
interface TimeInputProps {
  label: string;
  selectedTime: Date | null;
  onChange: (time: Date | null) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({ label, selectedTime, onChange }) => (
  <div className="mb-4">
    <label className="block mb-2 text-gray-700 dark:text-gray-300">{label}</label>
    <DatePicker
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
}

export const TextArea: React.FC<TextAreaProps> = ({ label, name, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb|1-2 text-gray-700 dark:text-gray-300">{label}</label>
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
