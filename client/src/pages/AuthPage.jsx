import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Hospital as HospitalIcon, Mail, Lock, Phone, MapPin, Calendar, Droplet, Camera, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [authType, setAuthType] = useState('user'); // 'user' or 'hospital'
    const { loginUser, loginHospital, registerUser, registerHospital } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: '', bloodGroup: 'A+', dob: '', lastDonationDate: '', photo: '', logo: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                if (authType === 'user') await loginUser(formData.email, formData.password);
                else await loginHospital(formData.email, formData.password);
            } else {
                const submissionData = { ...formData };
                if (authType === 'user') {
                    submissionData.location = { type: 'Point', coordinates: [86.9661, 23.6889] };
                    await registerUser(submissionData);
                } else {
                    submissionData.location = { type: 'Point', coordinates: [86.9661, 23.6889] };
                    await registerHospital(submissionData);
                }
            }
            navigate(authType === 'user' ? '/user-dashboard' : '/hospital-dashboard');
        } catch (err) {
            // Enhanced extraction: Pull from axios response or fall back gracefully
            const message = err.response?.data?.message || err.message || 'Authentication failed. Please try again.';
            setError(message);
            console.error('Auth Error Trace:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50/50 flex items-center justify-center px-4 overflow-hidden relative font-['Outfit']">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-red-100/20 rounded-full -ml-48 -mb-48 blur-3xl opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] overflow-hidden max-w-5xl w-full flex flex-col md:flex-row border border-white relative z-10"
            >
                {/* Left Side: Info & Role Selector */}
                <div className="bg-primary p-12 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#B22222] via-[#8B0000] to-[#550000] opacity-95"></div>

                    <div className="relative z-10">
                        <motion.button
                            whileHover={{ x: -10 }}
                            onClick={() => navigate('/')}
                            className="text-white/80 hover:text-white flex items-center gap-2 mb-12 font-black text-[10px] uppercase tracking-widest bg-white/10 w-max px-5 py-2.5 rounded-full border border-white/10 transition-all font-['Outfit']"
                        >
                            <ArrowRight className="rotate-180" size={14} /> Global Network
                        </motion.button>

                        <motion.h2
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-5xl font-black mb-6 leading-[1.1] tracking-tight"
                        >
                            Life is in <br /><span className="text-red-300">your hands.</span>
                        </motion.h2>
                        <p className="text-red-100/80 font-medium text-lg leading-relaxed mb-12 max-w-sm">Join SBAN to revolutionize how blood is tracked, donated, and delivered during critical hours.</p>

                        <div className="bg-black/20 p-1.5 rounded-[2.5rem] flex relative backdrop-blur-md border border-white/10 shadow-inner">
                            <motion.div
                                animate={{ x: authType === 'user' ? '0%' : '100%' }}
                                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                                className="absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[2rem] shadow-xl"
                            />
                            <button
                                onClick={() => setAuthType('user')}
                                className={`w-1/2 py-4 rounded-[2rem] z-10 transition-all duration-500 font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 ${authType === 'user' ? 'text-primary' : 'text-white/70 hover:text-white font-bold'}`}
                            >
                                <User size={18} /> User
                            </button>
                            <button
                                onClick={() => setAuthType('hospital')}
                                className={`w-1/2 py-4 rounded-[2rem] z-10 transition-all duration-500 font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 ${authType === 'hospital' ? 'text-primary' : 'text-white/70 hover:text-white font-bold'}`}
                            >
                                <HospitalIcon size={18} /> Hospital
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all">
                        <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-white text-white group-hover:text-primary transition-all shadow-lg"><ShieldCheck size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Core Security</p>
                            <p className="text-sm font-bold tracking-tight">Verified Encryption</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Content */}
                <div className="p-12 md:w-3/5 bg-white flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2 block opacity-60 font-['Outfit']">{authType} Portal</span>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{isLogin ? 'Welcome Back' : 'Join the Network'}</h3>
                        </div>
                        <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-black text-[11px] uppercase tracking-widest hover:text-red-800 transition-all py-2.5 px-5 rounded-2xl bg-primary/5 hover:bg-primary/10">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 text-red-600 p-5 rounded-[1.5rem] mb-10 text-[11px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm">✕</div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        {!isLogin && (
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-2">Official Identity</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] outline-none focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-slate-700 shadow-inner" placeholder="Enter full name" />
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] outline-none focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-slate-700 shadow-inner" placeholder="name@network.com" />
                            </div>
                        </div>

                        <div className={`${isLogin ? "md:col-span-2" : ""} space-y-2`}>
                            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-2">Privacy Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
                                <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] outline-none focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-slate-700 shadow-inner" placeholder="••••••••" />
                            </div>
                        </div>

                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-2">Contact Point</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
                                        <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] outline-none focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-slate-700 shadow-inner" placeholder="+1 (555) 000" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-2">Geo Location / Address</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
                                        <input type="text" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] outline-none focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-slate-700 shadow-inner" placeholder="Global Coordinate / Street" />
                                    </div>
                                </div>
                                {authType === 'user' ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-2">Entity Group</label>
                                            <div className="relative group">
                                                <Droplet className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
                                                <select value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })} className="w-full pl-14 pr-10 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] outline-none focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-slate-700 shadow-inner appearance-none">
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                </select>
                                                <div className="absolute right-6 top-6 pointer-events-none text-slate-300 group-hover:text-primary transition-colors"><ArrowRight className="rotate-90" size={14} /></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-2">Cycle Date (DOB)</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
                                                <input type="date" required value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] outline-none focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-slate-700 shadow-inner" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-2">Last Donation Date</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
                                                <input type="date" value={formData.lastDonationDate} onChange={e => setFormData({ ...formData, lastDonationDate: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] outline-none focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-slate-700 shadow-inner" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-2">Corporate Identity (Logo URL)</label>
                                        <div className="relative group">
                                            <Camera className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
                                            <input type="text" value={formData.logo} onChange={e => setFormData({ ...formData, logo: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] outline-none focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-slate-700 shadow-inner" placeholder="https://cloud.logo.cdn/my-logo.png" />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <motion.button
                            whileHover={{ y: -8, shadow: "0 30px 60px rgba(178, 34, 34, 0.25)" }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={loading}
                            className="md:col-span-2 mt-6 bg-[#B22222] text-white py-6 rounded-[2rem] font-black text-[13px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all hover:bg-[#8B0000] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-red-100 ring-4 ring-primary/10"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>{isLogin ? 'Enter Global Network' : 'Initialize Node Identity'} <ArrowRight size={20} /></>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
