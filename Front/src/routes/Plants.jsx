function Plants(){
    
    async function afficherPlants() {

        const reponse = await fetch("http://127.0.0.1:8000/api/plants");
        const plant = await reponse.json();

        const stockPlants = document.getElementById('classPlants');
        const onePlant = document.createElement('div');
        const plantName = document.createElement('p');
        const plantImg = document.createElement('img');

        plantName.textContent = plant.name;
        plantImg.src = plant.img;

        stockPlants.appendChild(onePlant);
        onePlant.appendChild(plantName);
        onePlant.appendChild(plantImg);
        
    }
    afficherPlants()

    return (
        <section classPlants="grid grid-cols-3 gap-20">

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

