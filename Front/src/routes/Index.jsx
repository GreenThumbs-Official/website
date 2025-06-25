import React from 'react';
import Header from '@/components/Nav/Header';
import Hero from '@/components/Sections/Hero';
import Weather from '@/components/Sections/Weather';
import PlantsShowcase from '@/components/Sections/PlantsShowcase';
import CareGuide from '@/components/Sections/CareGuide';
import Background from '@/components/ui/background';
import { useState } from 'react';

export default function Home() {
        const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <Hero />
            <Weather />
            <PlantsShowcase />
            <CareGuide />
            <div className="chat-bot">
                {!open && (
                    <button
                        onClick={() => setOpen(true)}
                        className="fixed bottom-6 right-6 bg-white text-[#6fbc29] rounded-full shadow-lg p-4 hover:bg-[#e6f9d5] transition z-50"
                    >
                        💬
                    </button>
                )}
                {open && (
                    <div className="fixed bottom-0 right-0 w-80 h-96 bg-white text-black rounded-tl-2xl shadow-2xl flex flex-col z-50 animate-slide-in">
                        <div className="flex justify-between items-center p-4 border-b">
                            <span className="font-bold">Chat Bot</span>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-red-500 text-xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                        </div>
                <form className="p-4 border-t flex gap-2">
                    <input
                        type="text"
                        placeholder="Votre message..."
                        className="flex-1 border rounded px-3 py-2 focus:outline-none min-w-0"
                    />
                    <button
                        type="submit"
                        className="shrink-0 bg-[#6fbc29] text-white px-4 py-2 rounded hover:bg-[#5aa31f] transition"
                    >
                        Envoyer
                    </button>
                </form>
            </div>
                )}
            </div>
            <style>
                {`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s cubic-bezier(.4,0,.2,1);
                }
                `}
            </style>

        </div>
    );
}