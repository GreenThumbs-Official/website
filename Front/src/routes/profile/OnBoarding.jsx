import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Background from '@/components/ui/background';
import Step1Profile from '@/components/Steps/Step1Profile';
import Step2Interests from '@/components/Steps/Step2Interests';
import Step3Plants from '@/components/Steps/Step3Plants';

export default function OnBoarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    profile: {},
    interests: [],
    favoritePlants: []
  });
  
  const [interests, setInterests] = useState([]);
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/auth/login');
      return;
    }
    
    // Charger les données nécessaires pour l'onboarding
    fetchInitialData();
  }, [navigate]);
  
  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      
      // Récupérer les intérêts
      const interestsResponse = await fetch('http://127.0.0.1:8000/api/intrests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Récupérer les favoris pour l'onboarding
      const favoritesResponse = await fetch('http://127.0.0.1:8000/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!interestsResponse.ok || !favoritesResponse.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      
      const interestsData = await interestsResponse.json();
      const favoritesData = await favoritesResponse.json();
      
      setInterests(interestsData);
      setPlants(favoritesData || []);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les données. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const manageComplete = async () => {
    console.log('Onboarding completed with data:', formData);
    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          profile: formData.profile,
          interests: formData.interests,
          favoritePlants: formData.favoritePlants
        })
      });
      
      if (!response.ok) {
        throw new Error('Error while completing onboarding.');
      }
      
      const result = await response.json();
      
      localStorage.setItem('user', JSON.stringify(result.user));
      
      navigate('/dash/user');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while completing onboarding.');
    } finally {
      setIsLoading(false);
    }
  };

  const ProgressIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map(step => (
        <div 
          key={step}
          className={`w-3 h-3 mx-1 rounded-full ${currentStep === step 
            ? 'bg-white' 
            : currentStep > step 
              ? 'bg-white bg-opacity-70' 
              : 'bg-white bg-opacity-30'}`}
        />
      ))}
    </div>
  );

  if (isLoading && currentStep === 1) {
    return (
      <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
        <Background />
        
        <div className="flex items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-md w-full p-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-lg flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
            <p className="text-white text-lg">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error && currentStep === 1) {
    return (
      <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
        <Background />
        
        <div className="flex items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-md w-full p-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-lg">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold mb-2">Erreur</h2>
              <p className="mb-4">{error}</p>
              <button 
                onClick={fetchInitialData}
                className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all px-4 py-2 rounded-lg text-white"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
      <Background />
      
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-md w-full p-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <svg className="w-10 h-10 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,3.5L6,7.5V12.5L12,16.5L18,12.5V7.5L12,3.5M12,1L21,6V13L12,18L3,13V6L12,1Z" />
            </svg>
            <h1 className="text-3xl font-bold">GreenThumbs</h1>
          </div>
          
          <ProgressIndicator />
          
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          
          {!isLoading && (
            <>
              {currentStep === 1 && (
                <Step1Profile 
                  onNext={nextStep} 
                  formData={formData} 
                  setFormData={setFormData} 
                />
              )}
              
              {currentStep === 2 && (
                <Step2Interests 
                  onNext={nextStep} 
                  onPrevious={previousStep} 
                  formData={formData} 
                  setFormData={setFormData}
                  interestOptions={interests}
                />
              )}
              
              {currentStep === 3 && (
                <Step3Plants 
                  onPrevious={previousStep} 
                  formData={formData} 
                  setFormData={setFormData} 
                  onComplete={manageComplete}
                  plantOptions={plants}
                />
              )}
            </>
          )}
          
          {error && currentStep > 1 && (
            <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg">
              <p className="text-white text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}