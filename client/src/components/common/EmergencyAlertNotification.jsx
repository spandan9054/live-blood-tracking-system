import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Activity, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmergencyAlertNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Auto-trigger for demo purposes (Team Error-404 scenario)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed top-10 left-1/2 -translate-x-1/2 z-[999] pointer-events-auto"
        >
          {/* Antigravity Floating Box */}
          <div className="antigravity-emergency relative bg-white/95 backdrop-blur-xl border border-red-200 rounded-[2rem] p-6 shadow-2xl flex items-start gap-6 max-w-xl w-full mx-4 overflow-hidden">
            
            {/* Background Medical/Reddish Shaded Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-white/50 z-0"></div>
            {/* Doctor Watermark (Generic Medical Icon Matrix) */}
            <div className="absolute -bottom-10 -right-10 opacity-5 z-0 pointer-events-none">
              <Activity size={200} />
            </div>

            {/* Radar Pulse Container inside the component logic */}
            <div className="relative z-10 flex-shrink-0 mt-2">
              <div className="radar-ripple-container w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-500 shadow-lg shadow-red-200">
                <AlertTriangle className="text-red-700 animate-pulse" size={32} />
              </div>
            </div>

            <div className="relative z-10 flex-grow pt-1">
              <div className="flex justify-between items-start mb-2">
                <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  Critical Alert - Team Error-404
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 p-2 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                Urgent <span className="text-red-600">O-Negative</span> Unit Required
              </h2>
              
              <div className="space-y-3 mb-5 text-sm">
                <p className="text-slate-600 font-medium leading-relaxed">
                  A high-priority surgical node has initiated an emergency protocol. You are currently within the eligible 30km geo-fence tracking radius.
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <MapPin size={16} className="text-red-500" />
                    <span>Location Lock: <span className="text-slate-800">Asansol Super Speciality Hospital</span> (14km away)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                     <span className="text-slate-500 font-bold text-xs">Donor Window Status:</span>
                     <span className="text-green-600 font-black text-xs bg-green-100 px-2 py-1 rounded-lg">Eligible (100 Days Mapped)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  onClick={() => setIsVisible(false)}
                  className="flex-1 bg-red-600 hover:bg-red-800 text-white py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-200"
                >
                  Accept Dispatch
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyAlertNotification;
