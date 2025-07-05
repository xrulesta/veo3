
import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface PromptOutputProps {
    label: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    readOnly: boolean;
    isLoading: boolean;
}

export const PromptOutput: React.FC<PromptOutputProps> = ({ label, value, onChange, readOnly, isLoading }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if(value) {
            navigator.clipboard.writeText(value);
            setCopied(true);
        }
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    return (
        <div className="relative">
            <label className="block text-lg font-semibold text-gray-200 mb-2">{label}</label>
            <div className="relative">
                 {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                <textarea
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    className={`form-input w-full h-64 resize-y ${readOnly ? 'bg-black/30 cursor-not-allowed' : 'bg-black/20'}`}
                    placeholder={isLoading ? '' : 'Hasil prompt akan muncul di sini...'}
                />
                 <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-200"
                    title="Salin ke Clipboard"
                    disabled={!value}
                >
                    <ClipboardIcon copied={copied} />
                </button>
            </div>
            {value && <p className="text-right text-sm mt-1 text-gray-400">{value.length} karakter</p>}
        </div>
    );
};
