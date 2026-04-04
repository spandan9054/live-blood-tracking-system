import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Hospital as HospitalIcon, Droplet, ArrowRight, ShieldCheck, Activity, Info } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchHospitals = async () => {
      try {
        const { data } = await api.get('/hospitals');
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canDonate = () => {
    if (!user || user.role !== 'user') return false;
    if (!user.lastDonationDate) return true;
    const diffTime = Math.abs(new Date() - new Date(user.lastDonationDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 100;
  };

  const handleDonate = async (hospitalId) => {
    try {
      await api.post('/donations', { hospitalId });
      alert("Donation request sent! The hospital will notify you soon.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send request");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50/30 px-6 font-['Outfit']">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-20 gap-12">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Global Inventory</span>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-4">Blood Live <span className="text-red-300">Network.</span></h1>
            <p className="text-slate-500 text-xl font-medium max-w-xl">Synchronized real-time check of critical blood units across all primary medical nodes.</p>
          </motion.div>
          
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative w-full lg:w-[32rem] group"
          >
            <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Search className="absolute left-6 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Filter by hospital or coordinates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-6 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] focus:shadow-[0_20px_50px_rgba(178,34,34,0.1)] focus:ring-[15px] focus:ring-primary/5 focus:border-primary/20 outline-none transition-all font-bold text-slate-700"
            />
            <div className="absolute right-4 top-4 bg-slate-50 p-2.5 rounded-xl text-slate-400 font-black text-[10px] uppercase tracking-widest px-4 border border-slate-100 shadow-inner">Ctrl + F</div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8">
            <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
                className="text-primary bg-primary/5 p-8 rounded-[3rem] border border-primary/10 shadow-2xl shadow-red-100"
            >
              <HospitalIcon size={64} />
            </motion.div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Initializing Data Stream...</p>
          </div>
        ) : (
          <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            <AnimatePresence>
                {filteredHospitals.map((hospital, idx) => (
                  <motion.div 
                    key={hospital._id}
                    variants={item}
                    layout
                    whileHover={{ y: -15, scale: 1.02 }}
                    className="bg-white rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.04)] hover:shadow-[0_50px_100px_rgba(178,34,34,0.1)] transition-all border border-slate-100 overflow-hidden flex flex-col group relative"
                  >
                    {/* Header: Visuals & Badges */}
                    <div className="p-10 bg-gradient-to-br from-slate-50/50 to-white border-b border-slate-50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000 ease-out"></div>
                      
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_15px_30px_rgba(0,0,0,0.05)] border border-slate-50 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <HospitalIcon size={32} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex flex-col items-end">
                           <div className="flex items-center gap-2 mb-3 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                               <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                               <span className="text-[9px] font-black text-primary uppercase tracking-widest">Global Live</span>
                           </div>
                           <div className="flex -space-x-3">
                              {Object.entries(hospital.inventory).filter(([_, v]) => v > 0).slice(0, 4).map(([bg]) => (
                                <motion.div 
                                    whileHover={{ y: -5, zIndex: 10 }}
                                    key={bg} 
                                    className="w-11 h-11 rounded-2xl bg-white border-4 border-slate-50 flex items-center justify-center text-[11px] font-black text-primary shadow-xl cursor-default"
                                >
                                    {bg}
                                </motion.div>
                              ))}
                              {Object.values(hospital.inventory).filter(v => v > 0).length > 4 && (
                                 <div className="w-11 h-11 rounded-2xl bg-slate-900 border-4 border-white flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                                    +{Object.values(hospital.inventory).filter(v => v > 0).length - 4}
                                 </div>
                              )}
                           </div>
                        </div>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors leading-[1.1] mb-3">{hospital.name}</h3>
                      <p className="text-slate-400 flex items-center gap-2 text-[13px] font-bold tracking-tight"><MapPin size={16} className="text-primary/30" /> {hospital.address}</p>
                    </div>

                    {/* Content: Inventory Grid */}
                    <div className="p-10 flex-grow bg-white">
                      <div className="grid grid-cols-4 gap-4">
                        {Object.entries(hospital.inventory).map(([group, units]) => (
                          <motion.div 
                            key={group} 
                            whileHover={units > 0 ? { y: -5, scale: 1.05 } : {}}
                            className={`p-4 rounded-[1.5rem] text-center border transition-all duration-500 relative cursor-default ${units === 0 ? 'bg-slate-50 border-slate-100 opacity-20 filter grayscale' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-red-50 hover:border-primary/20'}`}
                          >
                            <p className={`text-[9px] font-black mb-1.5 tracking-widest ${units === 0 ? 'text-slate-400' : 'text-primary'}`}>{group}</p>
                            <p className={`text-xl font-black ${units === 0 ? 'text-slate-300' : 'text-slate-900'}`}>{units}</p>
                            {units > 0 && units < 5 && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse-emergency"></div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Footer: Action Component */}
                    <div className="p-10 pt-0 group/action">
                        <motion.button 
                          whileHover={canDonate() ? { y: -5, shadow: "0 20px 40px rgba(178, 34, 34, 0.2)" } : {}}
                          whileTap={canDonate() ? { scale: 0.98 } : {}}
                          onClick={() => handleDonate(hospital._id)}
                          disabled={!canDonate()}
                          className={`w-full py-6 rounded-[2rem] font-black text-[13px] uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all relative overflow-hidden ${canDonate() ? 'bg-primary text-white shadow-2xl shadow-red-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                        >
                          {canDonate() ? (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/action:translate-x-full transition-transform duration-1000"></div>
                                <Droplet size={20} className="fill-white" /> Request Node Access <ArrowRight size={20} />
                            </>
                          ) : (
                            <><ShieldCheck size={20} /> Eligibility Locked</>
                          )}
                        </motion.button>
                        {!canDonate() && (
                            <p className="text-center mt-6 text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
                                <Info size={12} /> 100-Day Protocol Active
                            </p>
                        )}
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredHospitals.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40"
            >
                <div className="bg-slate-50 w-32 h-32 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 border border-slate-100 text-slate-200 shadow-inner">
                    <Search size={48} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">No Active Nodes Found.</h2>
                <p className="text-slate-500 text-xl font-medium max-w-sm mx-auto leading-relaxed">We couldn't find any hospitals matching your search parameters in the current vector space.</p>
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-12 text-primary font-black text-[11px] uppercase tracking-[0.3em] hover:text-red-800 transition-all border-b-4 border-primary/10 hover:border-primary pb-2"
                >
                    Reset Grid Search
                </button>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default HospitalList;
