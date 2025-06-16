import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
      <nav className="max-w-6xl mx-auto flex justify-between items-center p-4 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
        <div className="flex items-center gap-2 text-2xl font-medium">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,3.5L6,7.5V12.5L12,16.5L18,12.5V7.5L12,3.5M12,1L21,6V13L12,18L3,13V6L12,1Z" />
          </svg>
          GreenThumbs
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#home" className="hover:text-gray-200 transition-colors">Accueil</a>
          <a href="#products" className="hover:text-gray-200 transition-colors">Produits</a>
          <a href="#care" className="hover:text-gray-200 transition-colors">Tutoriels</a>
          <a href="#contact" className="hover:text-gray-200 transition-colors">Contact</a>
        </div>
      </nav>
    </header>
  );
}