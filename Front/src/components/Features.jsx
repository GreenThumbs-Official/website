import React from 'react';

const features = [
  {
    icon: '🪴',
    title: 'Qualité Premium',
    description: 'Sélection rigoureuse des meilleures variétés de cactus',
  },
  {
    icon: '🌱',
    title: 'Conseils Experts',
    description: 'Guides détaillés pour l\'entretien de vos plantes',
  },
  {
    icon: '🚚',
    title: 'Livraison Soignée',
    description: 'Emballage sécurisé pour une livraison sans dommage',
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl p-8 transition-transform hover:-translate-y-2"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-normal mb-4">{feature.title}</h3>
            <p className="opacity-90">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}