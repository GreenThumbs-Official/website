import React from 'react';


export default function Features() {
    // async function afficherMeteo() {

    //     const reponse = await fetch("https://api.tomorrow.io/v4/weather/forecast?location=45.750000,4.850000&apikey=ZKj5bwVVSdpMtzqha7CCQzsWJvCHZq3S");
    //     const meteos = await reponse.json();

    //     meteos.data.forEach((meteo) =>{
    //         let meteoStock = document.createElement('div');
    //         let MeteoTemp = document.createElement('p');
    //         let MeteoDate = document.createElement('p');
    //         const MeteoSection = document.querySelector('.MeteoClass')

    //         MeteoTemp.textContent = meteo.temperature
    //         plantImg.setAttribute('src', meteo.image)
    //         console.log(plantImg)
    //         console.log(plantName);

    //         plantStock.appendChild(plantName)
    //         plantStock.appendChild(plantImg)
    //         console.log(plantSection)            
    //         plantSection.appendChild(plantStock)
    //     })
    // }
    // afficherPlants()

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="MeteoClass bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl p-8 transition-transform hover:-translate-y-2">

          </div>

      </div>
    </section>
  );
}