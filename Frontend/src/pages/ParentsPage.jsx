import React from "react";

const ParentsPage = (props) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Bennington Rising Program
          </h1>
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Parent/Guardian Page
          </h1>
        </div>

        {/* Program Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
          {/* PDF Viewer Section - Thumbnail */}
          <div className="bg-amber-50 border-2 border-amber-300 shadow-md rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              {/* PDF Thumbnail */}
              <div className="flex-shrink-0">
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  <iframe
                    src="/consent-form.pdf"
                    width="120"
                    height="150"
                    title="Consent Form PDF"
                    className="pointer-events-none"
                    scrolling="no"
                  >
                    <div className="w-[120px] h-[150px] bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📄</span>
                    </div>
                  </iframe>
                </div>
              </div>

              {/* PDF Info and Links */}
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-amber-900">
                    Parent Consent Information Sheet
                  </h3>
                  <span className="text-xs text-amber-700 font-medium bg-amber-200 px-2 py-1 rounded">
                    Important Document
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  Please review this consent form for important program
                  information.
                </p>

                <div className="flex gap-4 text-sm">
                  <a
                    href="/consent-form.pdf"
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔗 Open PDF
                  </a>
                  <a
                    href="/consent-form.pdf"
                    download
                    className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    ⬇️ Download
                  </a>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            We are thrilled you are considering enrolling your child in the{" "}
            <u className="font-semibold">FREE</u> Bennington Rising Program.
            This program was developed to empower youth and local college
            students to positively impact the Bennington Community through
            structured collaboration.
          </p>

          <p className="text-gray-700 mb-6">
            Your child (designated as a Team Fellow) will be part of a three
            person team including two Bennington College Freshman (Team
            Coordinators). There will be 16 to 20 teams working on projects in
            two areas: What's in your food? & Kids for science!. Your child can
            use the digital platform to read the bios of Team Coordinators and
            apply to be a Team Fellow of a particular team based upon shared
            interests or growth opportunities.
          </p>

          <p className="text-gray-700 mb-6">
            The Bennington Rising Program will give your child real-world
            experience in team-based, community programming.{" "}
            <u>
              Such experience is preferred by colleges and sought by employers
            </u>{" "}
            because it builds teamwork skills, expands communication abilities,
            and sharpens creative problem solving. This is a unique opportunity
            for your child to build their resume and deliver real impact in
            Bennington.
          </p>

          <p className="text-gray-700 mb-6">
            This is a <u>volunteer, extracurricular, after-school program.</u>{" "}
            Your child will be expected to dedicate the time required to deliver
            a successful community project- anticipated at 25 hours from
            September through November 2025.
          </p>

          <p className="text-gray-700 mb-6">
            The program involves two project development events at Bennington
            College. These events will be field trips during your child's normal
            school day with approval from the Southwestern Vermont Supervisory
            Union. The Bennington Rising Program will provide transportation
            from your child's school to the Bennington College and back. Please
            see the{" "}
            <a
              href="/important-dates"
              className="text-[#1b0a5f] hover:underline font-semibold"
            >
              "Important dates"
            </a>{" "}
            page for more details.
          </p>

          <p className="text-gray-700 mb-6">
            Consider the cumulative time (25 hours) and required event times
            (after school) of the Bennington Rising Program balanced against
            your child's others commitments (ex. sports, arts, work, etc.),{" "}
            <u>prior to consenting for your child's enrollment.</u> Please
            consider that there are only 13 slots available for middle and
            high-school students in this exciting program.
          </p>

          <p className="text-gray-700 mb-6">
            The Bennington Rising Program is FREE to participants and open to
            all. The program does not discriminate or treat people differently
            on the basis of race, color, marital status, national origin,
            religion, age, disability, sex, sexual orientation, and gender
            identity. We especially encourage students from underrepresented and underserved communities including but not limited to people of color, students who would be first-generation college students, and those from low-income backgrounds to join.
          </p>

          <p className="text-gray-700 mb-6">
            To consent your child's enrollment in Bennington{" "}
            <u>
              Rising click the link provided in the e-mail automatically
              generated by your child's application to the program
            </u>{" "}
            and follow the prompts. Look in your spam for this auto-generated
            e-mail.{" "}
          </p>
          <p className="text-gray-700 mb-6">
            The Parent/Guardian consent information sheet can be viewed at{" "}
            <a
              href="/consent-form.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff0000] hover:underline font-semibold"
            >
              this link
            </a>
            , or at the yellow highlighted section at the top of this page.
          </p>

          {/* Horizontal line separator */}
          <hr className="my-8 border-gray-300" />

          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4 mt-8">
            Contact Information
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
              <strong className="text-[#1b0a5f]">(508) 692-7948</strong>. Lack of
              cell service might prohibit receiving the call, please leave a
              message I will return your call as soon as possible. You can also
              try texting me if necessary.
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
      </div>
    </div>
  );
};

export default ParentsPage;
