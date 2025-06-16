import React from 'react';

const products = [
  {
    id: 1,
    name: 'Echinocactus',
    price: '24.99 €',
    image: 'https://placehold.co/300x280',
  },
  {
    id: 2,
    name: 'Mammillaria',
    price: '19.99 €',
    image: 'https://placehold.co/300x280',
  },
  {
    id: 3,
    name: 'Opuntia',
    price: '29.99 €',
    image: 'https://placehold.co/300x280',
  },
  {
    id: 4,
    name: 'Ferocactus',
    price: '34.99 €',
    image: 'https://placehold.co/300x280',
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-light text-center mb-12">Nos Plantes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-normal mb-2">{product.name}</h3>
                <p className="text-lg mb-4">{product.price}</p>
                <button className="w-full py-2 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all">
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}