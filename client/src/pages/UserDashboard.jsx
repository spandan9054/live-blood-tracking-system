import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User as UserIcon, Calendar, Droplets, MapPin, ShieldCheck, Heart, History, Clock, Activity, ArrowUpRight, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
    const { user: authUser, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 0. Neural Link Guard (Safety Render Upgrade)
    useEffect(() => {
        const checkLocalSync = () => {
            const savedUser = JSON.parse(localStorage.getItem('user'));
            if (savedUser) {
                setProfile(normalizeProfile(savedUser));
                setLoading(false);
            } else if (!authLoading && !authUser) {
                // Redirect if no user found either in context or local storage
                navigate('/auth');
            }
        };
        checkLocalSync();
    }, [authUser, authLoading, navigate]);

    function normalizeProfile(data) {
        if (!data) return {};
        // Map common fields from both camelCase and snake_case to support FastAPI
        return {
            ...data,
            lastDonationDate: data.lastDonationDate || data.last_donation_date || null,
            bloodGroup: data.bloodGroup || data.blood_group || 'N/A',
            name: data.name || 'Unknown Node',
            age: data.age || 0,
            dob: data.dob || data.date_of_birth || null,
            address: data.address || 'Unspecified Sector'
        };
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, donationsRes] = await Promise.all([
                    api.get('/users/profile'),
                    api.get('/donations/my-donations')
                ]);
                console.log("Dashboard User Data (Raw):", profileRes.data);
                setProfile(normalizeProfile(profileRes.data));
                setDonations(donationsRes.data || []);
            } catch (err) {
                console.error("Critical Dashboard Synchronization Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculateCooldown = (lastDate) => {
        try {
            if (!lastDate) return { canDonate: true, daysLeft: 0, progress: 100 };
            const last = new Date(lastDate);
            if (isNaN(last.getTime())) return { canDonate: true, daysLeft: 0, progress: 100 };
            
            const diffTime = Math.abs(new Date() - last);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const cooldown = 100;
            return {
                canDonate: diffDays >= cooldown,
                daysLeft: Math.max(0, cooldown - diffDays),
                progress: Math.min(100, (diffDays / cooldown) * 100)
            };
        } catch (err) {
            console.error("Cooldown Engine Failure:", err);
            return { canDonate: true, daysLeft: 0, progress: 100 };
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-900 text-white flex-col gap-8 font-['Outfit']">
             <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full"
             />
             <div className="flex flex-col items-center gap-2">
                <p className="text-3xl font-black tracking-tighter animate-pulse">Syncing with Central Command...</p>
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40">Initializing Neural Link</p>
             </div>
        </div>
    );

    if (!profile || Object.keys(profile).length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/50 gap-6 font-['Outfit']">
            <div className="p-8 bg-white rounded-[3rem] shadow-xl border border-red-50">
                <Info size={40} className="text-primary" />
            </div>
            <p className="font-black text-[10px] uppercase tracking-[0.5em] text-slate-400">Node Sync Failed. Registry Empty.</p>
            <button onClick={() => window.location.reload()} className="mt-4 bg-primary text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-red-100 hover:bg-red-800 transition-all">Reconnect to Network</button>
        </div>
    );

    const displayDate = profile?.lastDonationDate || "Never";
    const cooldown = calculateCooldown(profile?.lastDonationDate);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-slate-50/50 px-6 font-['Outfit']">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 xl:grid-cols-12 gap-12"
                >
                    
                    {/* Left Panel: High-Aesthetic Profile info */}
                    <motion.div variants={itemVariants} className="xl:col-span-4 space-y-12">
                        <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-full h-40 bg-slate-900 overflow-hidden">
                                <div className="absolute inset-0 bg-primary/20 backdrop-blur-3xl animate-pulse"></div>
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            </div>
                            
                            <div className="relative pt-20 px-10 pb-12 flex flex-col items-center">
                                <div className="w-44 h-44 rounded-[3rem] bg-white p-3 shadow-2xl mb-8 relative">
                                     <div className="w-full h-full rounded-[2rem] bg-slate-50 flex items-center justify-center text-primary text-6xl font-black overflow-hidden border border-slate-100">
                                          {profile?.photo ? <img src={profile.photo} className="w-full h-full object-cover" /> : (profile?.name?.[0] || 'U')}
                                     </div>
                                     <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-3 rounded-2xl shadow-xl ring-8 ring-white">
                                         <ShieldCheck size={24} />
                                     </div>
                                 </div>
                                 
                                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter text-center">{profile?.name}</h2>
                                 <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mt-3 bg-red-50 px-4 py-1.5 rounded-full border border-red-100 flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                                     Synchronized Identity
                                 </p>
                                 
                                 <div className="grid grid-cols-2 gap-6 w-full mt-12">
                                     <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl group/card">
                                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2 group-hover/card:text-primary transition-colors">Group</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{profile?.bloodGroup}</p>
                                     </div>
                                     <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl group/card">
                                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2 group-hover/card:text-primary transition-colors">Age</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{profile?.age}</p>
                                     </div>
                                 </div>

                                 <div className="w-full mt-10 space-y-6 pt-10 border-t border-slate-50">
                                     <div className="flex items-center gap-5 text-slate-400 font-bold tracking-tight text-sm group/row hover:text-slate-900 transition-colors">
                                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover/row:bg-primary/10 group-hover/row:text-primary transition-all"><Calendar size={18} /></div>
                                         <div className="flex flex-col">
                                             <span className="text-[9px] uppercase font-black tracking-widest text-slate-300 mb-0.5">Birth Registry</span>
                                             {profile?.dob ? new Date(profile.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending Sync'}
                                         </div>
                                     </div>
                                     <div className="flex items-center gap-5 text-slate-400 font-bold tracking-tight text-sm group/row hover:text-slate-900 transition-colors">
                                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover/row:bg-primary/10 group-hover/row:text-primary transition-all"><MapPin size={18} /></div>
                                         <div className="flex flex-col">
                                             <span className="text-[9px] uppercase font-black tracking-widest text-slate-300 mb-0.5">Physical Node</span>
                                             {profile?.address}
                                         </div>
                                     </div>
                                 </div>
                            </div>
                        </div>

                        {/* Additional Quick Stats */}
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                             <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                             <div className="relative z-10">
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6 flex items-center gap-2"><Activity size={12} className="text-primary" /> Live Metrics</h4>
                                  <div className="flex items-end justify-between">
                                     <div>
                                         <p className="text-5xl font-black tracking-tighter">{(donations || []).filter(d => d.status === 'Accepted').length}</p>
                                         <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Total Life Units Saved</p>
                                     </div>
                                     <ArrowUpRight size={32} className="text-primary" />
                                 </div>
                             </div>
                        </div>
                    </motion.div>

                    {/* Right Panel: Functional Eligibility & History */}
                    <div className="xl:col-span-8 space-y-12">
                        
                        {/* Protocol Eligibility Hub */}
                        <motion.div variants={itemVariants} className="bg-white rounded-[4rem] shadow-[0_30px_80px_rgba(0,0,0,0.03)] p-12 border border-slate-50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110"></div>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 relative z-10 gap-6">
                                 <div>
                                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                                         <div className="p-3 bg-red-50 rounded-2xl text-primary shadow-sm"><Heart size={24} className="fill-primary" /></div>
                                         Eligibility Synapse
                                     </h3>
                                     <p className="text-slate-400 font-medium mt-3 flex items-center gap-2"><Info size={14} /> Medical recovery protocol monitoring.</p>
                                 </div>
                                 <div className="flex items-center gap-4">
                                     {cooldown.canDonate ? (
                                         <motion.div animate={{ shadow: ["0 0 0px rgba(34,197,94,0)", "0 0 20px rgba(34,197,94,0.4)", "0 0 0px rgba(34,197,94,0)"] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-green-500 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-100 flex items-center gap-3">
                                             <div className="w-2 h-2 bg-white rounded-full animate-ping"></div> Fully Operational
                                         </motion.div>
                                     ) : (
                                         <div className="bg-slate-900 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-3">
                                             <div className="w-2 h-2 bg-primary rounded-full"></div> Phase Recovery
                                         </div>
                                     )}
                                 </div>
                            </div>

                            <div className="grid md:grid-cols-12 gap-10 relative z-10 items-center">
                                <div className="md:col-span-8 space-y-10">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-8xl font-black text-slate-900 tracking-tighter leading-none">{cooldown.daysLeft}</p>
                                                <span className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Days</span>
                                            </div>
                                            <p className="text-slate-400 font-black mt-4 uppercase tracking-[0.2em] text-[10px]">Countdown to Resynchronization</p>
                                        </div>
                                    </div>
                                    
                                    <div className="relative pt-6">
                                        <div className="w-full h-8 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex p-1 shadow-inner relative">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${cooldown.progress}%` }}
                                                transition={{ duration: 2, ease: "circOut" }}
                                                className={`h-full rounded-xl shadow-xl relative overflow-hidden ${cooldown.canDonate ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-primary'}`}
                                            >
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10"></div>
                                                <div className="absolute inset-y-0 right-0 w-20 bg-white/20 blur-xl animate-shimmer"></div>
                                            </motion.div>
                                        </div>
                                        {/* Ticks/Markers */}
                                        <div className="flex justify-between px-1 mt-3">
                                            {([0, 25, 50, 75, 100] || []).map(v => (
                                                <div key={v} className="flex flex-col items-center">
                                                    <div className="w-px h-2 bg-slate-200 mb-1"></div>
                                                    <span className="text-[9px] font-black text-slate-300">{v}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-4 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                                     <TrendingUp size={32} className="text-primary/20 mb-6" />
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Synapse Window</p>
                                     <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                         {profile?.lastDonationDate 
                                             ? new Date(new Date(profile.lastDonationDate).getTime() + 100 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                                             : 'Immediate Access'}
                                     </p>
                                     <button className="mt-8 text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                                         Learn Logistics <ArrowUpRight size={14} />
                                     </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Synapse History / Event Log */}
                        <motion.div variants={itemVariants} className="bg-white rounded-[4rem] shadow-[0_30px_80px_rgba(0,0,0,0.03)] p-12 border border-slate-50 relative group">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                                    <div className="p-3 bg-red-50 rounded-2xl text-primary shadow-sm"><History size={24} /></div>
                                    Persistence Log
                                </h3>
                                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors border-b-2 border-slate-100 hover:border-primary pb-1">Export Archive</button>
                            </div>

                            <div className="space-y-6">
                                <AnimatePresence mode='popLayout'>
                                    {(donations || []).length > 0 ? (
                                        (donations || []).map((d, idx) => (
                                            <motion.div 
                                                key={d?._id || d?.id || idx} 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="group p-8 rounded-[2.5rem] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all flex flex-col md:flex-row md:items-center justify-between hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] gap-6"
                                            >
                                                <div className="flex items-center gap-8">
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500 overflow-hidden relative">
                                                        <Droplets size={32} />
                                                        <div className="absolute inset-0 bg-primary/20 animate-pulse hidden group-hover:block"></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-2xl tracking-tighter leading-tight group-hover:text-primary transition-colors">{d?.hospital?.name || 'Unknown Node'}</p>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                                                                <Clock size={14} className="text-primary/40" /> 
                                                                {d?.createdAt || d?.created_at ? new Date(d.createdAt || d.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Archive Date Unknown'}
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Vector Hash: {(d?._id || d?.id || '000000').slice(-6)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm border ${d?.status === 'Accepted' || d?.status === 'accepted' ? 'bg-green-500 text-white border-green-400' : 'bg-slate-900 text-white border-slate-800'}`}>
                                                    {d?.status === 'Accepted' || d?.status === 'accepted' ? 'Synchronized' : 'In Transit'}
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 border border-slate-100 text-slate-200 shadow-xl">
                                                <Droplets size={44} />
                                             </div>
                                             <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Null Archive</h4>
                                             <p className="text-slate-400 font-medium max-w-xs mx-auto">No decentralized persistence entries found in the current vector space.</p>
                                             <button 
                                                onClick={() => navigate('/hospitals')}
                                                className="mt-10 bg-primary text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-red-100 hover:bg-red-800 transition-all"
                                             >
                                                Initialize First Synapse
                                             </button>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserDashboard;
