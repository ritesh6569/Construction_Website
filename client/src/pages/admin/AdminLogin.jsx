import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(' https://construction-website-x1xn.onrender.com/api/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <section className="bg-neutral-50 flex flex-col flex-1 items-center justify-center py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-blue-100">
        <h2 className="text-3xl font-black text-blue-800 mb-8 text-center drop-shadow">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="mb-4 text-center text-red-400 font-semibold">{error}</div>}
          <div>
            <label className="block mb-1 font-semibold text-blue-800">Username</label>
            <input type="text" className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-800">Password</label>
            <input type="password" className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded font-bold hover:bg-blue-900 transition">Login</button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-blue-800">Don&apos;t have an account? </span>
          <Link to="/admin/register" className="text-blue-600 hover:underline font-semibold">Register</Link>
        </div>
      </div>
    </section>
  );
} 