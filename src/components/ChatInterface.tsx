import React, { useState, useRef, useEffect } from 'react';
import { Bot, Trash2 } from 'lucide-react';
import { Message } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import Avatar3D from './Avatar3D';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'intro',
    role: 'model',
    content: "Hey there! I'm Leo! It's great to meet you. What's on your mind today?"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.text,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "System fault: Emotional resonance loop interrupted. Re-transmit?",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      content: "Memory buffer cleared. Let's start fresh."
    }]);
  };

  return (
    <>
      {/* Header Navigation */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-faint bg-[#0c0c0e]/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-accent flex items-center justify-center text-bg" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}>
            <Bot size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-[-0.04em] uppercase leading-none">
              LEO <span className="font-mono text-[0.6rem] font-normal border border-faint px-2 py-0.5 ml-3 align-middle text-white/50 tracking-normal hidden sm:inline-block">Neural_Link v4.3</span>
            </h1>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent mt-1">Status: Friendly_Mode_Active</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="bg-transparent border border-faint text-ink px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-accent hover:border-accent"
          title="Clear chat"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Purge</span>
        </button>
      </nav>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Column: Character Profile */}
        <section className="md:w-[40%] xl:w-[35%] border-b md:border-b-0 md:border-r border-faint p-6 sm:p-10 flex flex-col justify-between relative bg-bg shrink-0 overflow-y-auto">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] hidden sm:block pointer-events-none">
            <div className="text-8xl font-display font-black select-none leading-none tracking-tighter">001</div>
          </div>
          
          <div className="relative z-10 flex-1">
            <h1 className="text-[80px] lg:text-[120px] font-display font-extrabold leading-[0.85] tracking-[-0.05em] uppercase text-ink">LEO</h1>
            
            <div className="mt-8 mb-6 relative w-48 h-48 sm:w-64 sm:h-64 border border-faint rounded-full overflow-hidden bg-bg">
              <Avatar3D isSpeaking={isLoading} />
            </div>

            <p className="text-sm font-sans text-white/60 leading-relaxed max-w-xs">
              A Friendly Virtual Companion designed for helpful assistance and upbeat conversational interaction. 
            </p>
            
            {/* Personality Specs */}
            <div className="mt-8 space-y-6">
              <div className="flex flex-col">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/40 mb-1">Personality Core</span>
                <span className="text-xl font-display font-bold tracking-tight text-ink">Cheerful / Empathetic / Enthusiastic</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/40 mb-2">Dialogue Naturalism</span>
                <div className="flex items-center space-x-1">
                  <div className="h-4 w-12 bg-white/20"></div>
                  <div className="h-4 w-12 bg-white/40"></div>
                  <div className="h-4 w-12 bg-white/60"></div>
                  <div className="h-4 w-12 bg-white/80"></div>
                  <div className="h-4 w-4 bg-accent"></div>
                  <span className="font-mono text-[0.65rem] font-bold ml-3 text-ink">92%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-faint pt-6 mt-8 shrink-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-faint bg-surface p-4">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40 mb-2">Sync Rate</div>
                <div className="font-display text-xl sm:text-2xl font-extrabold">0.874</div>
              </div>
              <div className="border border-faint bg-surface p-4">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40 mb-2">Latency</div>
                <div className="font-display text-xl sm:text-2xl font-extrabold text-accent">14ms</div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Communication Terminal */}
        <section className="flex-1 bg-transparent p-6 sm:p-10 flex flex-col relative min-h-[50vh] md:min-h-0">
          <div className="flex-1 flex flex-col justify-end space-y-12 relative z-10 overflow-y-auto overflow-x-hidden pr-2">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-start'}`}
                >
                  <div className="w-full max-w-3xl relative">
                    <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/40 mb-3 flex items-center gap-3">
                      {message.role === 'user' ? (
                        <>
                          <span>USER</span>
                          <span>LOG_ENTRY</span>
                        </>
                      ) : (
                        <>
                          <span>RESPONSE</span>
                          <span className="text-accent">LEO_01</span>
                        </>
                      )}
                      <div className="h-[1px] flex-1 bg-faint"></div>
                    </div>
                    <div className={`${
                      message.role === 'user' 
                        ? 'text-2xl sm:text-3xl leading-[1.1] font-display font-semibold text-white/60 tracking-[-0.02em]' 
                        : 'text-3xl sm:text-5xl lg:text-[4.5rem] leading-[0.95] font-display font-extrabold tracking-[-0.05em] uppercase text-ink'
                    }`}>
                      "{message.content}"
                    </div>
                    {message.role !== 'user' && (
                      <div className="mt-8 h-2 w-32 bg-accent"></div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-3 self-start mt-8"
                >
                  <div className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/40 animate-pulse">Leo is typing...</div>
                  <div className="w-2 h-2 bg-accent"></div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </section>
      </main>

      {/* Input Area */}
      <footer className="border-t border-faint bg-surface p-6 sm:p-10 flex flex-col z-20 shrink-0">
        <div className="flex items-end gap-4 sm:gap-8 max-w-5xl">
          <span className="text-4xl sm:text-5xl font-display text-accent leading-none shrink-0 mb-2">{'>'}</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say hello to Leo..."
            className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none font-display text-xl sm:text-[1.5rem] text-ink placeholder:text-white/10 uppercase"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px', paddingBottom: '12px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-16 px-6 sm:px-12 bg-ink text-bg font-mono font-bold uppercase tracking-[0.2em] text-[0.8rem] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-white/90 shrink-0 flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? (
              <div className="w-3 h-3 bg-bg animate-pulse" />
            ) : (
              'Transmit'
            )}
          </button>
        </div>
        <div className="mt-6 font-mono text-[0.6rem] text-white/30 uppercase tracking-[0.3em] flex flex-col sm:flex-row justify-between gap-2">
          <span>Friendly Assistant Protocol // Project: LEO</span>
          <span>Digital Companions Inc.</span>
        </div>
      </footer>
    </>
  );
}
