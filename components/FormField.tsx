import React from 'react';

interface FormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
            {label}
        </label>
        <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || `Masukkan ${label.toLowerCase()}...`}
            className="form-input"
        />
    </div>
);
