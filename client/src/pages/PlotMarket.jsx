import React, { useEffect, useState } from 'react';
import axios from 'axios';

const heroImage = 'https://images.unsplash.com/photo-1464983953574-0892a716854b'; // Example real estate/land image
const demoImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

export default function PlotMarket() {
  const [plots, setPlots] = useState([]);
  const [inquiry, setInquiry] = useState({ name: '', email: '', message: '' });
  const [message, setMessage] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [bookingModal, setBookingModal] = useState({ open: false, plot: null });
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    axios.get('https://construction-website-x1xn.onrender.com/api/plots').then(res => setPlots(res.data));
  }, []);

  const handleImageError = (plotId) => {
    setImageErrors(prev => ({ ...prev, [plotId]: true }));
  };

  const getImageSrc = (plot) => {
    if (imageErrors[plot._id]) {
      return demoImage;
    }
    if (plot.image && plot.image.startsWith('/uploads/')) {
      const imageUrl = `https://construction-website-x1xn.onrender.com${plot.image}`;
      return imageUrl;
    }
    if (plot.image && plot.image.startsWith('http')) {
      return plot.image;
    }
    return demoImage;
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://construction-website-x1xn.onrender.com/api/inquiries', { ...inquiry, type: 'plot' });
      setMessage('Inquiry sent successfully!');
      setInquiry({ name: '', email: '', message: '' });
    } catch (err) {
      setMessage('Error sending inquiry. Please try again.');
    }
  };

  const openBookingModal = (plot) => {
    setBookingModal({ open: true, plot });
    setBookingForm({ name: '', email: '', phone: '', message: '' });
    setBookingStatus('');
  };
  const closeBookingModal = () => {
    setBookingModal({ open: false, plot: null });
    setBookingStatus('');
  };
  const handleBookingChange = (e) => {
    setBookingForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://construction-website-x1xn.onrender.com/api/bookings', {
        ...bookingForm,
        plotId: bookingModal.plot._id,
        plotTitle: bookingModal.plot.title,
      });
      setBookingStatus('Booking request sent!');
      setTimeout(() => closeBookingModal(), 1500);
    } catch (err) {
      setBookingStatus('Error sending booking.');
    }
  };

  return (
    <section className="bg-[#F3F4F6] min-h-[80vh]">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center mb-12">
        <img src={heroImage} alt="Plots" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-[#10B981] opacity-30" />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#334155] drop-shadow mb-2">Plot Market</h2>
          <p className="text-lg md:text-xl text-[#1E293B] font-medium drop-shadow">Find your perfect plot or list your property with us.</p>
        </div>
      </div>

      {/* Available Plots Section */}
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-2xl font-bold text-[#334155]">Available Plots</h3>
      </div>
      <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
        {plots.map(plot => (
          <div key={plot._id} className="bg-white rounded-lg shadow-lg border border-[#6EE7B7] flex flex-col overflow-hidden hover:shadow-xl transition">
            <div className="relative">
              <img 
                src={getImageSrc(plot)} 
                alt={plot.title} 
                className="w-full h-56 object-cover object-top"
                onError={() => handleImageError(plot._id)}
                loading="lazy"
              />
              <span className="absolute top-2 right-2 bg-[#10B981] text-white font-bold px-3 py-1 rounded shadow text-sm">₹{plot.price}</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="text-xl font-bold text-[#334155] mb-1">{plot.title}</h4>
              <div className="text-[#64748B] mb-1">{plot.location}</div>
              <div className="mb-2 text-[#1E293B]">{plot.description}</div>
              <div className="text-xs text-[#94A3B8] mb-2">Contact: {plot.contactInfo}</div>
              <button className="mt-2 bg-[#10B981] text-white px-4 py-2 rounded font-bold hover:bg-[#059669] transition" onClick={() => openBookingModal(plot)}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Section */}
      <div className="container mx-auto px-4 mb-12 flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full border border-[#6EE7B7]">
          <h3 className="text-2xl font-bold text-[#334155] mb-2 text-center">Interested? Send an Inquiry</h3>
          <form onSubmit={handleInquiry}>
            <input className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full mb-2 placeholder-black focus:border-[#10B981]" placeholder="Your Name" value={inquiry.name} onChange={e => setInquiry(f => ({ ...f, name: e.target.value }))} required />
            <input className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full mb-2 placeholder-black focus:border-[#10B981]" placeholder="Your Email" value={inquiry.email} onChange={e => setInquiry(f => ({ ...f, email: e.target.value }))} required />
            <textarea className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full mb-2 placeholder-black focus:border-[#10B981]" placeholder="Message" value={inquiry.message} onChange={e => setInquiry(f => ({ ...f, message: e.target.value }))} required />
            <button className="bg-[#10B981] text-white px-4 py-2 rounded font-bold w-full hover:bg-[#059669] transition" type="submit">Send Inquiry</button>
          </form>
          {message && <div className="text-green-600 font-bold mt-2 text-center">{message}</div>}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={closeBookingModal}>&times;</button>
            <h3 className="text-2xl font-bold text-[#334155] mb-4 text-center">Book Plot: <span className="text-[#10B981]">{bookingModal.plot.title}</span></h3>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <input name="name" className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full placeholder-black focus:border-[#10B981]" placeholder="Your Name" value={bookingForm.name} onChange={handleBookingChange} required />
              <input name="email" type="email" className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full placeholder-black focus:border-[#10B981]" placeholder="Your Email" value={bookingForm.email} onChange={handleBookingChange} required />
              <input name="phone" className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full placeholder-black focus:border-[#10B981]" placeholder="Phone (optional)" value={bookingForm.phone} onChange={handleBookingChange} />
              <textarea name="message" className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full placeholder-black focus:border-[#10B981]" placeholder="Message (optional)" value={bookingForm.message} onChange={handleBookingChange} />
              <button className="bg-[#10B981] text-white px-4 py-2 rounded font-bold w-full hover:bg-[#059669] transition" type="submit">Send Booking</button>
            </form>
            {bookingStatus && <div className="mt-4 text-center font-bold text-[#10B981]">{bookingStatus}</div>}
          </div>
        </div>
      )}
    </section>
  );
} 