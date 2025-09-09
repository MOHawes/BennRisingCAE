import React from "react";

const UprightPage = (props) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            UpRight Education
          </h1>
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Coders of Bennington Rising
          </h1>
        </div>
        
        {/* Main Content Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
          <p className="text-gray-700 mb-6 text-lg">
            Computer coders in the UpRight program built the webpages and team matching program for Bennington Rising. We think they did a superb job and are grateful for their dedication. Take a moment to celebrate their efficient layout and effective functionality.
          </p>

          <p className="text-gray-700 mb-8">
            UpRight gives individuals interested in careers in computer coding the real-world, project-based experiences needed to sharpen their skills and advance. ...blurb about UpRight written by UpRight.
          </p>

          {/* Horizontal line separator */}
          <hr className="my-8 border-gray-300" />

          {/* Links Section */}
          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4">
            Learn More About UpRight
          </h2>

          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li>
              <a 
                href="https://www.uprighted.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#1b0a5f] hover:underline font-semibold"
              >
                Upright Education Homepage
              </a>
            </li>
            <li>
              Links to exciting Upright classes being offered in the fall (classes open after Sept 10)
            </li>
          </ul>

          {/* Contact Section */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
            <h3 className="font-semibold text-lg mb-2 text-[#1b0a5f]">For Businesses:</h3>
            <p className="text-gray-700">
              Interested in engaging UpRight students in your company's projects, contact 
+1 (802) 770-8957 <br /> or, info@uprighted.com

            </p>
          </div>

          {/* Horizontal line separator */}
          <hr className="my-8 border-gray-300" />

          {/* Programmers Section */}
          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4">
            Meet the Developers
          </h2>

          <p className="text-gray-700 mb-6">
            QR codes for the LinkedIn accounts for the programmers of the Bennington Rising platform
          </p>

          {/* Placeholder for developer info/QR codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="w-32 h-32 bg-gray-300 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">[QR Code]</span>
              </div>
              <h3 className="font-semibold">Developer Name</h3>
              <p className="text-sm text-gray-600">LinkedIn Profile</p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="w-32 h-32 bg-gray-300 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">[QR Code]</span>
              </div>
              <h3 className="font-semibold">Developer Name</h3>
              <p className="text-sm text-gray-600">LinkedIn Profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UprightPage;