import React from "react";
import HomepageCardDisplay from "../components/public-views/HomepageCardDisplay";

const MenteePage = (props) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Bennington Rising Program
          </h1>
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Team Fellows 
          </h1>
        </div>
        {/* Program Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
          <p className="text-gray-700 mb-6">
            We are thrilled you're interested in being part of the Bennington
            Rising Program. This program was developed to empower youth and
            local college students to positively impact the Bennington Community
            through structured collaboration.
          </p>

          <p className="text-gray-700 mb-6">
            You will be part of a three person team including two Bennington
            College Freshman (Team Coordinators) and a local middle or high
            school student (Team Fellow- that's you!). There will be 16 to 20
            teams working on projects in two areas: What's in your food? & Kid's
            for science!.
          </p>

          <p className="text-gray-700 mb-6">
            You will need to submit an application to be part of Bennington
            Rising/ Follow the prompts on the main landing page. Fellows can
            apply to join your team based upon shared interests or growth
            opportunities.
          </p>

          <p className="text-gray-700 mb-6">
            The Bennington Rising Program will give you real-world experience in
            team-based, community programming. Such experience is preferred by
            employers because it builds teamwork skills, expands communication
            abilities, and sharpens creative problem solving. This is a unique
            opportunity to build your resume and deliver real impact in
            Bennington.
          </p>

          <p className="text-gray-700 mb-6">
            The program involves two project development events at Bennington
            College. These events will occur after your school's normal hours .
            The events will bring your team together for several hours to
            develop your project. Transportation from your school to Bennington
            College and back to your school will be provided.
          </p>

          <p className="text-gray-700 mb-8">
            The project also involves a community activity, either delivering
            science concepts to an elementary class or presenting at the "What's
            in your food" gala at the Bennington Museum.
          </p>

          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4 mt-8">LINKS</h2>

          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li>Team member safety acknowledgement</li>
            <li>Link to Parent Consent Information Sheet</li>
            <li>
              Meeting Log- mandatory for each team meeting
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Excel format</li>
                <li>PDF format</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4 mt-8">
            Questions and Emergencies
          </h2>

          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li>
              If you have questions or concerns you can e-mail{" "}
              <strong className="text-[#1b0a5f]">
                VISTA.svhealthcare@gmail.com
              </strong>
            </li>
            <li>
              If you have a concern that requires more immediate attention
              please contact James Trimarchi at{" "}
              <strong className="text-[#1b0a5f]">508 692 7948</strong>. Lack of
              cell service might prohibit receiving the call, please leave a
              message I will return your call as soon as possible. You can also
              try texting me if necessary.
            </li>
          </ul>

          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li className="text-red-600 font-semibold">
              In case of emergency CALL 911. DO NOT HESITATE!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenteePage;
