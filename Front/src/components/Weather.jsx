import React from 'react';
import { createElement } from "react";

export default function Weather() {
    async function renderWeather() {

        const reponse = await fetch("https://api.tomorrow.io/v4/weather/forecast?location=45.750000,4.850000&timesteps=1d&apikey=ZKj5bwVVSdpMtzqha7CCQzsWJvCHZq3S");
        const meteos = await reponse.json();

        meteos.timelines.daily.forEach((meteo) =>{
            let meteoStock = document.createElement('div');
            let MeteoTemp = document.createElement('p');
            let MeteoDate = document.createElement('p');
            const MeteoSection = document.querySelector('.MeteoClass')

            MeteoTemp.textContent = meteo.values.temperatureApparentAvg + "°c"
            const date = new Date(meteo.time);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const dateFr = new Intl.DateTimeFormat('fr-FR', options).format(date);

            MeteoDate.textContent = dateFr;
            console.log(MeteoTemp)
            console.log(MeteoDate);

            meteoStock.appendChild(MeteoTemp)
            meteoStock.appendChild(MeteoDate)
            console.log(MeteoSection)            
            MeteoSection.appendChild(meteoStock)
        })
    }
    renderWeather()

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="MeteoClass bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl p-8 transition-transform hover:-translate-y-2">

          </div>

      </div>
    </section>
  );
}