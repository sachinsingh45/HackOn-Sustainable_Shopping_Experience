import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, Camera, Leaf, Sparkles, Trash2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  intent?: string;
  breakdown?: any[];
  total?: number;
  reply?: string;
  challenges?: any[];
  badges?: any[];
}

const GreenPartnerChat = () => {
  const { chatOpen, toggleChat, user, cart, chatWithAI, chatPrefillMessage, setChatPrefillMessage } = useStore();
  const navigate = useNavigate();
  const defaultBotMessage: Message = {
    id: '1',
    type: 'bot',
    content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 🌱 I'm your Green Partner. I help you make sustainable choices and reduce your carbon footprint. How can I assist you today?`,
    timestamp: new Date(),
    suggestions: [
      'Show eco alternatives for my cart',
      "What's my carbon footprint this month?",
      'Green challenges for me',
      'Analyze this product'
    ]
  };
  const [messages, setMessages] = useState<Message[]>([
    defaultBotMessage
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Show onboarding only for first-time users (localStorage flag)
    return localStorage.getItem('greenPartnerOnboarded') !== 'true';
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showOnboarding) {
      const timer = setTimeout(() => setShowOnboarding(false), 6000);
      localStorage.setItem('greenPartnerOnboarded', 'true');
      return () => clearTimeout(timer);
    }
  }, [showOnboarding]);

  useEffect(() => {
    if (chatOpen && chatPrefillMessage) {
      setInputMessage(chatPrefillMessage);
      setChatPrefillMessage('');
    }
    // Only run when chatOpen or chatPrefillMessage changes
  }, [chatOpen, chatPrefillMessage, setChatPrefillMessage]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await chatWithAI(content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse.message,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        intent: aiResponse.intent,
        breakdown: aiResponse.breakdown,
        total: aiResponse.total,
        reply: aiResponse.reply,
        challenges: aiResponse.challenges,
        badges: aiResponse.badges
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleClearChat = () => {
    setMessages([{
      ...defaultBotMessage,
      timestamp: new Date(),
      id: Date.now().toString()
    }]);
    setInputMessage('');
  };

  // Helper to render bot message with rich UI for special intents
  function renderBotMessage(message: any) {
    if (message.intent === 'carbon_footprint' && (message.breakdown || message.total !== undefined)) {
      // Modern, minimal UI for carbon footprint breakdown
      return (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-r from-green-200 to-blue-100 rounded-2xl p-6 shadow-md mb-2">
            <div className="text-lg font-semibold text-green-700 mb-1">Monthly CO₂ Saved</div>
            <div className="text-5xl font-extrabold text-green-800 mb-1">{message.total?.toFixed(2)} <span className="text-2xl font-bold text-green-500">kg</span></div>
          </div>
          {/* Breakdown Table */}
          {Array.isArray(message.breakdown) && message.breakdown.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border rounded-lg bg-white shadow">
                <thead>
                  <tr className="bg-green-50">
                    <th className="px-4 py-2 text-left font-semibold text-green-700">Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-green-700">Products</th>
                    <th className="px-4 py-2 text-right font-semibold text-green-700">CO₂ (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {message.breakdown.map((order: any, idx: number) => {
                    // Aggregate items by name for this order
                    const productSet = new Set<string>();
                    (order.items || []).forEach((item: any) => {
                      if (item.name) productSet.add(item.name);
                    });
                    const productNames = Array.from(productSet);
                    return (
                      <tr key={idx} className="border-t hover:bg-green-50 transition">
                        <td className="px-4 py-2 whitespace-nowrap font-medium text-green-800">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          {productNames.length > 0 ? (
                            <ul className="list-disc pl-4 space-y-1">
                              {productNames.map((name, i) => (
                                <li key={i} className="font-medium text-gray-700">{name}</li>
                              ))}
                            </ul>
                          ) : <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-green-700">{order.orderTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <button
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow"
            onClick={() => {
              toggleChat();
              setTimeout(() => navigate('/profile'), 100);
            }}
          >
            View Full Eco Profile
          </button>
        </div>
      );
    }
    if (message.intent === 'my_challenges' && Array.isArray(message.challenges)) {
      return (
        <div className="space-y-2">
          <div className="font-semibold text-green-700">{message.reply}</div>
          <div className="grid grid-cols-1 gap-3">
            {message.challenges.map((ch: any) => (
              <div key={ch.id} className={`rounded-xl border shadow-sm p-3 flex flex-col gap-2 bg-gradient-to-r from-green-50 to-green-100 ${ch.status === 'completed' ? 'opacity-70' : ''}`}>
                <div className="flex items-center space-x-4">
                  <img src={ch.rewardBadge?.iconUrl || '/daily-badge.png'} alt="badge" className="w-10 h-10 rounded-full border" />
                  <div className="flex-1">
                    <div className="font-semibold text-green-800 flex items-center gap-2">{ch.name} <span className="text-xs px-2 py-0.5 rounded bg-green-200 text-green-800 ml-2">{ch.frequency}</span></div>
                    <div className="text-xs text-gray-700 mb-1">{ch.description}</div>
                    <div className="text-xs text-gray-500">{ch.status === 'completed' ? 'Completed' : 'Active'}</div>
                  </div>
                </div>
                {/* Progress Bar and Text */}
                <div className="mt-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-green-700 font-medium">{ch.progressText}</span>
                    <span className="text-gray-500">{Math.min(100, Math.round((ch.progress / (ch.target || 1)) * 100))}%</span>
                  </div>
                  <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${ch.status === 'completed' ? 'bg-blue-400' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, Math.round((ch.progress / (ch.target || 1)) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Modern Badges Row */}
          {Array.isArray(message.badges) && message.badges.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold text-green-700 mb-2">Your Badges</div>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {message.badges.map((badge: any, idx: number) => {
                  let icon = '/daily-badge.png';
                  if (badge.name?.toLowerCase().includes('weekly')) icon = '/weekly-badge.png';
                  else if (badge.name?.toLowerCase().includes('monthly')) icon = '/monthly-badge.png';
                  return (
                    <div key={idx} className="flex flex-col items-center min-w-[72px]">
                      <img
                        src={icon}
                        alt={badge.name}
                        className="w-12 h-12 rounded-full border-2 border-green-400 shadow-md bg-white"
                      />
                      <div className="text-xs font-medium text-green-800 mt-1 text-center truncate max-w-[64px]">{badge.name}</div>
                      {badge.dateEarned && (
                        <div className="text-[10px] text-gray-500">{new Date(badge.dateEarned).toLocaleDateString()}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <button
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            onClick={() => {
              toggleChat();
              setTimeout(() => navigate('/challenges'), 100);
            }}
          >
            Go to Eco Challenges
          </button>
        </div>
      );
    }
    // Friendly styled bubble for general chat
    return (
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-200 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-green-700" />
        </div>
        <div className="bg-green-50 text-green-900 px-3 py-2 rounded-lg shadow max-w-xs">
          {message.reply || message.content}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={toggleChat}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center relative transition-colors
            ${chatOpen ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'}
            ${!chatOpen ? 'animate-glow' : ''}
            sm:w-16 sm:h-16 w-12 h-12
            ${chatOpen ? 'cursor-not-allowed opacity-60' : ''}
          `}
          whileHover={!chatOpen ? { scale: 1.12 } : {}}
          whileTap={!chatOpen ? { scale: 0.95 } : {}}
          aria-label="Open Green Partner Chat"
          style={{ zIndex: 60 }}
          disabled={chatOpen}
        >
          {chatOpen ? (
            <X className="sm:w-7 sm:h-7 w-6 h-6 text-white" />
          ) : (
            <div className="relative flex flex-col items-center">
              <Sparkles className="sm:w-7 sm:h-7 w-6 h-6 text-white animate-spin-slow" />
              <Leaf className="sm:w-4 sm:h-4 w-3 h-3 text-green-200 absolute -bottom-2 left-1/2 -translate-x-1/2 animate-bounce" />
              <span className="sr-only">Open Green Partner Chat</span>
            </div>
          )}
        </motion.button>
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !chatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed sm:bottom-24 sm:right-8 sm:w-64 bottom-24 right-2 w-[90vw] max-w-xs bg-white text-gray-800 px-4 py-2 rounded shadow-lg text-xs border border-green-200 z-50"
              style={{ maxWidth: '90vw' }}
            >
              <b>Green Partner AI</b><br />
              Ask about eco-friendly shopping, carbon footprint, green challenges, and more!
            </motion.div>
          )}
        </AnimatePresence>
        {/* Onboarding Popover */}
        <AnimatePresence>
          {showOnboarding && !chatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed sm:bottom-40 sm:right-8 sm:w-72 bottom-36 right-2 w-[95vw] max-w-sm bg-green-50 border border-green-300 px-5 py-3 rounded-lg shadow-xl z-50"
              style={{ maxWidth: '98vw' }}
            >
              <div className="flex items-center mb-2">
                <Sparkles className="w-5 h-5 text-green-400 mr-2 animate-pulse" />
                <span className="font-semibold text-green-800">Meet your Green Partner!</span>
              </div>
              <ul className="list-disc pl-5 text-xs text-green-900">
                <li>Get eco-friendly product suggestions</li>
                <li>Calculate your carbon footprint</li>
                <li>Discover green challenges</li>
                <li>Ask anything about sustainability</li>
              </ul>
              <button
                className="mt-3 text-xs text-green-700 underline hover:text-green-900"
                onClick={() => setShowOnboarding(false)}
              >Got it!</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 12 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-2 right-4 sm:bottom-6 sm:right-4 z-50 w-auto max-w-full sm:max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-green-100 flex flex-col h-[70vh] sm:h-[480px]">
              {/* Header */}
              <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b bg-gradient-to-r from-green-100 to-blue-100 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-green-800 text-lg">Green Partner</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="p-2 rounded-full hover:bg-green-200 transition relative group"
                    title="Clear Chat"
                    onClick={handleClearChat}
                  >
                    <RotateCcw className="w-4 h-4 text-green-700" />
                    <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 bg-green-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition">Clear Chat</span>
                  </button>
                  <button
                    className="ml-1 p-2 rounded-full hover:bg-green-200 transition"
                    onClick={() => toggleChat()}
                    title="Close"
                  >
                    <X className="w-5 h-5 text-green-700" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div
                      className={`flex ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.type === 'bot' ? renderBotMessage(message) : message.content}
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.type === 'bot' && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-3">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Mic className="w-4 h-4 text-gray-600" />
                  </button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                    placeholder="Ask about eco-friendly options..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500 text-sm"
                  />
                  <button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-full"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop overlay for closing chat by clicking outside */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={() => toggleChat()}
        />
      )}
    </>
  );
};

export default GreenPartnerChat;

/* Add this to the bottom of the file, outside the component */
// Glowing animation for the button
const style = document.createElement('style');
style.innerHTML = `
@keyframes glow {
  0% { box-shadow: 0 0 0px 0 #34d399; }
  50% { box-shadow: 0 0 24px 8px #34d39988; }
  100% { box-shadow: 0 0 0px 0 #34d399; }
}
.animate-glow {
  animation: glow 2s infinite;
}
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
`;
document.head.appendChild(style);