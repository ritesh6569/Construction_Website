import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/plots', label: 'Plot Market' },
  { to: '/why-choose-us', label: 'Why Choose Us' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <span className="inline-block w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-blue-800 font-black shadow">CC</span>
          <span className="hidden sm:inline text-blue-800 tracking-widest uppercase">Construction Co.</span>
        </Link>
        <div className="hidden md:flex space-x-2 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded uppercase tracking-wide text-sm font-semibold transition ${
                  isActive
                    ? 'bg-yellow-400 text-blue-800'
                    : 'text-blue-800 hover:bg-blue-50 hover:text-yellow-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/admin/login" className="ml-4 px-3 py-2 rounded bg-yellow-400 text-blue-800 font-bold hover:bg-yellow-300 transition">Admin</NavLink>
        </div>
        <button className="md:hidden p-2" onClick={() => setMenuOpen(m => !m)}>
          <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white shadow px-4 pb-4">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded uppercase tracking-wide text-sm font-semibold transition ${
                  isActive
                    ? 'bg-yellow-400 text-blue-800'
                    : 'text-blue-800 hover:bg-blue-50 hover:text-yellow-600'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/admin/login" className="block mt-2 px-3 py-2 rounded bg-yellow-400 text-blue-800 font-bold hover:bg-yellow-300 transition" onClick={() => setMenuOpen(false)}>Admin</NavLink>
        </div>
      )}
    </nav>
  );
} 