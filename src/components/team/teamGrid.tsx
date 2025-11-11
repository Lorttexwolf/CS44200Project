

import { Card,CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const team = [
  {
    name: "Alex Chen",
    role: "Co-Founder & CEO",
    image: "https://images.unsplash.com/photo-1741637335289-c99652d3155f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHdhbGtpbmclMjBjYW1wdXN8ZW58MXx8fHwxNzYyODk1NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bio: "CS major, frustrated with campus parking"
  },
  {
    name: "Sarah Martinez",
    role: "Co-Founder & CTO",
    image: "https://images.unsplash.com/photo-1741637335289-c99652d3155f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHdhbGtpbmclMjBjYW1wdXN8ZW58MXx8fHwxNzYyODk1NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bio: "Engineering student who missed too many classes"
  },
  {
    name: "Jordan Lee",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1741637335289-c99652d3155f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHdhbGtpbmclMjBjYW1wdXN8ZW58MXx8fHwxNzYyODk1NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bio: "Business major making parking easier for everyone"
  },
  {
    name: "Taylor Kim",
    role: "Lead Designer",
    image: "https://images.unsplash.com/photo-1741637335289-c99652d3155f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHdhbGtpbmclMjBjYW1wdXN8ZW58MXx8fHwxNzYyODk1NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bio: "Design student creating intuitive experiences"
  }
];

export default function TeamGrid() {
  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-gray-900 mb-4">
          Meet the Team
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
