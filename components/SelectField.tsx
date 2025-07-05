import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="form-input"
        >
            {options.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);
