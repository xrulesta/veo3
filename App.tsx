
import React, { useState, useCallback } from 'react';
import { FormState, PromptData } from './types';
import { cameraMovements, timeOptions, lightingOptions, styleOptions, moodOptions, tenseActionExamples } from './constants';
import { generateDetailedPrompt, translatePrompt } from './services/geminiService';
import { FormField } from './components/FormField';
import { SelectField } from './components/SelectField';
import { PromptOutput } from './components/PromptOutput';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ExamplePrompts } from './components/ExamplePrompts';

export const App: React.FC = () => {
    const [formState, setFormState] = useState<FormState>({
        name: '',
        gender: '',
        age: '',
        origin: '',
        hair: '',
        clothing: '',
        skinColor: '',
        action: '',
        expression: '',
        location: '',
        time: 'Senja (Golden Hour)',
        cameraMovement: 'Static Shot',
        lighting: 'Natural Light',
        videoStyle: 'Cinematic',
        videoMood: 'Nostalgic',
        sound: '',
        dialogue: '',
        additionalDetails: '',
        negativePrompt: 'buram, kualitas rendah, teks, logo',
    });

    const [generatedPrompts, setGeneratedPrompts] = useState<PromptData>({
        indonesian: '',
        english: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'generator' | 'examples'>('generator');
    const [examplesUnlocked, setExamplesUnlocked] = useState<boolean>(false);
    const [unlockKeyInput, setUnlockKeyInput] = useState<string>('');
    const [unlockError, setUnlockError] = useState<string | null>(null);


    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }, []);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedPrompts({ indonesian: '', english: '' });

        try {
            const idPrompt = await generateDetailedPrompt(formState);
            setGeneratedPrompts(prev => ({ ...prev, indonesian: idPrompt }));

            const enPrompt = await translatePrompt(idPrompt, formState.dialogue, formState.negativePrompt);
            setGeneratedPrompts(prev => ({ indonesian: idPrompt, english: enPrompt }));

        } catch (err) {
            console.error(err);
            setError('Gagal menghasilkan prompt. Silakan coba lagi. Pastikan API Key Anda sudah benar.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleIndonesianPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setGeneratedPrompts(prev => ({ ...prev, indonesian: e.target.value }));
    };
    
    const handleExampleClick = (example: FormState) => {
        setFormState(example);
        setActiveTab('generator');
    };

    const handleUnlockExamples = () => {
        if (unlockKeyInput === 'lanexa@25') {
            setExamplesUnlocked(true);
            setUnlockError(null);
            setUnlockKeyInput('');
        } else {
            setUnlockError('Kata kunci salah. Coba lagi.');
        }
    };


    return (
        <div className="min-h-screen bg-blue-950 text-white p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-yellow-400">
                        Veo 3 Prompt Generator
                    </h1>
                    <p className="mt-2 text-lg text-gray-300">
                        Buat prompt video sinematik yang detail dan konsisten dengan mudah.
                    </p>
                </header>

                <div className="mb-6 flex justify-center border-b border-white/20">
                    <button 
                        onClick={() => setActiveTab('generator')}
                        className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium transition-colors duration-300 focus:outline-none ${activeTab === 'generator' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        Generator
                    </button>
                    <button 
                        onClick={() => setActiveTab('examples')}
                        className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium transition-colors duration-300 focus:outline-none ${activeTab === 'examples' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        Contoh Prompt
                    </button>
                </div>

                <main>
                    {activeTab === 'generator' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-card">
                                <h2 className="text-2xl font-semibold mb-6 border-b border-white/20 pb-3 text-yellow-400">Parameter Prompt</h2>
                                
                                <div className="space-y-4">
                                    <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                                        <h3 className="text-lg font-medium text-yellow-300 mb-3">Subjek Karakter</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField label="Nama" name="name" value={formState.name} onChange={handleChange} />
                                            <FormField label="Jenis Kelamin" name="gender" value={formState.gender} onChange={handleChange} />
                                            <FormField label="Usia" name="age" value={formState.age} onChange={handleChange} />
                                            <FormField label="Asal" name="origin" value={formState.origin} onChange={handleChange} />
                                            <FormField label="Rambut" name="hair" value={formState.hair} onChange={handleChange} />
                                            <FormField label="Pakaian" name="clothing" value={formState.clothing} onChange={handleChange} />
                                            <FormField label="Warna Kulit" name="skinColor" value={formState.skinColor} onChange={handleChange} />
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                                        <h3 className="text-lg font-medium text-yellow-300 mb-3">Konteks & Suasana</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField label="Aksi" name="action" value={formState.action} onChange={handleChange} />
                                            <FormField label="Ekspresi" name="expression" value={formState.expression} onChange={handleChange} />
                                            <FormField label="Tempat" name="location" value={formState.location} onChange={handleChange} />
                                            <SelectField label="Waktu" name="time" value={formState.time} onChange={handleChange} options={timeOptions} />
                                            <SelectField label="Gerakan Kamera" name="cameraMovement" value={formState.cameraMovement} onChange={handleChange} options={cameraMovements} />
                                            <SelectField label="Pencahayaan" name="lighting" value={formState.lighting} onChange={handleChange} options={lightingOptions} />
                                            <SelectField label="Gaya Video" name="videoStyle" value={formState.videoStyle} onChange={handleChange} options={styleOptions} />
                                            <SelectField label="Suasana Video" name="videoMood" value={formState.videoMood} onChange={handleChange} options={moodOptions} />
                                            <FormField label="Suara atau Musik" name="sound" value={formState.sound} onChange={handleChange} />
                                            <FormField label="Kalimat yang Diucapkan" name="dialogue" value={formState.dialogue} onChange={handleChange} />
                                            <div className="sm:col-span-2">
                                              <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-300 mb-1">Detail Tambahan</label>
                                              <textarea
                                                  id="additionalDetails"
                                                  name="additionalDetails"
                                                  value={formState.additionalDetails}
                                                  onChange={handleChange}
                                                  rows={3}
                                                  className="form-input"
                                                  placeholder="Detail kecil yang memperkaya adegan..."
                                              />
                                            </div>
                                            <div className="sm:col-span-2">
                                              <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-300 mb-1">Negative Prompt</label>
                                              <textarea
                                                  id="negativePrompt"
                                                  name="negativePrompt"
                                                  value={formState.negativePrompt}
                                                  onChange={handleChange}
                                                  rows={2}
                                                  className="form-input"
                                                  placeholder="Elemen yang ingin dihindari, misal: buram, teks, logo..."
                                              />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Memproses...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon />
                                                <span>Buat Prompt Ajaib</span>
                                            </>
                                        )}
                                    </button>
                                    {error && <p className="text-yellow-500 mt-4 text-center">{error}</p>}
                                </div>
                            </div>

                            <div className="glass-card space-y-6">
                                 <h2 className="text-2xl font-semibold border-b border-white/20 pb-3 text-yellow-400">Hasil Prompt</h2>
                                <PromptOutput
                                    label="Prompt Final (Bahasa Indonesia)"
                                    value={generatedPrompts.indonesian}
                                    onChange={handleIndonesianPromptChange}
                                    readOnly={false}
                                    isLoading={isLoading && !generatedPrompts.indonesian}
                                />
                                <PromptOutput
                                    label="Final Prompt (English)"
                                    value={generatedPrompts.english}
                                    readOnly={true}
                                     isLoading={isLoading && !generatedPrompts.english}
                                />
                            </div>
                        </div>
                    ) : (
                        <ExamplePrompts 
                            examples={tenseActionExamples} 
                            onExampleClick={handleExampleClick}
                            unlocked={examplesUnlocked}
                            unlockKey={unlockKeyInput}
                            onUnlockKeyChange={setUnlockKeyInput}
                            onUnlockSubmit={handleUnlockExamples}
                            unlockError={unlockError}
                        />
                    )}
                </main>
                 <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>
                        @2025 VEO 3 Prompt Generator by{' '}
                        <span className="font-semibold text-yellow-400">LANEXA</span>
                    </p>
                </footer>
            </div>
            <style>
                {`
                    .glass-card {
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border-radius: 16px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        padding: 1.5rem;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    }
                    .form-input {
                        width: 100%;
                        background: rgba(0, 0, 0, 0.2);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 8px;
                        padding: 0.75rem;
                        color: white;
                        transition: border-color 0.3s, box-shadow 0.3s;
                    }
                    .form-input:focus {
                        outline: none;
                        border-color: #facc15;
                        box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.4);
                    }
                    .form-input::placeholder {
                        color: #a1a1aa;
                    }
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: rgba(255, 255, 255, 0.05);
                      border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background-color: rgba(250, 204, 21, 0.5);
                      border-radius: 10px;
                      border: 2px solid transparent;
                      background-clip: content-box;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background-color: rgba(250, 204, 21, 0.7);
                    }
                `}
            </style>
        </div>
    );
};
