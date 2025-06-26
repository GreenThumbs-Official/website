import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';
import config from '@/config.json';

function Details(){
    const [tutorial, setTutorial] = useState(null);
    const [plantData, setPlantData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPlantDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`https://perenual.com/api/v2/species/details/${id}?key=sk-Sofa685be57e475e411158`);

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

    async function generatePlantTutorial() {
        if (!plantData) return;

        delete plantData.image
        try {

            const response = await fetch(`http://127.0.0.1:8000/api/tutorials/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const existingTutorial = await response.json();
                if (existingTutorial) {
                    setTutorial(existingTutorial);
                    return;
                }
            }
        } catch (error) {
        }


        try {
            const prompt = `Tu dois generer UNIQUEMENT un objet JSON valide pour un tutoriel de plante, sans aucun texte supplementaire avant ou apres. REGLES STRICTES: 1. Reponds UNIQUEMENT avec l'objet JSON, pas de texte explicatif 2. Utilise EXACTEMENT la structure fournie dans response_format 3. Ne pas inclure de texte, commentaires ou explications supplementaires 4. Assure-toi que l'objet JSON est valide et complet 5. Ne pas inclure de balises HTML, Markdown ou tout autre formatage 6. Tu dois lister plusieurs conseils dans chaque categorie, mais respecte la structure exacte DONNEES DE LA PLANTE: ${JSON.stringify(plantData.scientific_name).replace(/https:\/\//g, '').replace(/"/g, '').replace()} STRUCTURE EXACTE A SUIVRE: Voir response_format ci-dessous. Genere le JSON maintenant:`;            const body = {
                prompt: prompt,
                response_syntax: 'json',
                response_format: {
                    "arrosage": {},
                    "lumiere": {},
                    "temperature": {},
                    "humidite": {},
                    "sol": {},
                    "engrais": {},
                    "taille": {},
                    "rempotage": {},
                    "drainage": {},
                    "ventilation": {},
                    "maladies_prevention": {},
                    "saisons": {}
                }
            };
            // Make API call
            const response = await fetch('http://127.0.0.1:8000/api/handle-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            setTutorial(data.response)

        } catch (error) {
            console.error('Error generating plant tutorial:', error);
            setTutorial(null);
        }
    }

    function renderTutorial(node) {
        if (typeof node !== 'object' || node === null) {
            return <span>{node}</span>;
        }
        return (
            <section className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-lg p-4 my-4 mx-auto max-w-3xl shadow-md">
                {Object.entries(node).map(([key, value]) => (
                    <div key={key} className="mb-2">
                        <strong className="capitalize text-green-900">{key}:</strong>
                        <ul className="list-disc ml-6">
                            {Array.isArray(value) ? (
                                value.map((item, index) => (
                                    <li key={index}>{renderTutorial(item)}</li>
                                ))
                            ) : (
                                <li>{renderTutorial(value)}</li>
                            )}
                        </ul>
                    </div>
                ))}
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
        <section className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-lg p-4 my-4 mx-auto max-w-3xl shadow-md">

            <div className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-30 rounded-3xl shadow-xl p-8 transition-all duration-300">

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

                            <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 p-4 rounded-lg shadow-md">
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
            <button
                onClick={generatePlantTutorial}
                className="mt-6 px-6 py-2 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-lg text-white shadow-md hover:bg-opacity-20 transition"
            >
                Générer le tutoriel
            </button>
            {tutorial && renderTutorial(tutorial)}
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


