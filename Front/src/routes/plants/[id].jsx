import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';
import config from '@/config.json';

function Details(){
    const [tutorial, setTutorial] = useState(null);
    const [plantData, setPlantData] = useState(null);
    const { id } = useParams();
    // const reponse = await fetch(`https://perenual.com/api/v2/species/details/${id}?key=sk-bnAq6859557a5edb311135`);

    async function generatePlantDetail() {
        try {
            const response = await fetch(`http://localhost:8000/api/plants/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                setPlantData(null);
                return;
            }
            const plants = await response.json();

            setPlantData(plants);

            let plantStock = document.createElement('div');
            let plantName = document.createElement('h3');
            let plantDescription = document.createElement('p');
            let plantImg = document.createElement('img');
            let sizeMax = document.createElement('p');
            let plantOrigin = document.createElement('p');

            const plantSection = document.querySelector('.classPlantsFollow')

            plantDescription.textContent = plants.description || '';
            plantOrigin.textContent = Array.isArray(plants.origin) && plants.origin.length > 0 ? plants.origin[0] : '';


            plantName.textContent = plants.common_name || '';
            plantImg.setAttribute('src', plants.image_url || '')

            let maxVal = '';
            if (Array.isArray(plants.dimensions) && plants.dimensions.length > 0 && plants.dimensions[0].max_value) {
                maxVal = parseInt(plants.dimensions[0].max_value) * 0.304 + "m";
            }
            sizeMax.textContent = maxVal ? "Taille maximale de la plante : " + maxVal : '';

            plantSection.appendChild(plantName)
            plantSection.appendChild(plantImg)
            plantSection.appendChild(plantDescription)
            plantStock.appendChild(sizeMax)
            plantStock.appendChild(plantOrigin)
            plantSection.appendChild(plantStock)
        } catch (error) {
            setPlantData(null);
            // Optionally, set an error state here
            console.error('Error fetching plant details:', error);
        }
    }
    useEffect(() => {
        generatePlantDetail();
    }, [id]);

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
            const prompt = `Tu dois generer UNIQUEMENT un objet JSON valide pour un tutoriel de plante, sans aucun texte supplementaire avant ou apres. REGLES STRICTES: 1. Reponds UNIQUEMENT avec l'objet JSON, pas de texte explicatif 2. Utilise EXACTEMENT la structure fournie dans response_format 3. Ne pas inclure de texte, commentaires ou explications supplementaires 4. Assure-toi que l'objet JSON est valide et complet 5. Ne pas inclure de balises HTML, Markdown ou tout autre formatage 6. Tu dois lister plusieurs conseils dans chaque categorie, mais respecte la structure exacte DONNEES DE LA PLANTE: ${JSON.stringify(plantData).replace(/"/g, '')} STRUCTURE EXACTE A SUIVRE: Voir response_format ci-dessous. Genere le JSON maintenant:`;            const body = {
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

            const storeTutorial = await fetch('http://127.0.0.1:8000/api/tutorials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    plant_id: id,
                    tutorial: JSON.stringify(data.response)
                })
            })


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
            <section className="bg-green-600 rounded-lg p-4 my-4 mx-auto max-w-3xl">
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

    return (
        <section className="classPlantsFollow">
            <button onClick={generatePlantTutorial} >Generate Tutorial</button>
            {tutorial && renderTutorial(tutorial)}
        </section>
    )

}


export default function PlantDetailPage() {

    return (
        <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <h2 className="text-5xl font-bold pt-28 pl-12">Page de la plante</h2>
            <Details />
        </div>
    )
}

