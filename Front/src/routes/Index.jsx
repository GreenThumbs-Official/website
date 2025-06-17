import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Weather from '@/components/Weather';
import ProductShowcase from '@/components/ProductShowcase';
import CareGuide from '@/components/CareGuide';
import Background from '@/components/Background';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <Hero />
            <Weather />
            <ProductShowcase />
            <CareGuide />
        </div>
    );
}