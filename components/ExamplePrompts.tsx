
import React from 'react';
import { FormState } from '../types';
import { LockIcon } from './icons/LockIcon';

interface ExamplePromptsProps {
  examples: FormState[];
  onExampleClick: (example: FormState) => void;
  unlocked: boolean;
  unlockKey: string;
  onUnlockKeyChange: (value: string) => void;
  onUnlockSubmit: () => void;
  unlockError: string | null;
}

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ 
    examples, 
    onExampleClick, 
    unlocked, 
    unlockKey,
    onUnlockKeyChange,
    onUnlockSubmit,
    unlockError
}) => {
  return (
    <div className="glass-card">
      <h2 className="text-2xl font-semibold mb-4 border-b border-white/20 pb-3 text-yellow-400">Contoh Prompt Aksi Menegangkan</h2>
      
      {!unlocked && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-sm text-gray-300 mb-2">Hanya 1 contoh yang ditampilkan. Masukkan kata kunci untuk membuka semua contoh.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={unlockKey}
              onChange={(e) => onUnlockKeyChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onUnlockSubmit()}
              placeholder="Masukkan kata kunci..."
              className="form-input flex-grow"
            />
            <button
              onClick={onUnlockSubmit}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Buka Kunci
            </button>
          </div>
          {unlockError && <p className="text-yellow-500 mt-2 text-sm">{unlockError}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {examples.map((example, index) => {
          if (!unlocked && index >= 1) {
            return (
              <div key={index} className="bg-black/20 p-4 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center text-center min-h-[220px]">
                <LockIcon />
                <h3 className="text-lg font-bold text-gray-400 mt-2">Terkunci</h3>
                <p className="text-sm text-gray-500">Masukkan kata kunci untuk membuka</p>
              </div>
            );
          }
          
          return (
            <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:border-yellow-500/50 min-h-[220px]">
              <div>
                <h3 className="text-lg font-bold text-yellow-400">{example.title}</h3>
                <p className="mt-2 text-sm text-gray-300">
                  <span className="font-semibold">Aksi:</span> {example.action}
                </p>
                 <p className="mt-1 text-sm text-gray-300">
                  <span className="font-semibold">Tempat:</span> {example.location}
                </p>
              </div>
              <button
                onClick={() => onExampleClick(example)}
                className="mt-4 w-full bg-blue-600/80 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Gunakan Contoh Ini
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
