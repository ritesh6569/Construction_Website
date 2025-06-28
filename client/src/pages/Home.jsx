import React from 'react';
import { Link } from 'react-router-dom';

const heroImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'; // Example construction image

export default function Home() {
  return (
    <section className="bg-white flex flex-col flex-1 justify-center py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Hero Image */}
        <div className="flex-1 w-full mb-8 md:mb-0">
          <img src={heroImage} alt="Construction site" className="rounded-lg shadow-lg w-full object-cover h-64 md:h-96" />
        </div>
        {/* Hero Text */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">Welcome to Construction Co.</h1>
          <p className="text-lg text-gray-600 mb-6 max-w-xl">
            We create inspiring spaces with architectural excellence, transparent process, and a passion for quality.
          </p>
          <Link to="/contact">
            <button className="bg-blue-700 text-white px-8 py-3 rounded font-semibold text-lg shadow hover:bg-blue-800 transition">
              Request a Consultation
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
} 