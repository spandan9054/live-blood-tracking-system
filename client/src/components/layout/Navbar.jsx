import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Droplet, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', public: true },
    { name: 'About Us', path: '/about', public: true },
    { name: 'Contact Us', path: '/contact', public: true },
    { name: 'Map', path: 'https://www.google.com/maps/search/hospitals+and+blood+banks+near+me/', public: false, external: true },
    { name: 'Hospitals', path: '/hospitals', public: false },
  ];

  const filteredLinks = navLinks.filter(link => link.public || user);

  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Droplet className="text-primary fill-primary" size={28} />
            <span className="text-xl font-extrabold tracking-tight text-gray-900">SBAN</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredLinks.map((link) => (
              link.external ? (
                <a key={link.name} href={link.path} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} to={link.path} className="text-gray-600 hover:text-primary font-medium transition-colors">
                  {link.name}
                </Link>
              )
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === 'user' ? '/user-dashboard' : '/hospital-dashboard'} className="text-primary font-semibold border-b-2 border-primary">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-full hover:bg-red-800 transition-all shadow-md">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-red-800 transition-all shadow-lg font-semibold">
                Sign In/Up
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden glass px-4 pt-2 pb-6 space-y-2">
          {filteredLinks.map((link) => (
            link.external ? (
              <a key={link.name} href={link.path} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-primary">
                {link.name}
              </a>
            ) : (
              <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-primary">
                {link.name}
              </Link>
            )
          ))}
          {user ? (
            <>
              <Link to={user.role === 'user' ? '/user-dashboard' : '/hospital-dashboard'} onClick={() => setIsOpen(false)} className="block py-2 text-primary font-bold">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full text-left py-2 text-gray-700">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsOpen(false)} className="block py-2 text-primary font-bold">
              Sign In/Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
