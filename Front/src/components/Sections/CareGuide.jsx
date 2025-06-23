import React from 'react';

const careItems = [
  {
    icon: '💧',
    title: 'Arrosage',
    description: 'Une fois par semaine en été, une fois par mois en hiver',
  },
  {
    icon: '☀️',
    title: 'Luminosité',
    description: 'Exposition directe au soleil recommandée',
  },
  {
    icon: '🌡️',
    title: 'Température',
    description: 'Idéale entre 20 et 25°C',
  },
  {
    icon: '🪴',
    title: 'Rempotage',
    description: 'Tous les 2-3 ans au printemps',
  },
];

export default function CareGuide() {
  return (
    <section id="care" className="py-16 px-4">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl p-12">
        <h2 className="text-4xl font-light text-center mb-12">Guide d'entretien</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {careItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-normal mb-2">{item.title}</h3>
              <p className="opacity-90">{item.description}</p>
            </div>
          ))}
        </div>
        <button className="w-96 py-2 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all">
          <a href="/plants/Advices" className="hover:text-gray-200 transition-colors">Voir d'autres conseils pour vos plantes</a>
        </button>
      </div>
    </section>
  );
}