import React from "react";
import HomepageCardDisplay from "../components/public-views/HomepageCardDisplay";

const MenteePage = (props) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Fellows:
          </h1>
        
        </div>
        {/* Program Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1b0a5f] mb-6 border-b-2 border-[#eab246] pb-2">
            Concept of the Program
          </h1>

          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li>Who developed the program</li>
            <li>Important dates</li>
            <li>Description of transportation</li>
            <li>
              Here's a guide on how to be a good team player. This program was
              developed using Mentoring principles. Although this is not a
              mentoring program, the advice for mentors is relevant to your
              experience in this program
            </li>
            <li>Log for documenting team gatherings</li>
            <li>Team coordinator consent</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4 mt-8">
            Contact Information
          </h2>

          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li>
              If you have questions or concerns you can e-mail{" "}
              <strong className="text-[#1b0a5f]">VISTA.svhealthcare@...</strong>
            </li>
            <li>
              If you have a concern that requires more immediate attention
              please contact James Trimarchi at{" "}
              <strong className="text-[#1b0a5f]">508 692 7948</strong>.
              Lack of cell service might prohibit receiving the call, please
              leave a message I will return your call as soon as possible. You
              can also try texting me if necessary.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-red-600 mb-4 mt-8">
            Emergency Contact
          </h2>

          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li className="text-red-600 font-semibold">
              In case of emergency CALL 911. DO NOT HESITATE!
            </li>
          </ul>
        </div>
       

        {/* </div> */}
      </div>
    </div>
  );
};

export default MenteePage;