import React, { useState, useRef, useEffect } from 'react';
import { Send, X, RefreshCcw } from 'lucide-react';
import './Chat.css'; // Ensure this file is correctly set up
import logo from './assest/logo.png'; 
import icon from './assest/Icon.png';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const welcomeMessage = "Welcome to the Intellibotics Limited! How can I assist you today?";

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    if (isOpen && messages.length === 0) {
      setMessages(prev => [...prev, { text: welcomeMessage, sender: 'bot' }]);
    }
  }, [messages, isOpen]); // Include isOpen to check if it's opened

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      console.log('Response data:', data); // Log response
      const sanitizedBotMessage = data.message.replace(/(\*\*|\#\#|\*)/g, '').trim();
      const botMessage = { text: sanitizedBotMessage, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error during fetch:', error.message); // More detailed error
      const errorMessage = { text: "Sorry, I couldn't process your request.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 sm:w-96 h-[500px] flex flex-col border border-gray-300">
          <div className="bg-[#f5f5f5] text-gray-800 px-6 py-2 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
              <h2 className="text-xl font-bold">Intellibotics Limited</h2>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleReset} className="hover:text-gray-600 flex items-center border-none bg-transparent">
                <RefreshCcw size={20} />
              </button>
              <button onClick={toggleChat} className="hover:text-gray-600 border-none bg-transparent">
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg max-w-xs text-justify ${msg.sender === 'user' ? 'bg-[#e1f5fe] text-gray-800' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-center">
                <div className="flex justify-center items-center">
                  <span className="animate-pulse inline-block p-2 rounded-lg bg-gray-200 text-gray-800">
                    Typing...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300">
            <div className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow mr-2 p-2 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#90caf9]"
              />
              <button type="submit" className="bg-[#90caf9] text-gray-800 p-2 rounded-lg hover:bg-[#81d4fa] focus:outline-none focus:ring-2 focus:ring-[#90caf9] border-none">
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-[#90caf9] w-16 h-16 p-2 text-gray-800 border-none rounded-full hover:bg-[#81d4fa] focus:outline-none focus:ring-2 focus:ring-[#90caf9] shadow-lg"
        >
          <img src={icon} alt="icon" className="rounded-full w-12 h-12" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
