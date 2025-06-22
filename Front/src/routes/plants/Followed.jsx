import React from 'react';
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/Background';

function Generate(){

    async function generateWithAPI() {

        const reponse = await fetch("GET https://perenual.com/api/v2/species-list?key=");
        const plants = await reponse.json();

        plants.data.forEach((plant) =>{
            let plantStock = document.createElement('div');
            let plantName = document.createElement('h3');
            let plantImg = document.createElement('img');
            let plantLink = document.createElement('a');
            let buttonView = document.createElement('button');


            const plantSection = document.querySelector('.classPlantsFollow')
 
            plantName.textContent = plant.name
            plantImg.setAttribute('src', plant.image_url)
            plantLink.setAttribute('href', "PlantDetails/" + plant.id)
            plantLink.textContent = "Voir les détails de la plante"
            console.log(plantImg)
            console.log(plantName);

            plantStock.appendChild(plantName)
            plantStock.appendChild(plantImg)
            plantStock.appendChild(buttonView)
            buttonView.appendChild(plantLink)
            console.log(plantSection)            
            plantSection.appendChild(plantStock)
        })
    }
    generateWithAPI()
        
    return (
        <section className="classPlantsFollow grid grid-cols-3 gap-20">

        </section>
    )

}

export default function PlantsFollowed() {
    return (
        <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />

            <h1 className="text-5xl font-light mt-28 ml-12 leading-tight">Vos plantes suivies</h1>
            <Generate />
        </div>
    );
}