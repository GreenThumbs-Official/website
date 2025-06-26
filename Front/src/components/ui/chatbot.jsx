import React, { useState, useRef, useEffect } from 'react';

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Optimistically add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/handle-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: input,
                    history: JSON.stringify(history)
                }),
            });
            const data = await response.json();
            // Update history from backend response
            setHistory(data.history || []);
            // Map backend history to messages for display
            const mappedMessages = (data.history || []).map(msg => ({
                text: msg.parts[0]?.text || '',
                sender: msg.role === 'user' ? 'user' : 'model'
            }));
            setMessages(mappedMessages);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            setMessages(prev => [...prev, { text: 'Désolé, une erreur s\'est produite. Veuillez réessayer.', sender: 'model' }]);
        } finally {
            setInput('');
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-bot">
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 bg-white text-[#6fbc29] rounded-full shadow-lg p-4 hover:bg-[#e6f9d5] transition z-50"
                >
                    💬
                </button>
            )}
            {open && (
                <div className="fixed bottom-0 right-0 w-80 h-96 bg-white text-black rounded-tl-2xl shadow-2xl flex flex-col z-50 animate-slide-in">
                    <div className="flex justify-between items-center p-4 border-b">
                        <span className="font-bold">Chat Bot</span>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:text-red-500 text-xl"
                        >
                            ×
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`mb-3 flex ${message.sender === 'user' ? 'justify-end ' : 'justify-start'}`}
                            >
                                <div 
                                    className={`inline-block px-3 py-2 rounded-lg ${message.sender === 'user' 
                                        ? 'bg-[#6fbc29] text-white rounded-br-none' 
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-left mb-3">
                                <div className="inline-block px-3 py-2 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="p-4 border-t flex gap-2"> 
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Votre message..."
                            className="flex-1 border rounded px-3 py-2 focus:outline-none min-w-0"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`shrink-0 ${isLoading ? 'bg-gray-400' : 'bg-[#6fbc29] hover:bg-[#5aa31f]'} text-white px-4 py-2 rounded transition`}
                            disabled={isLoading}
                        >
                            Envoyer
                        </button>
                    </form>
                </div>
            )}
            <style jsx>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s cubic-bezier(.4,0,.2,1);
                }
            `}</style>
        </div>
    );
}