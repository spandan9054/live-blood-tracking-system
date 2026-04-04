import React, { useState } from 'react';
import { Megaphone, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const EmergencyFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [status, setStatus] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const triggerAlert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Default coordinates for Asansol for demo
    const longitude = 86.9661;
    const latitude = 23.6889;

    try {
      const { data } = await api.post('/users/emergency', { longitude, latitude, bloodGroup, message });
      setStatus({ type: 'success', text: data.message });
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error) {
      setStatus({ type: 'error', text: error.response?.data?.message || 'Error triggering alert' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl p-6 mb-4 w-[320px] md:w-[400px] border border-red-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <Megaphone size={20} /> Emergency Trigger
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={triggerAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Group Required</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {bloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Emergency Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Need units urgently at..."
                  className="w-full p-2 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                />
              </div>

              {status && (
                <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {status.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-red-800 transition-all flex items-center justify-center gap-2 shadow-lg disabled:bg-red-300"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                {loading ? 'Sending Alerts...' : 'Broadcast Emergency'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${isOpen ? 'bg-gray-800 text-white' : 'bg-primary text-white shadow-red-200 animate-pulse-emergency'}`}
      >
        {isOpen ? <X size={32} /> : <Megaphone size={32} />}
      </button>
    </div>
  );
};

export default EmergencyFAB;
