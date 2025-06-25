import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';
import config from '@/config.json';

function Details() {
    const { id } = useParams();
    const [plantData, setPlantData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlantDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`https://perenual.com/api/v2/species/details/${id}?key=sk-bnAq6859557a5edb311135`);
                
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                setPlantData(data);
            } catch (err) {
                console.error('Erreur lors de la récupération des données de la plante:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlantDetail();
    }, [id]);

    const formatMaxHeight = (dimensions) => {
        if (!dimensions || dimensions.length === 0) return 'Information non disponible';
        return parseInt(dimensions[0].max_value) * 0.304 + "m";
    };

    if (loading) {
        return (
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="mt-4 text-white">Chargement des détails de la plante...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p className="font-bold">Erreur de chargement</p>
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!plantData) {
        return (
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <p className="text-white">Aucune information disponible pour cette plante.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl p-8 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {plantData.default_image && (
                        <img 
                            src={plantData.default_image.regular_url} 
                            alt={plantData.common_name} 
                            className="w-64 h-64 object-cover rounded-lg shadow-lg"
                        />
                    )}
                    
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-4">{plantData.common_name}</h3>
                        
                        <div className="space-y-4">
                            <p className="text-white">{plantData.description}</p>
                            
                            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-white mb-2">Caractéristiques</h4>
                                <p className="text-white">Taille maximale : {formatMaxHeight(plantData.dimensions)}</p>
                                {plantData.origin && plantData.origin.length > 0 && (
                                    <p className="text-white">Origine : {plantData.origin.join(', ')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


export default function PlantDetailPage() {
    return (
        <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-light pt-28 pb-8">Détails de la plante</h2>
                <Details />
            </div>
        </div>
    )
}
