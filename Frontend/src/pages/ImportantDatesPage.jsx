import React from "react";

const ImportantDatesPage = (props) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Bennington Rising Program
          </h1>
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Important Dates
          </h1>
        </div>
        
        {/* Important Dates Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
          <p className="text-gray-700 mb-6 text-lg">
            The following are important dates for the Bennington Rising Program
          </p>

          {/* General Program Dates */}
          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li><strong>September 17-23</strong> - Team Coordinator's develop team cards online</li>
            <li><strong>September 22, 12:30-1:30</strong> - Team Coordinator training at Bennington College</li>
            <li><strong>September 24 - October 10</strong> - Team Fellows sign-up online</li>
            <li><strong>October 14, 12:30-2:00 PM</strong> - First team meeting at Bennington College. Transportation and lunch provided.</li>
            <li><strong>October 14 - November 14</strong> - Teams meet weekly to develop projects</li>
            <li><strong>November 14, 12:30-2:00 PM</strong> - Second Team meeting at Bennington College. Transportation and lunch provided.</li>
          </ul>

          {/* Horizontal line separator */}
          <hr className="my-8 border-gray-300" />

          {/* What's in my food dates */}
          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4">
            What's in my food? key dates
          </h2>
          
          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li><strong>November 17</strong> - Gallery of projects opens at Bennington Museum</li>
            <li><strong>November 20, 5:30 - 7:00 PM</strong> - Gala at Bennington Museum</li>
            <li><strong>November 28</strong> - Close of gallery</li>
          </ul>

          {/* Horizontal line separator */}
          <hr className="my-8 border-gray-300" />

          {/* Kids for Science dates */}
          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4">
            Kids for Science! key dates
          </h2>
          
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li><strong>November 17 - 21</strong> - Deliver educational curriculum in Bennington Elementary School classes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportantDatesPage;