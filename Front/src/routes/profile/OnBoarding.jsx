import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const manageComplete = () => {
    console.log('Onboarding completed with data:', formData);
    
    navigate('/dash/user');
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
              onPrevious={prevStep} 
              formData={formData} 
              setFormData={setFormData} 
            />
          )}
          
          {currentStep === 3 && (
            <Step3Plants 
              onPrevious={prevStep} 
              formData={formData} 
              setFormData={setFormData} 
              onComplete={manageComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}