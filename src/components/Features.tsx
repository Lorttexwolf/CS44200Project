import {
  faLocationArrow,
  faMagnifyingGlass,
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HorizontalWrap from "./HorizontalWrap";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: faMagnifyingGlass,
    title: "Search for Parking",
    description: "Select your campus and explore available parking lots near your destination.",
  },
  {
    icon: faLocationArrow,
    title: "Get Directions",
    description: "Navigate directly to the most convenient parking lot for your needs.",
  },
  {
    icon: faShieldHalved,
    title: "Safety Insights",
    description: "View details on well-lit and monitored parking areas designed to support student safety.",
  },
];


export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <HorizontalWrap>
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4 text-3xl font-bold">
            Everything You Need to Park Smart
          </h2>
          <p className="text-xl text-gray-600 mx-auto">
            Designed specifically for college students who need reliable and fast
            parking solutions.
          </p>
        </div>
        

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={feature.icon}
                    className="text-blue-600 text-2xl"
                  />
                </div>
                <h3 className="text-gray-900 mb-2 font-semibold text-lg">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
            
          ))}
          <div id="how-it-works" />
        </div>
      </HorizontalWrap>
    </section>
  );
}
