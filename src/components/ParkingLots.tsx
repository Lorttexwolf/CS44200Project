'use client';

import { faLocationArrow, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGoogleMapsDirections } from "@/hooks/useMap";
import { useParkingLots } from "@/hooks/useParkingLots";
import useWeather from "@/hooks/useWeather";
import { Campus } from "@/models/Campus";
import { ParkingLot } from "@/models/ParkingLot";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import HorizontalWrap from "./HorizontalWrap";
import { Card, CardContent, CardHeader } from "./ui/card";

const getAvailabilityColor = (available: number, total: number) => {
  const percentage = (available / total) * 100;
  if (percentage > 30) return "bg-green-500";
  if (percentage > 10) return "bg-yellow-500";
  return "bg-red-500"
};

const getAvailabilityBadge = (available: number, total: number) => {
  const percentage = (available / total) * 100;
  if (percentage > 30) return { variant: "default" as const, text: "Available", color: "bg-green-100 text-green-800 border border-green-300" };
  if (percentage > 10) return { variant: "secondary" as const, text: "Limited", color: "bg-yellow-100 text-yellow-800 border border-yellow-300" };
  return { variant: "destructive" as const, text: "Almost Full", color: "bg-red-100 text-red-800 border border-red-300" };
};

export default function ParkingLots({ campusID, campusShortName }: { campusID: Campus["ID"], campusShortName: string }) {
  // Fetch parking lots from database (campusId = 1)
  const { parkingLots, loading, error } = useParkingLots(campusID);

  // Get 3 most popular (lowest availability percentage)
  const topLots = [...parkingLots]
    .sort((a, b) => (a.AvailableSpots / a.TotalSpots) - (b.AvailableSpots / b.TotalSpots))
    .slice(0, Math.min(parkingLots.length, 6));

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
            Campus Parking Locations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse available parking at the {campusShortName} Campus.
          </p>
        </div>

        {parkingLots.length === 0 ? <p className="text-center w-full">None Available</p> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parkingLots.map((lot) => <Lot key={lot.ID} lot={lot} />)}
        </div>}
      </HorizontalWrap>
    </section>
  );
}

function Lot({ lot }: { lot: ParkingLot }) {

  const getDirectionsUrl = useGoogleMapsDirections();
  const weather = useWeather(lot.Latitude, lot.Longitude);

  const badge = getAvailabilityBadge(lot.AvailableSpots, lot.TotalSpots);
  const isCovered = lot.Floors?.some(floor => floor.Features?.includes('Covered'));

  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-50">
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
        <div className="flex max-md:flex-col items-center justify-between text-xs gap-3">
          <span className="text-gray-600 flex items-center text-nowrap gap-1">
            <FontAwesomeIcon icon={faLocationArrow} className="size-4" />
            On Campus
          </span>
          <span className="text-gray-600 text-right">

            {(!isCovered && weather.forecast && !weather.isPending) ? <>

              <div className="flex gap-1 items-center">

                {/* <img src={weather.forecast.icon.split(",").at(0)} className="rounded-full h-4" /> */}

                {weather.forecast.shortForecast} {weather.forecast.temperature}° {weather.forecast.temperatureUnit}

              </div>

            </> : "🏢 Covered"}

            {/* {lot.Floors?.some(floor => floor.Features?.includes('Covered')) ? "🏢 Covered" : "🌤️ Open Air"} */}

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

          {!expanded && lot.Floors && lot.Floors.length > 1 && <div 
            className="flex gap-1.5 text-gray-600 text-sm opacity-75 hover:opacity-100 cursor-pointer mt-3"
            onClick={() => setExpanded(true)}>

            <p className="text-gray-600 text-sm button">+ See Floors</p>
            
          </div>}

          {expanded && lot.Floors && lot.Floors.length > 1 && (
            <div className="border-t pt-2">
              {lot.Floors.map((floor, idx: number) => (
                <div key={idx} className="mb-2">

                  <div className="flex gap-2 items-center mb-2">

                    <div className="text-nowrap text-gray-600">
                      <span className="text-xs">{floor.FloorName} </span>
                      <span className="text-xs font-medium">{" "}({floor.AvailableSpots} / {floor.TotalSpots})</span>
                    </div>

                    <div className=" bg-gray-200 rounded-full h-2 mt-1 w-full">
                      <div
                        className={`h-full rounded-full w-full  ${getAvailabilityColor(floor.AvailableSpots, floor.TotalSpots)}`}
                        style={{ width: `${(floor.AvailableSpots / floor.TotalSpots) * 100}%` }}
                      />
                    </div>

                  </div>
                  
                  {floor.Features && floor.Features.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {floor.Features.map((feature: string, idx: number) => (
                        <span key={idx} className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {expanded && lot.Floors && lot.Floors.length > 1 && <div 
            className="flex gap-1.5 text-gray-600 text-sm opacity-75 hover:opacity-100 cursor-pointer mt-3"
            onClick={() => setExpanded(false)}>

            <p className="text-gray-600 text-sm button">- Hide Floors</p>
            
          </div>}
          
        </div>

        <div className="pt-4 border-t">
          <a
            href={getDirectionsUrl(lot.Latitude, lot.Longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded font-medium text-sm transition-colors"
          >
            Get Directions
          </a>
        </div>
      </CardContent>
    </Card>
  );
}