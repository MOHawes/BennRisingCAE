import React from "react";
import HomepageCardDisplay from "../components/public-views/HomepageCardDisplay";

const MentorsPage = (props) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Bennington Rising Program
          </h1>
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Team Coordinators
          </h1>
          
        </div>
        {/* Program Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
          <p className="text-gray-700 mb-6">
            We are thrilled you're part of the Bennington Rising Program. This
            program was developed to empower youth and local college students to
            positively impact the Bennington Community through structured
            collaboration.
          </p>

          <p className="text-gray-700 mb-6">
            You will be part of a three person team including two Bennington
            College Freshman (Team Coordinators) and a local middle or high
            school student (Team Fellow). There will be 16 to 20 teams working
            on projects in two areas: What's in your food? & Kid's for science!.
          </p>

          <p className="text-gray-700 mb-6">
            You will need to build your teams card (bios, question, etc.) on the
            digital platform so that interested Team Fellows can apply to join
            your team based upon shared interests or growth opportunities.
          </p>

          <p className="text-gray-700 mb-6">
            The Bennington Rising Program will give you real-world experience in
            team-based, community programming. <u>Such experience is preferred by
            employers</u> because it builds teamwork skills, expands communication
            abilities, and sharpens creative problem solving. This is a unique
            opportunity to build your resume and deliver real impact in
            Bennington.
          </p>

          <p className="text-gray-700 mb-6">
            To ease your comfort, as part of the program you will receive some
            light training on managing a team and leading folks. Reviewing these
            three videos is a mandatory part of the training;
          </p>

          {/* Training Videos Section */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 className="font-semibold text-lg mb-3 text-[#1b0a5f]">Required Training Videos:</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-2xl mr-3">🎥</span>
                <a href="https://www.youtube.com/watch?v=VOXrpW-rotE" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-[#1b0a5f] hover:underline font-semibold">
                  Learning Leadership Skills
                </a>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">🎥</span>
                <a href="https://www.youtube.com/watch?v=aDMtx5ivKK0" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-[#1b0a5f] hover:underline font-semibold">
                  Active Listening Techniques
                </a>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">🎥</span>
                <a href="https://www.youtube.com/watch?v=3uqMQ2WzZr8" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-[#1b0a5f] hover:underline font-semibold">
                  Conflict Management Strategies
                </a>
              </li>
            </ul>
          </div>

          <p className="text-gray-700 mb-6">
            The program involves two project development events at Bennington
            College. These events will bring your team together for several
            hours to develop your project.
          </p>

          <p className="text-gray-700 mb-8">
            The project also involves a community activity, either delivering
            science concepts to an elementary class or presenting at the "What's
            in your food" gala at the Bennington Museum.
          </p>

          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4 mt-8">LINKS</h2>

          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li>Team Coordinators role document</li>
            <li>
              Meeting Log- mandatory for each team meeting
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Excel format</li>
                <li>PDF format</li>
              </ul>
            </li>
            <li>Team member safety acknowledgement</li>
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
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Meet our Teams
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We are thrilled you're part of Bennington Rising. Thank you.
          </p>
        </div>

        {/* Mentors Display */}
        <div className="max-w-6xl mx-auto">
          <HomepageCardDisplay token={props.token} />
        </div>
      </div>
    </div>
  );
};

export default MentorsPage;