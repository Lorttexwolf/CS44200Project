'use client';

import { useCampuses } from '@/hooks/useCampuses';
import Link from 'next/link';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';

export default function CampusSelection() {
  const { campuses, loading, error } = useCampuses();

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading campuses...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Campus
          </h2>
          <p className="text-xl text-gray-600 mx-auto">
            Choose your university to find available parking spots in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campuses.map((campus) => (
            <Link 
              key={campus.ID} 
              href={`/${campus.ShortName}`}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="relative h-48 bg-linear-to-br from-blue-500 to-blue-700 overflow-hidden">
                  {campus.VideoURL ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute top-0 left-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                      <source src={campus.VideoURL} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageWithFallback 
                        src={campus.IconURL} 
                        alt={campus.Name}
                        className="max-h-24 max-w-[80%] object-contain"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <ImageWithFallback 
                      src={campus.IconURL} 
                      alt={campus.Name}
                      className="max-h-12 object-contain"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {campus.Name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {campus.Description}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Find Parking
                    <svg 
                      className="w-5 h-5 ml-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                   <div id="team" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
