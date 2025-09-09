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
            <li><strong>9/17-9/23</strong> - Team Coordinator's develop virtual team cards</li>
            <li><strong>9/22, 12:30-1:30</strong> - Team Coordinator training at Bennington College</li>
            <li><strong>9/24-10/5</strong> - Open Enrollment for Team Fellows (middle and high school students)</li>
            <li><strong>Week of 10/13</strong> - (Date TBD) - Kickoff at Bennington College, first team in-person meeting, transportation provided for Fellows, dinner served by Bennington College</li>
            <li><strong>From 10/13-11/10</strong> - weekly team meetings (minimum 30 minutes) to develop deliverable</li>
            <li><strong>Week of 11/10</strong> - (Date TBD) - Second Team in-person meeting, transportation provided for Fellows</li>
          </ul>

          {/* Horizontal line separator */}
          <hr className="my-8 border-gray-300" />

          {/* What's in my food dates */}
          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4">
            What's in my food? key dates
          </h2>
          
          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li><strong>11/17</strong> - Install What's in my food? posters at Bennington Museum</li>
            <li><strong>11/20</strong> - What's in my food gala at Bennington Museum</li>
            <li><strong>11/28</strong> - Remove What's in my food? posters from Bennington Museum</li>
          </ul>

          {/* Horizontal line separator */}
          <hr className="my-8 border-gray-300" />

          {/* Kids for Science dates */}
          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4">
            Kids for Science! key dates
          </h2>
          
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li><strong>11/14 through 11/25</strong> - Deliver educational curriculum in Bennington Elementary School classes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportantDatesPage;