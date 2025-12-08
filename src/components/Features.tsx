import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapPin,
  faClock,
  faShieldHalved,
  faMobileScreenButton,
  faDollarSign,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import HorizontalWrap from "./HorizontalWrap";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: faMapPin,
    title: "Real-Time Availability",
    description:
      "See available spots in real-time across all campus parking lots and structures.",
  },

  {
    icon: faBell,
    title: "Smart Notifications",
    description:
      "Get alerts when spots open up near your classes.",
  },
  {
    icon: faShieldHalved,
    title: "Secure & Safe",
    description:
      "All parking locations are well-lit, monitored, and verified for student safety.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <HorizontalWrap>
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4 text-3xl font-bold">
            Everything You Need to Park Smart
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
        </div>
      </HorizontalWrap>
    </section>
  );
}
