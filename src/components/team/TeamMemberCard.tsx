import Image from "next/image";

type TeamMemberProps = {
  imageSrc: string;
  name: string;
  role: string;
  roleColor?: string; // optional, lets you pass different colors
  description: string;
};

export default function TeamMemberCard({
  imageSrc,
  name,
  role,
  roleColor = "text-gray-600", // fallback if none provided
  description,
}: TeamMemberProps) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
      <p className={`${roleColor} font-medium mb-4`}>{role}</p>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
