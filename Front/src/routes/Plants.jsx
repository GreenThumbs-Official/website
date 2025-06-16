import { createElement } from "react";

function Plants(){
    
    async function afficherPlants() {

        const reponse = await fetch("http://127.0.0.1:8000/api/plants");
        const plants = await reponse.json();

        plants.data.forEach((plant) =>{
            let plantStock = document.createElement('div');
            let plantName = document.createElement('h3');
            let plantImg = document.createElement('img');
            const plantSection = document.querySelector('.classPlants')

            plantName.textContent = plant.name
            plantImg.setAttribute('src', plant.image)
            console.log(plantImg)
            console.log(plantName);

            plantStock.appendChild(plantName)
            plantStock.appendChild(plantImg)
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
        <div className="flex flex-col gap-12 items-start justify-start pt-10 pl-16">
            <h2 className="text-5xl font-bold">Les différentes plantes !</h2>
            <Plants />
        </div>
    )

    
}

