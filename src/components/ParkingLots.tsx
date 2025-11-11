

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin, faLocationArrow } from "@fortawesome/free-solid-svg-icons";

import HorizontalWrap from "./HorizontalWrap";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const parkingLots = [
  {
    name: "Central Campus Garage",
    address: "123 University Ave",
    distance: "0.2 miles",
    available: 24,
    total: 150,
    price: "$5/day",
    image: "https://images.unsplash.com/photo-1762398948143-85d8293c4ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwYXJraW5nJTIwc3RydWN0dXJlfGVufDF8fHx8MTc2Mjg5NTQ0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    covered: true,
    hourlyRate: "$2/hour"
  },
  {
    name: "North Lot",
    address: "456 College St",
    distance: "0.5 miles",
    available: 48,
    total: 200,
    price: "$3/day",
    image: "https://images.unsplash.com/photo-1759092563843-6e17aa286dfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwcGFya2luZ3xlbnwxfHx8fDE3NjI4OTU0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    covered: false,
    hourlyRate: "$1.50/hour"
  },
  {
    name: "Stadium Parking",
    address: "789 Athletic Dr",
    distance: "0.8 miles",
    available: 156,
    total: 500,
    price: "$2/day",
    image: "https://images.unsplash.com/photo-1759092563843-6e17aa286dfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwcGFya2luZ3xlbnwxfHx8fDE3NjI4OTU0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    covered: false,
    hourlyRate: "$1/hour"
  }
];

export default function ParkingLots() {
  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 30) return "bg-green-500";
    if (percentage > 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAvailabilityBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 30) return { variant: "default" as const, text: "Available" };
    if (percentage > 10) return { variant: "secondary" as const, text: "Limited" };
    return { variant: "destructive" as const, text: "Almost Full" };
  };

  return (
    <section id="locations" className="py-20 bg-white">
      <HorizontalWrap>
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">
            Popular Campus Parking Locations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse available parking near your classes. Updated in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parkingLots.map((lot, index) => {
            const badge = getAvailabilityBadge(lot.available, lot.total);
            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={lot.image}
                    alt={lot.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    variant={badge.variant}
                    className="absolute top-4 right-4"
                  >
                    {badge.text}
                  </Badge>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-900 mb-1">{lot.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FontAwesomeIcon icon={faMapPin} className="size-4" />
                        {lot.address}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <FontAwesomeIcon icon={faLocationArrow} className="size-4" />
                      {lot.distance} away
                    </span>
                    <span className="text-gray-600">
                      {lot.covered ? "🏢 Covered" : "🌤️ Open Air"}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600">Availability</span>
                      <span className="text-gray-900">
                        {lot.available} of {lot.total} spots
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getAvailabilityColor(lot.available, lot.total)} transition-all`}
                        style={{ width: `${(lot.available / lot.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-gray-900">{lot.price}</p>
                      <p className="text-sm text-gray-500">{lot.hourlyRate}</p>
                    </div>
                    <Button>Reserve Now</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </HorizontalWrap>
    </section>
  );
}
