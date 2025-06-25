import React, { useState, useEffect } from 'react';
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';

export default function TipsShowcase() {
  const [allAdvices, setAllAdvices] = useState([]);
  const [starterTips, setStarterTips] = useState([]);
  const [advancedTips, setAdvancedTips] = useState([]);
  const [proTips, setProTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/advices');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setAllAdvices(data.data || []);
        
        const starter = [];
        const advanced = [];
        const pro = [];
        
        data.data.forEach((advice, index) => {
          const numberedAdvice = {
            ...advice,
            title: `${(index % 5) + 1}. ${advice.name}`
          };
          
          if (advice.category === 'starter' || !advice.category) {
            starter.push(numberedAdvice);
          } else if (advice.category === 'advanced') {
            advanced.push(numberedAdvice);
          } else if (advice.category === 'pro') {
            pro.push(numberedAdvice);
          }
        });
        
        setStarterTips(starter);
        setAdvancedTips(advanced);
        setProTips(pro);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchAdvices();
  }, []);
  
  return (
    <section id="products" className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
      <Background />
      <Header />
      <h1 className="text-5xl font-light mt-28 ml-12 leading-tight">Tout type de conseils pour être un expert en verdure !</h1>
      
      {loading ? (
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="text-2xl">Chargement des conseils...</p>
        </div>
      ) : error ? (
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="text-2xl text-red-300">Erreur: {error}</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div>
            <h2 className="text-4xl font-normal mb-2 pt-12">Conseils pour les premières pousses</h2>
            {starterTips.length > 0 ? (
              starterTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2 mt-8"
                >
                  <div className="p-6">
                    <h3 className="text-3xl font-normal mb-2">{tip.title}</h3>
                    <p className="text-xl font-normal mb-2">{tip.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xl py-4">Aucun conseil débutant disponible pour le moment.</p>
            )}

            <h2 className="text-4xl font-normal mb-2 pt-12">Conseils pour ceux qui ont la main verte</h2>
            {advancedTips.length > 0 ? (
              advancedTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2 mt-8"
                >
                  <div className="p-6 text-right">
                    <h3 className="text-3xl font-normal mb-2">{tip.title}</h3>
                    <p className="text-xl font-normal mb-2">{tip.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xl py-4">Aucun conseil intermédiaire disponible pour le moment.</p>
            )}

            <h2 className="text-4xl font-normal mb-2 pt-12">Conseils pour les rois du jardin</h2>
            {proTips.length > 0 ? (
              proTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2 mt-8"
                >
                  <div className="p-6">
                    <h3 className="text-3xl font-normal mb-2">{tip.title}</h3>
                    <p className="text-xl font-normal mb-2">{tip.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xl py-4">Aucun conseil expert disponible pour le moment.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}