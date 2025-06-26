import React from 'react';
import Header from '@/components/Nav/Header';
import Hero from '@/components/Sections/Hero';
import Weather from '@/components/Sections/Weather';
import PlantsShowcase from '@/components/Sections/PlantsShowcase';
import CareGuide from '@/components/Sections/CareGuide';
import Background from '@/components/ui/background';
import ChatBot from '@/components/ui/chatbot';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <Hero />
            <Weather />
            <PlantsShowcase />
            <CareGuide />
            <ChatBot />
        </div>
    );
}