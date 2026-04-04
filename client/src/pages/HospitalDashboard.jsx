import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Package, Plus, Minus, Bell, CheckCircle, TrendingUp, AlertTriangle, Droplets, Info, Search, Activity, User } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, donationsRes] = await Promise.all([
          api.get('/hospitals/profile'),
          api.get('/requests/hospital')
        ]);
        setProfile(profileRes.data);
        setDonations(donationsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (units) => {
    if (units > 100) return 'bg-green-100/50 border-green-200 text-green-700 shadow-[0_20px_40px_rgba(34,197,94,0.05)]';
    if (units >= 50) return 'bg-yellow-100/50 border-yellow-200 text-yellow-700 shadow-[0_20px_40px_rgba(234,179,8,0.05)]';
    return 'bg-red-50 border-red-200 text-red-700 shadow-[0_20px_40px_rgba(239,68,68,0.05)]';
  };

  const handleInputChange = async (group, value) => {
    const newVal = Math.max(0, parseInt(value) || 0);
    const newInventory = { ...profile.inventory, [group]: newVal };
    
    // Immediate UI Update
    setProfile(prev => ({ ...prev, inventory: newInventory }));
    
    setUpdateLoading(true);
    try {
      const { data } = await api.put('/hospitals/inventory', { inventory: newInventory });
      setProfile(prev => ({ ...prev, inventory: data }));
    } catch (err) {
      console.error("Failed to sync inventory", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateStock = async (group, type) => {
    const newInventory = { ...profile.inventory };
    newInventory[group] = type === 'plus' ? newInventory[group] + 1 : Math.max(0, newInventory[group] - 1);
    
    // Immediate UI Update
    setProfile(prev => ({ ...prev, inventory: newInventory }));

    setUpdateLoading(true);
    try {
      const { data } = await api.put('/hospitals/inventory', { inventory: newInventory });
      setProfile(prev => ({ ...prev, inventory: data }));
    } catch (err) {
      console.error("Failed to update stock", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      await api.patch(`/requests/approve/${donationId}`, { status: 'Accepted' });
      alert("Donation node authenticated. Access granted!");
      const { data } = await api.get('/requests/hospital');
      setDonations(data);
    } catch (err) {
      alert("Failed to authenticate request");
    }
  };

  const handleRejectDonation = async (donationId) => {
    try {
      await api.patch(`/requests/approve/${donationId}`, { status: 'Rejected' });
      const { data } = await api.get('/requests/hospital');
      setDonations(data);
    } catch (err) {
      alert("Failed to reject request");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/50 gap-6">
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="p-8 bg-white rounded-[3rem] shadow-2xl border border-slate-100"
        >
            <Activity size={48} className="text-primary" />
        </motion.div>
        <p className="font-['Outfit'] font-black text-[10px] uppercase tracking-[0.5em] text-slate-400 animate-pulse">Syncing Global Inventory...</p>
    </div>
  );

  const chartData = Object.entries(profile.inventory).map(([name, units]) => ({
    name,
    stock: units,
    target: 20 // Target units for visual reference
  }));

  const urgentGroups = Object.entries(profile.inventory).filter(([_, units]) => units === 0).map(([g]) => g);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">{label} Group</p>
          <p className="text-xl font-black">{payload[0].value} <span className="text-sm font-normal opacity-60">Units In Hand</span></p>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${payload[0].value < 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-tight">{payload[0].value < 5 ? 'Critical Stock' : 'Optimized'}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50/50 px-6 font-['Outfit']">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 bg-white p-12 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary font-black tracking-[0.2em] uppercase text-[9px] px-4 py-1.5 rounded-full border border-primary/10">Active Node</span>
                <span className="bg-slate-100 text-slate-500 font-black tracking-[0.2em] uppercase text-[9px] px-4 py-1.5 rounded-full border border-slate-200">ID: SBAN-{profile?._id?.slice(-4)}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">{profile.name}</h1>
            <p className="text-slate-400 mt-4 flex items-center gap-2 font-bold tracking-tight"><Activity size={18} className="text-primary/40" /> Real-time Decentralized Command Dashboard</p>
          </div>

          <div className="relative z-10 flex flex-col items-end gap-4">
              {urgentGroups.length > 0 ? (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="glass bg-white p-6 rounded-[2.5rem] flex items-center gap-5 border-red-100 animate-pulse-emergency"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-lg"><AlertTriangle size={28} /></div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Critical Deficit</p>
                       <p className="font-black text-2xl text-slate-900">{urgentGroups.join(', ')}</p>
                    </div>
                  </motion.div>
              ) : (
                  <div className="bg-green-50 p-6 rounded-[2.5rem] flex items-center gap-5 border border-green-100">
                    <div className="w-14 h-14 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-lg"><CheckCircle size={28} /></div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600 mb-1">Inventory Status</p>
                       <p className="font-black text-2xl text-slate-900 tracking-tight">Fully Optimized</p>
                    </div>
                  </div>
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Main Control Panel */}
          <div className="xl:col-span-8 space-y-12">
            
            {/* Inventory Controls */}
            <div className="bg-white p-12 rounded-[4rem] shadow-[0_30px_80px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-2xl text-primary"><Package size={24} /></div>
                    Node Inventory
                </h2>
                <AnimatePresence>
                    {updateLoading && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] bg-red-50/50 px-6 py-2.5 rounded-full border border-red-100"
                        >
                            <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div> Synchronizing Node...
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {Object.entries(profile.inventory).map(([group, units], idx) => (
                   <motion.div 
                     key={group} 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     className={`${getStatusColor(units)} rounded-[2.5rem] p-8 border transition-all duration-500 group relative overflow-hidden ring-0 hover:scale-[1.02] cursor-default`}
                   >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-60 relative z-10">{group} Vector</p>
                      <div className="flex items-center justify-between relative z-10">
                         <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleUpdateStock(group, 'minus')} className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-md border border-current/10 flex items-center justify-center hover:bg-white transition-all shadow-sm"><Minus size={16} /></motion.button>
                         <input 
                            type="number"
                            value={units}
                            onChange={(e) => handleInputChange(group, e.target.value)}
                            className="w-20 text-center bg-transparent border-none appearance-none focus:outline-none focus:ring-0 text-4xl font-black tracking-tighter cursor-pointer [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                         />
                         <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleUpdateStock(group, 'plus')} className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-md border border-current/10 flex items-center justify-center hover:bg-white transition-all shadow-sm"><Plus size={16} /></motion.button>
                      </div>
                      <div className={`mt-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${units < 100 ? 'opacity-100' : 'opacity-0'}`}>
                        {units === 0 ? <AlertTriangle size={12} className="animate-pulse" /> : <Info size={12} />}
                        {units === 0 ? 'Node Deficit' : units < 50 ? 'Critical Stock' : 'Low Stock'}
                      </div>
                   </motion.div>
                 ))}
              </div>
            </div>

            {/* Analytics Chart */}
            <div className="bg-white p-12 rounded-[4rem] shadow-[0_30px_80px_rgba(0,0,0,0.03)] border border-slate-50">
               <div className="flex items-center justify-between mb-12">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                       <div className="p-3 bg-red-50 rounded-2xl text-primary"><TrendingUp size={24} /></div>
                       Network Analytics
                   </h2>
               </div>
               <div className="h-[28rem] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#B22222" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#8B0000" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900 }} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dx={-10} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 16 }} />
                      <Bar dataKey="stock" radius={[12, 12, 4, 4]} barSize={45}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.stock < 5 ? '#ef4444' : 'url(#barGradient)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Side Panel: Requests */}
          <div className="xl:col-span-4 space-y-12">
            <div className="bg-white p-10 rounded-[4rem] shadow-[0_30px_80px_rgba(0,0,0,0.03)] border border-slate-50 h-full relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Bell className="text-primary" /> Node Requests
                </h2>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode='popLayout'>
                    {donations.filter(d => d.status === 'Pending').length > 0 ? (
                      donations.filter(d => d.status === 'Pending').map((d) => (
                        <motion.div 
                            layout
                            key={d._id} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-2xl transition-all duration-500"
                        >
                          <div className="flex flex-col gap-4 w-full">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm overflow-hidden">
                                    {d.user?.photo ? <img src={d.user.photo} className="w-full h-full object-cover" /> : <User size={24} />}
                                 </div>
                                 <div className="flex flex-col">
                                    <p className="font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{d.name}</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{d.bloodGroup} Target {d.gender ? `• ${d.gender}` : ''}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleRejectDonation(d._id)} 
                                  className="w-10 h-10 rounded-2xl bg-white text-slate-400 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-all shadow-sm"
                                >
                                  X
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleAcceptDonation(d._id)} 
                                  className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-red-800 transition-all shadow-xl shadow-red-100"
                                >
                                  <CheckCircle size={22} />
                                </motion.button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2">
                                {/* Physical Origin */}
                                <div className="w-full bg-slate-100 p-2.5 rounded-xl text-xs text-slate-500 font-medium">
                                    <span className="font-black text-slate-900 mb-1 block text-[9px] uppercase tracking-widest">Physical Origin:</span>
                                    {d.address}
                                </div>
                                {/* Medical History Extracted Container */}
                                <div className="w-full bg-white p-2.5 rounded-xl border border-slate-100 text-xs text-slate-500 font-medium">
                                    <span className="font-black text-slate-900 mb-1 block text-[9px] uppercase tracking-widest">Medical History Check:</span>
                                    {d.medicalHistory}
                                </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 text-center">
                         <p className="text-slate-300 font-black text-[10px] uppercase tracking-widest">No Active Transmission Requests</p>
                      </div>
                    )}
                </AnimatePresence>
              </div>

              <div className="mt-12 pt-10 border-t border-slate-50">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Recent Logs</h3>
                </div>
                <div className="space-y-4">
                   {donations.filter(d => d.status === 'Accepted').slice(0, 4).map(d => (
                     <div key={d._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-50 transition-all hover:bg-white hover:shadow-lg">
                        <span className="text-[12px] font-black text-slate-700">{d.user.name}</span>
                        <span className="text-[9px] font-black text-green-500 uppercase">Synchronized</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
