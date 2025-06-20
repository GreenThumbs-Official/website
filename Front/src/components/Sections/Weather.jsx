import React, { useState, useEffect } from 'react';

const API_KEY = 'ZKj5bwVVSdpMtzqha7CCQzsWJvCHZq3S';
const LOCATION = '45.750000,4.850000'; // Lyon, France
const API_URL = `https://api.tomorrow.io/v4/weather/forecast?location=${LOCATION}&timesteps=1d&apikey=${API_KEY}`;

export default function Weather() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.timelines && data.timelines.daily) {
          setWeatherData(data.timelines.daily);
        } else {
          throw new Error('Format de données invalide');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données météo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  };

  const formatTemperature = (temp) => {
    return Math.round(temp) + '°C';
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Chargement des données météo...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Erreur de chargement</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Lorem Ipsum
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {weatherData.slice(0, 6).map((meteo, index) => (
            <div 
              key={index}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {formatDate(meteo.time)}
                </h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatTemperature(meteo.values.temperatureApparentAvg)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Min:</span>
                    <span className="font-medium">
                      {formatTemperature(meteo.values.temperatureMin)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span className="font-medium">
                      {formatTemperature(meteo.values.temperatureMax)}
                    </span>
                  </div>
                  {meteo.values.humidity && (
                    <div className="flex justify-between">
                      <span>Humidité:</span>
                      <span className="font-medium">
                        {Math.round(meteo.values.humidity)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}