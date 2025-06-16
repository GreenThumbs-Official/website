import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProductShowcase from '@/components/ProductShowcase';
import CareGuide from '@/components/CareGuide';
import Background from '@/components/Background';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <Hero />
            <Features />
            <ProductShowcase />
            <CareGuide />
        </div>
    );
}