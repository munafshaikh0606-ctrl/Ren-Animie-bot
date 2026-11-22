/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ChatInterface from './components/ChatInterface';

export default function App() {
  return (
    <div className="bg-bg text-ink w-full max-w-[1600px] mx-auto h-screen flex flex-col font-sans overflow-hidden border-x border-faint relative">
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <ChatInterface />
    </div>
  );
}
