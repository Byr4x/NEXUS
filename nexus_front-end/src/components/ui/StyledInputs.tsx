// src/components/inputs/StyledInputs.tsx
import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// TextInput Component
interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, name, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-2 text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
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
    <label htmlFor={name} className="block mb-2 text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="number"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
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
    <label htmlFor={name} className="block mb-2 text-gray-700 dark:text-gray-300">{label}</label>
    <Select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      className="dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
      isClearable
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
    <label htmlFor={name} className="block mb-2 text-gray-700 dark:text-gray-300">{label}</label>
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
