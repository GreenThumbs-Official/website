import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';
import config from '@/config.json';

function Details(){

    async function generatePlantDetail() {
        const { id } = useParams();

        const reponse = await fetch(`https://perenual.com/api/v2/species/details/${id}?key=sk-bnAq6859557a5edb311135`);
        const plants = await reponse.json();

            let plantStock = document.createElement('div');
            let plantName = document.createElement('h3');
            let plantImg = document.createElement('img');
            let sizeMax = document.createElement('p');
            let sizeMin = document.createElement('p');
            plantImg.className = "w-64 h-64 object-cover rounded-lg shadow-lg";


            const plantSection = document.querySelector('.classPlantsFollow')
 
            plantName.textContent = plants.common_name
            plantImg.setAttribute('src', plants.default_image.regular_url) 

            let maxVal = parseInt(plants.dimensions[0].max_value) * 0.304 + "m"
            sizeMax.textContent = "Taille maximale de la plante " + maxVal
            
            plantSection.appendChild(plantName)
            plantSection.appendChild(plantImg)        
            plantStock.appendChild(sizeMin)
            plantStock.appendChild(sizeMax)

    }
    generatePlantDetail()
        
    return (
        <section className="classPlantsFollow">

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
