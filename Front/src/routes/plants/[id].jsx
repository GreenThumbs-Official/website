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

        let maxRetries = 3;


        function validateTutorialStructure(obj) {
            return (
                obj &&
                typeof obj === 'object' &&
                'content' in obj &&
                'div_name' in obj &&
                'class' in obj &&
                Array.isArray(obj.innerdivs)
            );
        }

        // Helper function to clean and extract JSON from response
        function extractJSON(responseText) {
            let cleanResponse = responseText.trim();

            // Find JSON boundaries
            const jsonStart = cleanResponse.indexOf('{');
            const jsonEnd = cleanResponse.lastIndexOf('}') + 1;

            if (jsonStart !== -1 && jsonEnd > jsonStart) {
                cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
            }

            return cleanResponse;
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const prompt = `Tu dois générer UNIQUEMENT un objet JSON valide pour un tutoriel de plante, sans aucun texte supplémentaire avant ou après.

RÈGLES STRICTES:
1. Réponds UNIQUEMENT avec l'objet JSON, pas de texte explicatif
2. Utilise EXACTEMENT la structure fournie dans response_format
3. Remplis SEULEMENT les champs "content" avec du texte (pas de HTML)
4. Garde tous les "div_name" et "class" exactement comme dans le template
5. Adapte le nombre d'éléments selon le contenu nécessaire
6. Utilise les classes Tailwind fournies sans les modifier

DONNÉES DE LA PLANTE: ${JSON.stringify(plantData)}

STRUCTURE EXACTE À SUIVRE: Voir response_format ci-dessous.
Génère le JSON maintenant:`;

                const body = {
                    prompt: prompt,
                    response_syntax: 'json',
                    temperature: 0.3, // Ajout pour plus de consistance
                    response_format: {
                        "content": "", // Texte du conteneur principal (généralement vide)
                        "div_name": "div",
                        "class": "bg-white/20 rounded-xl p-4 my-4 shadow",
                        "innerdivs": [
                            {
                                "content": "TITRE_DU_TUTORIEL_ICI", // Exemple de ce qui doit être rempli
                                "div_name": "h1",
                                "class": "text-3xl font-bold text-green-900 mb-4"
                            },
                            {
                                "content": "",
                                "div_name": "div",
                                "class": "bg-white/30 rounded-lg p-3 my-3",
                                "innerdivs": [
                                    {
                                        "content": "TITRE_DE_SECTION_ICI",
                                        "div_name": "h2",
                                        "class": "text-2xl font-semibold text-green-800 mt-4 mb-2"
                                    },
                                    {
                                        "content": "PARAGRAPHE_DESCRIPTIF_ICI",
                                        "div_name": "p",
                                        "class": "text-base text-green-950 mb-2"
                                    }
                                ]
                            }
                        ]
                    }
                };
                // Make API call
                const response = await fetch('http://127.0.0.1:8000/api/handle-prompt/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Extract and clean the JSON response
                const cleanResponse = extractJSON(data.response);

                // Parse the JSON
                const parsedTutorial = JSON.parse(cleanResponse);

                // Validate the structure
                if (!validateTutorialStructure(parsedTutorial)) {
                    throw new Error('Invalid tutorial structure received');
                }

                // Success! Set the tutorial and return
                setTutorial(parsedTutorial);
                console.log(`Tutorial generated successfully on attempt ${attempt}`);
                return parsedTutorial;

            } catch (error) {
                console.log(`Attempt ${attempt} failed:`, error.message);

                if (attempt === maxRetries) {
                    console.error(`Failed to generate tutorial after ${maxRetries} attempts:`, error);
                    // Optionally set an error state or show user feedback
                    // setTutorialError(`Failed to generate tutorial: ${error.message}`);
                    throw new Error(`Failed to generate tutorial after ${maxRetries} attempts: ${error.message}`);
                }

                // Wait a bit before retrying (optional)
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    function renderTutorial(node) {
        if (!node) return null;
        const Tag = node.div_name || 'div';
        const props = {};
        if (node.class) props.className = node.class;
        const children = [];
        if (node.content) children.push(node.content);
        if (Array.isArray(node.innerdivs) && node.innerdivs.length > 0) {
            node.innerdivs.forEach((child) => {
                const rendered = renderTutorial(child);
                if (rendered) children.push(rendered);
            });
        }
        if (children.length === 0) return null;
        return React.createElement(Tag, props, ...children);
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
