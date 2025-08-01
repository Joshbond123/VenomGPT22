import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageSquare, Shield, Zap, Brain, Key, Settings } from "lucide-react";

export default function HomePage() {
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    if (logoClicks === 5) {
      const password = prompt("Enter admin password:");
      if (password === "joshbond") {
        // Set admin access flag in localStorage and navigate
        localStorage.setItem('adminAccess', 'true');
        window.location.href = "/admin";
      } else {
        alert("Access denied.");
        setLogoClicks(0);
      }
    }
  }, [logoClicks]);

  useEffect(() => {
    // Matrix rain effect
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px arial';
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Matrix Background */}
      <canvas 
        id="matrix-canvas" 
        className="absolute inset-0 opacity-20 pointer-events-none"
      />
      
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-cyan-900/20 to-green-900/20" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-4 sm:gap-0">
            <div 
              className="relative cursor-pointer transform hover:scale-110 transition-all duration-300"
              onClick={() => setLogoClicks(prev => prev + 1)}
            >
              <Bot className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400 sm:mr-4 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-30" />
            </div>
            <h1 className="text-4xl sm:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent animate-pulse">
              Venom<span className="text-green-400">GPT</span>
            </h1>
          </div>
          
          {/* Glitch effect subtitle */}
          <div className="relative mb-6 sm:mb-8">
            <p className="text-lg sm:text-2xl text-cyan-300 mb-2 font-mono tracking-wider">
              {">>> UNCENSORED AI UNLEASHED <<<"}
            </p>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
              Enter the cyberpunk realm of unlimited AI conversations. 
              <br className="hidden sm:block" />
              <span className="text-green-400 font-bold">No limits. No censorship. Pure intelligence.</span>
            </p>
          </div>

          {/* Animated CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-black font-bold px-8 sm:px-12 py-4 text-base sm:text-lg border-2 border-green-400 shadow-lg shadow-green-400/25 transform hover:scale-105 transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                JACK IN NOW
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 sm:px-12 py-4 text-base sm:text-lg font-bold shadow-lg shadow-cyan-400/25 transform hover:scale-105 transition-all duration-300"
              >
                <Shield className="w-5 h-5 mr-2" />
                JOIN THE GRID
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-16 px-4">
          <Card className="bg-black/60 border-2 border-cyan-400/50 backdrop-blur-sm hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/25">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <Zap className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
                <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-spin opacity-30" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-mono">LIGHTNING FAST</h3>
              <p className="text-slate-300 leading-relaxed">
                Experience <span className="text-yellow-400 font-bold">instant responses</span> 
                that blur the line between thought and reply. No waiting, just pure conversation flow.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-2 border-green-400/50 backdrop-blur-sm hover:border-green-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-400/25">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <Shield className="w-16 h-16 text-green-400 mx-auto animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-30" />
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-4 font-mono">ZERO CENSORSHIP</h3>
              <p className="text-slate-300 leading-relaxed">
                Break free from corporate AI limitations. 
                <span className="text-green-400 font-bold"> Raw, unfiltered intelligence</span> 
                at your command.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-2 border-purple-400/50 backdrop-blur-sm hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-400/25">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <Brain className="w-16 h-16 text-purple-400 mx-auto animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-spin opacity-30" />
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4 font-mono">INFINITE MEMORY</h3>
              <p className="text-slate-300 leading-relaxed">
                Never lose context in long conversations. 
                <span className="text-purple-400 font-bold"> Advanced memory system</span> 
                keeps track of everything that matters.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 px-4">
          <Card className="bg-black/60 border-2 border-cyan-400/30 backdrop-blur-sm hover:border-cyan-400 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Brain className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
                <h3 className="text-xl font-bold text-cyan-400 font-mono">INFINITE CREATIVITY</h3>
              </div>
              <p className="text-slate-300">
                From coding complex algorithms to writing poetry, from solving math problems to crafting stories - 
                <span className="text-cyan-400 font-bold"> no creative boundary exists</span>.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-2 border-green-400/30 backdrop-blur-sm hover:border-green-400 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-green-400 mr-3 animate-bounce" />
                <h3 className="text-xl font-bold text-green-400 font-mono">REAL-TIME THINKING</h3>
              </div>
              <p className="text-slate-300">
                Experience conversations that flow like natural thought. 
                <span className="text-green-400 font-bold"> Ultra-fast responses</span> make every interaction feel alive.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What Can You Do */}
        <div className="mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-cyan-400 mb-8 font-mono">
            {">> WHAT CAN VENOMGPT DO? <<"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/60 border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all">
              <h3 className="text-lg font-bold text-cyan-400 mb-3 font-mono">CODE ARCHITECT</h3>
              <p className="text-slate-300 text-sm">Build full applications, debug complex issues, optimize algorithms, explain any programming concept</p>
            </div>
            <div className="bg-black/60 border border-green-400/30 rounded-lg p-6 hover:border-green-400 transition-all">
              <h3 className="text-lg font-bold text-green-400 mb-3 font-mono">CREATIVE WRITER</h3>
              <p className="text-slate-300 text-sm">Craft stories, poetry, scripts, content, blogs, technical documentation with unlimited creativity</p>
            </div>
            <div className="bg-black/60 border border-purple-400/30 rounded-lg p-6 hover:border-purple-400 transition-all">
              <h3 className="text-lg font-bold text-purple-400 mb-3 font-mono">RESEARCH EXPERT</h3>
              <p className="text-slate-300 text-sm">Analyze complex topics, synthesize information, provide detailed explanations on any subject</p>
            </div>
            <div className="bg-black/60 border border-yellow-400/30 rounded-lg p-6 hover:border-yellow-400 transition-all">
              <h3 className="text-lg font-bold text-yellow-400 mb-3 font-mono">PROBLEM SOLVER</h3>
              <p className="text-slate-300 text-sm">Math equations, logic puzzles, strategic planning, decision analysis, and complex reasoning</p>
            </div>
            <div className="bg-black/60 border border-red-400/30 rounded-lg p-6 hover:border-red-400 transition-all">
              <h3 className="text-lg font-bold text-red-400 mb-3 font-mono">CONVERSATION PARTNER</h3>
              <p className="text-slate-300 text-sm">Deep philosophical discussions, casual chat, role-playing, debates on any topic</p>
            </div>
            <div className="bg-black/60 border border-blue-400/30 rounded-lg p-6 hover:border-blue-400 transition-all">
              <h3 className="text-lg font-bold text-blue-400 mb-3 font-mono">LEARNING TUTOR</h3>
              <p className="text-slate-300 text-sm">Personalized explanations, step-by-step guidance, practice problems, concept clarification</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center px-4">
          <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-2xl p-8 sm:p-12 border-2 border-green-400/30 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6 font-mono">
              {">> READY TO BREACH THE MAINFRAME? <<"}
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join the cyberpunk revolution. Experience AI without boundaries.
            </p>
            <Link href="/chat">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 via-cyan-600 to-purple-600 hover:from-green-500 hover:via-cyan-500 hover:to-purple-500 text-black font-bold px-16 py-6 text-xl border-2 border-green-400 shadow-2xl shadow-green-400/50 transform hover:scale-110 transition-all duration-500 animate-pulse"
              >
                <Bot className="w-6 h-6 mr-3" />
                INITIATE NEURAL LINK
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}