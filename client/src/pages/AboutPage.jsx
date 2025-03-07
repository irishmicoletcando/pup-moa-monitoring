import Navbar from "@/components/layout/Navbar";
import { FileText, FileSpreadsheet } from "lucide-react";

// Role color mapping
const roleColors = {
  "Project Manager": "bg-slate-50 text-slate-700",
  "Full Stack Developer": "bg-slate-50 text-slate-700",
  "Frontend Developer": "bg-slate-50 text-slate-700",
  "Backend Developer": "bg-slate-50 text-slate-700",
  "UI/UX Designer": "bg-slate-50 text-slate-700",
  "Quality Assurance Engineer": "bg-slate-50 text-slate-700",
};

const contributors = [
  {
    name: "Jelisha Ruth Bugnon",
    role: "Project Manager",
    image: "/about-images/Bugnon_Jelisha.jpg",
    initials: "JB",
  },
  {
    name: "Irish Micole Cando",
    role: "Full Stack Developer",
    image: "/about-images/Bugnon_Jelisha.jpg",
    initials: "IC",
  },
  {
    name: "John Ric Merque",
    role: "Backend Developer",
    image: "/about-images/Merque_John_Ric.png",
    initials: "JM",
  },
  {
    name: "Jo Lyndon Relleve",
    role: "Backend Developer",
    image: "/about-images/Bugnon_Jelisha.jpg",
    initials: "LR",
  },
  {
    name: "Christian Kevin De Vega",
    role: "Backend Developer",
    image: "/about-images/Bugnon_Jelisha.jpg",
    initials: "CV",
  },
  {
    name: "Angela Corpuz",
    role: "Frontend Developer",
    image: "/about-images/Bugnon_Jelisha.jpg",
    initials: "AC",
  },
  {
    name: "Ma. Jensen Nicole Dela Rosa",
    role: "Quality Assurance Engineer",
    image: "/about-images/Bugnon_Jelisha.jpg",
    initials: "NR",
  },
  {
    name: "Adrian Esquerra",
    role: "UI/UX Designer",
    image: "/about-images/Esguerra_Adrian.png",
    initials: "AE",
  },
];

export default function About() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-x-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">About</h1>
            </div>
          </div>
          <div className="w-full">
            {/* About Section */}
            <div className="mt-4 w-full mx-auto">
              <p className="text-gray-600 text-justify mb-12 bg-">
                The PUP MOA Monitoring System is an optimized platform designed to track, manage, and maintain
                Memorandums of Agreement (MOAs) for the Polytechnic University of the Philippines. It provides a user-friendly interface for end-users to efficiently track and manage MOAs to stay organized and ensure seamless monitoring experience. 🚀
              </p>
            </div>

            {/* How to Use Section */}
            <div className="mt-8 w-full mx-auto">
              <h4 className="text-xl md:text-2xl font-bold mb-6 bg-">How to Use the PUPMMS?</h4>
              <p className="text-gray-600 text-justify mb-6">
                To effectively use the PUP MOA Monitoring System, refer to the guides below. The User Manual provides
                instructions for end-users, the Developer Manual includes technical details, and the Excel file contains
                the accurate column names in importing excel. It is recommended to use the PUPMMS Excel file as a difference in column names may likely cause issues.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/files/PUPMMS-User-Manual.pdf"
                  download
                  className="bg-red text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-maroon w-full sm:w-auto justify-center"
                >
                  <FileText size={20} /> User Manual
                </a>
                {/* <a
                    href="/files/Developer_Manual.pdf"
                    download
                    className="bg-red text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-maroon w-full sm:w-auto justify-center"
                >
                    <FileText size={20} /> Developer Manual
                </a> */}
                <a
                  href="/files/PUPMMS_Excel.xlsx"
                  download
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 w-full sm:w-auto justify-center"
                >
                  <FileSpreadsheet size={20} /> PUPMMS Excel File
                </a>
              </div>

            </div>

            {/* Contributors Section */}
            <div className="mt-12 mb-12 w-full mx-auto">
              <h4 className="text-xl md:text-2xl font-bold mb-6">Contributors</h4>
              <p className="text-gray-600 text-justify mb-6">
                The developers and contributors to this system are Bachelor of
                Science in Computer Engineering students from Section BSCOE 4-2, Batch 2021. This system is part of
                the Database System Implementation (CMPE 40173) course requirement under Engr. Florinda Oquindo,
                Associate Professor II, Director of Alumni Relations and Career Development. Below are the developers and contributors of the PUP MOA Monitoring System, along with their respective roles.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-b from-white to-gray-50 rounded-lg p-6 text-center transform transition-all duration-300 hover:shadow-md border border-gray-200"
                  >
                    <div className="flex justify-center mb-4">
                      {/* <div className="rounded-full p-1">
                        <div className="relative w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden">
                          <img
                            src={contributor.image || "/placeholder.svg"}
                            alt={contributor.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                              e.currentTarget.nextElementSibling.style.display = "flex"
                            }}
                          />
                          <div className="absolute inset-0 bg-gray-50 text-gray-700 text-2xl font-semibold hidden items-center justify-center">
                            {contributor.initials}
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <p className="font-semibold text-md mb-2 text-gray-800">{contributor.name}</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium ${roleColors[contributor.role]}`}
                    >
                      {contributor.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}