

import { Card,CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const team = [
  {
    name: "Aaron Jung",
    role: "Full Stack Developer",
    image: "/team/Aaron.jpg",
    bio: "PNW3D.com founder and CS major"
  },
  {
    name: "Jih Bin Luo",
    role: "Full Stack Developer",
    image: "/team/Jih.jpg",
    bio: "FullStack developer passionate about building impactful applications"
  },
  {
    name: "Justin Meng",
    role: "BackEnd Developer",
    image: "/team/Justin.jpg",
    bio: "CS student focused on scalable backend systems"
  },
  {
    name: "Isabella Sosa",
    role: "FrontEnd Developer",
    image: "/team/isa.jpg",
    bio: "CS student with a passion for UI/UX design"
  }
];

export default function TeamGrid() {
  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-gray-900 mb-4 text-3xl">
          Meet the Team
        </h2>
        <p className="text-xl text-gray-600 max-w-xl mx-auto">
          Built by students, for students. We understand the parking struggle.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm text-blue-600 mb-2">{member.role}</p>
              <p className="text-sm text-gray-600">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
