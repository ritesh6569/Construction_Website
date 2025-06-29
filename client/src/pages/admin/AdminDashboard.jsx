import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [tab, setTab] = useState('plots');
  const [plots, setPlots] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddPlot, setShowAddPlot] = useState(false);
  const [plotForm, setPlotForm] = useState({ title: '', description: '', location: '', price: '', contactInfo: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [fileInputRef, setFileInputRef] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (tab === 'plots') {
      axios.get('https://construction-website-x1xn.onrender.com/api/plots', { headers: { Authorization: `Bearer ${token}` } }).then(res => setPlots(res.data));
    }
    if (tab === 'inquiries') {
      axios.get('https://construction-website-x1xn.onrender.com/api/inquiries', { headers: { Authorization: `Bearer ${token}` } }).then(res => setInquiries(res.data));
    }
    if (tab === 'bookings') {
      axios.get('https://construction-website-x1xn.onrender.com/api/bookings', { headers: { Authorization: `Bearer ${token}` } }).then(res => setBookings(res.data));
    }
  }, [tab, token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFileError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef) {
      fileInputRef.click();
    }
  };

  const handleAddPlot = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', plotForm.title);
      formData.append('description', plotForm.description);
      formData.append('location', plotForm.location);
      formData.append('price', plotForm.price);
      formData.append('contactInfo', plotForm.contactInfo);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      
      await axios.post('https://construction-website-x1xn.onrender.com/api/plots', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage('Plot added successfully!');
      setPlotForm({ title: '', description: '', location: '', price: '', contactInfo: '' });
      setSelectedFile(null);
      setShowAddPlot(false);
      
      // Refresh plots list
      const res = await axios.get('https://construction-website-x1xn.onrender.com/api/plots', { headers: { Authorization: `Bearer ${token}` } });
      setPlots(res.data);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error adding plot. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeletePlot = async (plotId) => {
    if (window.confirm('Are you sure you want to delete this plot? This action cannot be undone.')) {
      try {
        await axios.delete(`https://construction-website-x1xn.onrender.com/api/plots/${plotId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setMessage('Plot deleted successfully!');
        // Refresh plots list
        const res = await axios.get('https://construction-website-x1xn.onrender.com/api/plots', { headers: { Authorization: `Bearer ${token}` } });
        setPlots(res.data);
        
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage('Error deleting plot. Please try again.');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 text-lg">Manage your plots, inquiries, and bookings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="bg-white rounded-xl shadow-lg p-1 md:p-2 flex flex-wrap justify-center gap-1 md:gap-2">
            <button 
              className={`px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base ${
                tab === 'plots' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`} 
              onClick={() => setTab('plots')}
            >
              Plots ({plots.length})
            </button>
            <button 
              className={`px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base ${
                tab === 'inquiries' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`} 
              onClick={() => setTab('inquiries')}
            >
              Inquiries ({inquiries.length})
            </button>
            <button 
              className={`px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base ${
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
          <div className="space-y-4 md:space-y-6">
            {/* Success/Error Message */}
            {message && (
              <div className={`p-3 md:p-4 rounded-lg text-center font-semibold text-sm md:text-base ${
                message.includes('successfully') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">Property Plots</h2>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="text-sm text-slate-500 text-center md:text-left">Total: {plots.length} plots</div>
                <button 
                  className="bg-green-600 text-white px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm md:text-base"
                  onClick={() => setShowAddPlot(!showAddPlot)}
                >
                  {showAddPlot ? 'Cancel' : 'Add New Plot'}
                </button>
              </div>
            </div>

            {/* Add Plot Form */}
            {showAddPlot && (
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 md:mb-6">Add New Plot</h3>
                <form onSubmit={handleAddPlot} className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                  <input 
                    className="border border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base" 
                    placeholder="Plot Title" 
                    value={plotForm.title} 
                    onChange={e => setPlotForm(f => ({ ...f, title: e.target.value }))} 
                    required 
                  />
                  <input 
                    className="border border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base" 
                    placeholder="Location" 
                    value={plotForm.location} 
                    onChange={e => setPlotForm(f => ({ ...f, location: e.target.value }))} 
                    required 
                  />
                  <input 
                    className="border border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base" 
                    placeholder="Price (₹)" 
                    type="number" 
                    value={plotForm.price} 
                    onChange={e => setPlotForm(f => ({ ...f, price: e.target.value }))} 
                    required 
                  />
                  <input 
                    className="border border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base" 
                    placeholder="Contact Info" 
                    value={plotForm.contactInfo} 
                    onChange={e => setPlotForm(f => ({ ...f, contactInfo: e.target.value }))} 
                  />
                  
                  {/* File Upload */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Plot Image</label>
                    <div 
                      className="border-2 border-dashed border-slate-300 rounded-lg p-4 md:p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={handleUploadClick}
                    >
                      {selectedFile ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-slate-800 font-medium text-sm md:text-base">{selectedFile.name}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              setFileError('');
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg className="mx-auto w-8 h-8 md:w-12 md:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="text-slate-600 text-sm md:text-base">
                            <span className="font-medium">Click to upload</span> or drag and drop
                          </div>
                          <p className="text-xs text-slate-500">PNG, JPG, JPEG up to 5MB</p>
                        </div>
                      )}
                      <input 
                        ref={setFileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </div>
                    {fileError && (
                      <p className="text-red-600 text-sm mt-1">{fileError}</p>
                    )}
                  </div>
                  
                  <textarea 
                    className="col-span-1 md:col-span-2 border border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base" 
                    placeholder="Description" 
                    rows="4"
                    value={plotForm.description} 
                    onChange={e => setPlotForm(f => ({ ...f, description: e.target.value }))} 
                    required 
                  />
                  
                  <button 
                    className="col-span-1 md:col-span-2 bg-blue-600 text-white px-4 md:px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-base" 
                    type="submit"
                  >
                    Add Plot
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {plots.map(plot => (
                <div key={plot._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 relative">
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 line-clamp-2 flex-1 mr-2">{plot.title}</h3>
                      <span className="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap">
                        ₹{plot.price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center text-slate-600">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm truncate">{plot.location}</span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-3">{plot.description}</p>
                      {plot.contactInfo && (
                        <div className="flex items-center text-slate-500 text-sm">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="truncate">{plot.contactInfo}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Delete Button - Bottom Right */}
                    <div className="flex justify-end mt-3 md:mt-4">
                      <button
                        onClick={() => handleDeletePlot(plot._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-1 text-xs md:text-sm"
                        title="Delete Plot"
                      >
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="font-medium">Delete</span>
                      </button>
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