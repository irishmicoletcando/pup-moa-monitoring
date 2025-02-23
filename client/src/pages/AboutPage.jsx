import Navbar from "@/components/layout/Navbar"

// Role color mapping
const roleColors = {
  "Project Manager": "bg-slate-50 text-slate-700",
  "Full Stack Developer": "bg-slate-50 text-slate-700",
  "Frontend Developer": "bg-slate-50 text-slate-700",
  "Backend Developer": "bg-slate-50 text-slate-700",
  "UI/UX Designer": "bg-slate-50 text-slate-700",
  "Quality Assurance Engineer": "bg-slate-50 text-slate-700",
}

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
    name: "Nicole Dela Rosa",
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

]

export default function Admin() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-x-auto">
        <div className="p-6">
          <div className="container mx-auto p-4">
            {/* Contributors Section */}
            <div className="mt-4 w-[80vw] mx-auto">
              <div className="">
                <h2 className="text-xl md:text-3xl font-bold text-center mb-6">About</h2>
                <p className="text-gray-600 text-justify mb-12">
                  The PUP MOA Monitoring System is an optimized platform designed to track, manage, and maintain
                  Memorandums of Agreement (MOAs). The developers and contributors to this system are Bachelor of
                  Science in Computer Engineering students from Section BSCOE 4-2, Batch 2025. This system is part of
                  the Database System Implementation (CMPE 40173) course requirement under Engr. Florinda Oquindo,
                  Associate Professor II, Director of Alumni Relations and Career Development.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 text-center transform transition-all duration-300 
                             hover:shadow-md border border-gray-100"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full p-1">
                        <div className="relative w-32 h-32 rounded-full border-2 border-gray-200 overflow-hidden">
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
                      </div>
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
  )
}

