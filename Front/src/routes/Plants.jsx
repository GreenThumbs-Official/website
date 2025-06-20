import { createElement } from "react";
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';

function Plants(){
    
    async function afficherPlants() {

        const reponse = await fetch("http://127.0.0.1:8000/api/plants");
        const plants = await reponse.json();

        plants.data.forEach((plant) =>{
            let plantStock = document.createElement('div');
            let plantName = document.createElement('h3');
            let plantImg = document.createElement('img');
            let plantLink = document.createElement('a');
            let buttonView = document.createElement('button');


            const plantSection = document.querySelector('.classPlants')
 
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
    afficherPlants()

    return (
        <section className="classPlants grid grid-cols-3 gap-20">

        </section>
    )
}

export default function PlantsPage() {

    return (
        <div className="flex flex-col gap-12 items-start justify-start pt-10 pl-16 min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <h2 className="text-5xl font-light mt-28 ml-12 leading-tight">Les différentes plantes !</h2>
            <Plants />
        </div>
    )


}

