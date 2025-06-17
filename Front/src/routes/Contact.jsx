import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Background from "@/components/Background";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Contact() {
    const navigate = useNavigate();

    const manageSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('https://formspree.io/f/xblyyqnl', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Message sent successfully!');
                e.target.reset();
            } else {
                alert('Error while sending message.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error while sending message.');
        }
    };

    return (
        <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-12">
                <div className="max-w-xl w-full p-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold mb-8 text-center text-white">Contactez-nous</h1>
                    <form onSubmit={manageSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nom" className="text-white font-medium">Nom</Label>
                            <Input 
                                type="text" 
                                name="nom" 
                                id="nom" 
                                placeholder="Votre nom"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="prenom" className="text-white font-medium">Prénom</Label>
                            <Input 
                                type="text" 
                                name="prenom" 
                                id="prenom" 
                                placeholder="Votre prénom"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white font-medium">Email</Label>
                            <Input 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="votre.email@exemple.com"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="tel" className="text-white font-medium">Téléphone</Label>
                            <Input 
                                type="tel" 
                                name="tel" 
                                id="tel" 
                                placeholder="Votre numéro de téléphone"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-white font-medium">Message</Label>
                            <Textarea 
                                name="message" 
                                id="message" 
                                rows={4}
                                placeholder="Votre message..."
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500 resize-none"
                                required
                            />
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all transform hover:-translate-y-1 text-white font-medium py-3"
                        >
                            Envoyer
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}