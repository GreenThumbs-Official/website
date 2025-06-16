import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-light mb-4 leading-tight">Best quality</h1>
          <p className="text-xl mb-8 opacity-90">
            Découvrez notre sélection unique de plantes succulentes
          </p>
          <button className="px-8 py-3 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all transform hover:-translate-y-1">
            Découvrir
          </button>
        </div>
        <div className="relative">
          <img
            src="https://placehold.co/600"
            alt="Cactus"
            className="w-full h-auto rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}