import { useState } from 'react';
import { X, Bolt, LockOpen, Rocket, Smartphone, MessageCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Link } from 'wouter';

interface LandingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LandingModal({ isOpen, onClose }: LandingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 p-0">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-t-2xl text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bolt className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to VenomGPT</h1>
          <p className="text-white/90 text-lg">Uncensored AI • High Performance • Mobile Friendly</p>
        </div>
        
        <div className="p-8">
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <LockOpen className="text-blue-500 text-xl" />
              </div>
              <h3 className="font-semibold text-slate-200 mb-2">Uncensored</h3>
              <p className="text-sm text-slate-400">No restrictions on topics or conversations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Rocket className="text-green-500 text-xl" />
              </div>
              <h3 className="font-semibold text-slate-200 mb-2">High Performance</h3>
              <p className="text-sm text-slate-400">Powered by Cerebras for lightning-fast responses</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Smartphone className="text-purple-500 text-xl" />
              </div>
              <h3 className="font-semibold text-slate-200 mb-2">Mobile Friendly</h3>
              <p className="text-sm text-slate-400">Optimized for all devices and screen sizes</p>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-slate-700/50 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-slate-200 mb-3 flex items-center">
              <Bolt className="text-blue-500 mr-2" />
              Getting Started
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <div>
                  <p className="font-medium">Start chatting immediately</p>
                  <p className="text-slate-400">No registration required for basic usage</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <div>
                  <p className="font-medium">Register to save your conversations</p>
                  <p className="text-slate-400">Access chat history and personalized experience</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <div>
                  <p className="font-medium">Enjoy uncensored AI assistance</p>
                  <p className="text-slate-400">Get help with coding, writing, analysis, and more</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onClose}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chatting
            </Button>
            <Link href="/register" className="flex-1">
              <Button 
                variant="outline"
                className="w-full border-slate-600 hover:border-slate-500 text-slate-300 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register Account
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              By using VenomGPT, you agree to our{' '}
              <Link href="/terms" className="text-blue-500 hover:text-blue-400">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-500 hover:text-blue-400">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
