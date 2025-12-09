'use client';

import { faLocationArrow, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import { useParkingLots } from "@/hooks/useParkingLots";
import { Campus } from "@/models/Campus";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import HorizontalWrap from "./HorizontalWrap";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";



export default function ParkingLots({ campusID, campusShortName }: { campusID: Campus["ID"], campusShortName: string }) {
  // Fetch parking lots from database (campusId = 1)
  const { parkingLots, loading, error } = useParkingLots(campusID);
  
  // Get 3 most popular (lowest availability percentage)
  const topLots = [...parkingLots]
    .sort((a, b) => (a.AvailableSpots / a.TotalSpots) - (b.AvailableSpots / b.TotalSpots))
    .slice(0, 3);

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 30) return "bg-green-500";
    if (percentage > 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAvailabilityBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 30) return { variant: "default" as const, text: "Available", color: "bg-green-100 text-green-800 border border-green-300" };
    if (percentage > 10) return { variant: "secondary" as const, text: "Limited", color: "bg-yellow-100 text-yellow-800 border border-yellow-300" };
    return { variant: "destructive" as const, text: "Almost Full", color: "bg-red-100 text-red-800 border border-red-300" };
  };

  if (loading) {
    return (
      <section id="locations" className="py-20 bg-white">
        <HorizontalWrap>
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-[500px] mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative h-48 bg-gray-200 animate-pulse"></div>
                
                <CardHeader>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="h-12 bg-gray-200 rounded w-40 mx-auto animate-pulse"></div>
          </div>
        </HorizontalWrap>
      </section>
    );
  }

  if (error) {
    return (
      <section id="locations" className="py-20 bg-white">
        <HorizontalWrap>
          <div className="text-center">
            <p className="text-xl text-red-600">Error loading parking lots: {error}</p>
          </div>
        </HorizontalWrap>
      </section>
    );
  }

  return (
    <section id="locations" className="py-20 bg-white">
      <HorizontalWrap>
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4 text-3xl">
            Popular Campus Parking Locations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse available parking near your classes. Updated in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topLots.map((lot, index) => {
            const badge = getAvailabilityBadge(lot.AvailableSpots, lot.TotalSpots);
            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  {lot.ImageFileName && <ImageWithFallback
                    src={`/api/images/${lot.ImageFileName}`}
                    alt={lot.Name}
                    className="w-full h-full object-cover"
                  />}
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-900 mb-1">{lot.Name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FontAwesomeIcon icon={faMapPin} className="size-4" />
                        {lot.Address}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <FontAwesomeIcon icon={faLocationArrow} className="size-4" />
                      On campus
                    </span>
                    <span className="text-gray-600">
                      {lot.Floors?.some(floor => floor.Features?.includes('Covered')) ? "🏢 Covered" : "🌤️ Open Air"}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600">Availability</span>
                      <span className="text-gray-900">
                        {lot.AvailableSpots} of {lot.TotalSpots} spots
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getAvailabilityColor(lot.AvailableSpots, lot.TotalSpots)} transition-all`}
                        style={{ width: `${(lot.AvailableSpots / lot.TotalSpots) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-gray-900">Free</p>
                      <p className="text-sm text-gray-500">No hourly fee</p>
                    </div>
                    <Button className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800">Reserve Now</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href={`/${campusShortName}/map`}>
            <Button size="lg" className="px-8 border-2  hover:border-black transition-colors hover:bg-white hover:text-black cursor-pointer">
              View Map
            </Button>
          </Link>
        </div>
      </HorizontalWrap>
    </section>
  );
}
