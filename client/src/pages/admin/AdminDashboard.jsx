import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [tab, setTab] = useState('plots');
  const [plots, setPlots] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (tab === 'plots') {
      axios.get(' https://construction-website-x1xn.onrender.com/api/plots', { headers: { Authorization: `Bearer ${token}` } }).then(res => setPlots(res.data));
    }
    if (tab === 'inquiries') {
      axios.get(' https://construction-website-x1xn.onrender.com/inquiries', { headers: { Authorization: `Bearer ${token}` } }).then(res => setInquiries(res.data));
    }
    if (tab === 'bookings') {
      axios.get(' https://construction-website-x1xn.onrender.com/api/bookings', { headers: { Authorization: `Bearer ${token}` } }).then(res => setBookings(res.data));
    }
  }, [tab, token]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 text-lg">Manage your plots, inquiries, and bookings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl shadow-lg p-2 flex space-x-2">
            <button 
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                tab === 'plots' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`} 
              onClick={() => setTab('plots')}
            >
              Plots ({plots.length})
            </button>
            <button 
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                tab === 'inquiries' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`} 
              onClick={() => setTab('inquiries')}
            >
              Inquiries ({inquiries.length})
            </button>
            <button 
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                tab === 'bookings' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`} 
              onClick={() => setTab('bookings')}
            >
              Bookings ({bookings.length})
            </button>
          </div>
        </div>

        {/* Plots Section */}
        {tab === 'plots' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Property Plots</h2>
              <div className="text-sm text-slate-500">Total: {plots.length} plots</div>
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {plots.map(plot => (
                <div key={plot._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-slate-800 line-clamp-2">{plot.title}</h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ₹{plot.price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-slate-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{plot.location}</span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-3">{plot.description}</p>
                      {plot.contactInfo && (
                        <div className="flex items-center text-slate-500 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{plot.contactInfo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiries Section */}
        {tab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Customer Inquiries</h2>
              <div className="text-sm text-slate-500">Total: {inquiries.length} inquiries</div>
            </div>
            <div className="grid gap-6">
              {inquiries.map(inq => (
                <div key={inq._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{inq.name}</h3>
                        <p className="text-blue-600 font-medium">{inq.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                          {inq.type || 'General'}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(inq.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed">{inq.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {tab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Plot Bookings</h2>
              <div className="text-sm text-slate-500">Total: {bookings.length} bookings</div>
            </div>
            <div className="grid gap-6">
              {bookings.map(bk => (
                <div key={bk._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{bk.name}</h3>
                        <p className="text-blue-600 font-medium">{bk.email}</p>
                        {bk.phone && (
                          <p className="text-slate-600 text-sm">{bk.phone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Booked
                        </span>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(bk.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center text-blue-800 font-semibold mb-1">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Plot: {bk.plotTitle || bk.plotId}
                        </div>
                      </div>
                      {bk.message && (
                        <div className="bg-slate-50 rounded-lg p-4">
                          <p className="text-slate-700 leading-relaxed">{bk.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {((tab === 'plots' && plots.length === 0) || 
          (tab === 'inquiries' && inquiries.length === 0) || 
          (tab === 'bookings' && bookings.length === 0)) && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No {tab} found</h3>
              <p className="text-slate-600">There are currently no {tab} to display.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 