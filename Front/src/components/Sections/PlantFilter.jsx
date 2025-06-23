import React from 'react';

const filter = [
  {
    title: 'date de plantation',
  },
  {
    title: 'date de floraison',
  },
  {
    title: 'date de recolte',
  },
];

export default function PlantFilter() {
  return (
    <section id="care" className="py-16 px-4">

        <div>
            <h2 className="text-4xl font-light text-center mb-12">Filtrer vos plantes</h2>
            <p className="text-center text-lg mb-8">
                Utilisez les filtres ci-dessous pour trouver les plantes qui correspondent à vos besoins.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filter.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                    >
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <button className="w-full py-2 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all">
                            Appliquer le filtre
                        </button>
                    </div>
                ))}
                </div>
        </div>

    </section>
  );
}