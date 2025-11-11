import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCalendarDays,
  faLocationArrow,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import HorizontalWrap from "./HorizontalWrap";

const steps = [
  {
    icon: faMagnifyingGlass,
    title: "Search for Parking",
    description:
      "Enter your destination or browse available lots near your classes.",
    number: "01",
  },
  {
    icon: faCalendarDays,
    title: "Choose Your Spot",
    description:
      "Select the perfect spot based on price, distance, and availability.",
    number: "02",
  },
  {
    icon: faLocationArrow,
    title: "Get Directions",
    description:
      "Navigate directly to your reserved spot with built-in GPS guidance.",
    number: "03",
  },
  {
    icon: faCheckCircle,
    title: "Park & Go",
    description:
      "Simply park and head to class. Payment is handled automatically.",
    number: "04",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-blue-50">
      <HorizontalWrap>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4 text-3xl font-bold">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to hassle-free parking on campus.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative inline-block mb-6">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                  <FontAwesomeIcon
                    icon={step.icon}
                    className="text-blue-600 text-3xl"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-gray-900 mb-2 font-semibold text-lg">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <span className="text-gray-600">⏱️ Average booking time:</span>
            <span className="text-blue-600 font-semibold">
              Under 30 seconds
            </span>
          </div>
        </div>
      </HorizontalWrap>
    </section>
  );
}
