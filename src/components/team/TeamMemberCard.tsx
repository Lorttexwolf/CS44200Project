import Image from "next/image";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TeamMemberProps = {
    imageSrc: string;
    name: string;
    role: string;
    roleColor?: string;
    description: string;
    skills?: string[];
    email?: string;
    githubUrl?: string;
};

export default function TeamMemberCard({imageSrc, name, role, roleColor = "text-gray-600", description, skills = [], email, githubUrl}: TeamMemberProps) {
    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center hover:shadow-2xl hover:scale-105 transform transition duration-300">
            {/* Profile Picture */}
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
                <Image src={imageSrc} alt={name} fill className="object-cover"/>
            </div>

            {/* Name + Role */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
            <p className={`${roleColor} font-medium mb-4`}>{role}</p>

            {/* Bio */}
            <p className="text-gray-600 mb-4">{description}</p>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-1">Skills:</h4>
                    <ul className="flex flex-wrap justify-center gap-2">
                        {skills.map((skill, i) => (
                            <li
                                key={i}
                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Contact Info */}
            {email && (
                <p className="text-sm  mb-2 flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} className="w-5" />
                    <a href={`mailto:${email}`} className=" text-blue-500 underline">{email}</a>
                </p>
            )}

            {/* GitHub Link */}
            {githubUrl && (
                <p className="text-sm  flex items-center justify-center gap-2 mt-2">
                    <FontAwesomeIcon icon={faGithub} className="w-5" />
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-500 hover:text-black"
                    >
                        GitHub
                    </a>
                </p>
            )}
        </div>
    );
}
