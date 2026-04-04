import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Hospital as HospitalIcon, MapPin, Droplets, ArrowRight, Quote, ShieldCheck, Activity, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';


const LandingPage = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/users/testimonials');
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 selection:bg-primary/20 font-['Outfit']">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 firebrick-overlay">
            <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80" 
                className="w-full max-w-md h-auto rounded-2xl shadow-2xl object-cover"
                alt="Medical Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border border-white/20 shadow-2xl"
          >
            <Activity size={14} className="text-red-400 animate-pulse" />
            Live Network Status: Active
          </motion.div>
          
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl md:text-[9rem] font-black mb-8 leading-[0.9] tracking-tighter text-slate-900"
          >
            Connect <br /> <span className="text-red-300">Life to Life.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-3xl font-medium mb-14 text-slate-600 max-w-3xl mx-auto leading-relaxed tracking-tight"
          >
            The global command center for medical emergency coordination and real-time blood tracking.
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <Link to="/auth" className="group bg-primary text-white px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-red-800 transition-all flex items-center gap-3 shadow-[0_20px_50px_rgba(178,34,34,0.4)] ring-4 ring-primary/20 hover:-translate-y-2">
              Join Network <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <a 
              href="https://www.google.com/maps/search/hospitals+and+blood+banks+near+me/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group bg-white/10 backdrop-blur-2xl text-white px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all flex items-center gap-3 hover:-translate-y-2"
            >
              Live Map <MapPin size={20} className="group-hover:animate-bounce" />
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Explore</span>
            <div className="w-px h-20 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-slate-50 rounded-full -mr-96 -mt-96 blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
                <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Core Innovation</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight">System Architecture</h2>
            </div>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-12"
            >
                {[
                    { icon: Droplets, title: "Real-time Node", desc: "Instantly synchronize blood inventory across the global hospital network with sub-second latency.", bg: "bg-red-50/50" },
                    { icon: Heart, title: "Donor Ecosystem", desc: "A decentralized workflow for verified donors to manage eligibility and immediate emergency response.", bg: "bg-slate-50/50" },
                    { icon: ShieldCheck, title: "Secured Trust", desc: "Enterprise-grade encryption protecting critical medical data and identity verification.", bg: "bg-blue-50/50" }
                ].map((f, i) => (
                    <motion.div 
                        key={i} 
                        variants={itemVariants}
                        whileHover={{ y: -15 }}
                        className="group p-12 bg-gradient-to-br from-slate-50 to-white rounded-[3rem] border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)]"
                    >
                        <div className={`${f.bg} w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 text-slate-900 group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-sm`}>
                            <f.icon size={40} />
                        </div>
                        <h3 className="text-3xl font-black mb-6 text-slate-900 tracking-tight group-hover:text-primary transition-colors">{f.title}</h3>
                        <p className="text-slate-500 text-lg leading-relaxed font-medium">{f.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* Modern Testimonials */}
      <section className="py-40 bg-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
            <div className="max-w-xl">
                <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Feedback</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Voices of the Network</h2>
            </div>
            <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                    </div>
                ))}
                <div className="w-14 h-14 rounded-full border-4 border-white bg-primary flex items-center justify-center text-white text-[10px] font-black shadow-lg uppercase">+5k</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {testimonials.map((t, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between transition-all"
              >
                    <Quote className="text-primary/10 mb-8" size={60} />
                    <p className="text-2xl font-bold italic text-slate-800 leading-relaxed mb-10">"{t.text}"</p>
                    <div className="flex items-center gap-5">
                         <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black shadow-xl overflow-hidden border-2 border-white transition-transform group-hover:scale-110">
                           {t.photo ? <img src={t.photo} alt={t.name} className="w-full h-full object-cover" /> : t.name[0]}
                         </div>
                         <div>
                            <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{t.name}</p>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Verified Member</p>
                         </div>
                    </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-32 px-6">
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className="max-w-7xl mx-auto glass rounded-[4rem] p-24 text-center relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-6xl font-black text-slate-900 mb-8 tracking-tight">Ready to join the <span className="text-primary">revolution?</span></h2>
                <p className="text-xl text-slate-500 font-medium mb-12">Start your journey today and become part of a network that saves lives every single second.</p>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link to="/auth" className="bg-primary text-white px-14 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-100">Initialize Identity</Link>
                    <Link to="/about" className="bg-slate-900 text-white px-14 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl">Read Documentation</Link>
                </div>
            </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
