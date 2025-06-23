import React, { useState, useEffect } from 'react';
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';
import config from '@/config.json';

function Details(){

    async function generatePlantDetail() {

        const reponse = await fetch("https://perenual.com/api/v2/species/details/${plant.id}?key=sk-7dPj68555c3d615a211096");
        const plants = await reponse.json();

        plants.data.forEach((plant) =>{
            let plantStock = document.createElement('div');
            let plantName = document.createElement('h3');
            let plantImg = document.createElement('img');

            const plantSection = document.querySelector('.classPlantsFollow')
 
            plantName.textContent = plant.common_name
            plantImg.setAttribute('src', plant.image_url)
            console.log(plantImg)
            console.log(plantName);

            plantStock.appendChild(plantName)
            plantStock.appendChild(plantImg)
            console.log(plantSection)            
            plantSection.appendChild(plantStock)
        })
    }
    generatePlantDetail()
        
    return (
        <section className="classPlantsFollow grid grid-cols-3 gap-20">

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
