import React from "react";

const PartnersPage = (props) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Bennington Rising Program
          </h1>
          <h1 className="text-4xl font-bold text-[#1b0a5f] mb-4">
            Partners Page
          </h1>
        </div>

        {/* Partners Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
          <p className="text-gray-700 mb-6 text-lg">
            The following partners have made possible the Bennington Rising
            Program. <br /> Click the colored text to check out their links.
          </p>
          {/* Partner Organizations List */}
          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li>
              <a
                href="https://www.svhealthcare.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1b0a5f] hover:underline font-semibold"
              >
                Southwestern Vermont Medical Center
              </a>
              , a member hospital in Dartmouth Health
            </li>
            <li>
              <a
                href="https://www.bennington.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1b0a5f] hover:underline font-semibold"
              >
                Bennington College
              </a>
            </li>
            <li>
              <a
                href="https://americorps.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1b0a5f] hover:underline font-semibold"
              >
                AmeriCorps
              </a>
            </li>
            <li>
              <a
                href="https://www.servt.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1b0a5f] hover:underline font-semibold"
              >
                SerVermont
              </a>
            </li>
            <li>
              <a
                href="https://www.uprighted.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1b0a5f] hover:underline font-semibold"
              >
                UpRight
              </a>
              , coders for this web site
            </li>
            <li>
              <a
                href="https://svsu.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1b0a5f] hover:underline font-semibold"
              >
                Southwest Vermont Supervisory Union
              </a>
            </li>
            <li>
              <a
                href="https://benningtonmuseum.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1b0a5f] hover:underline font-semibold"
              >
                Bennington Museum
              </a>{" "}
              | Grandma Moses | Vermont History and Art
            </li>
          </ul>

          {/* Horizontal line separator */}
          <hr className="my-8 border-gray-300" />

          {/* Individuals Section */}
          <h2 className="text-2xl font-bold text-[#1b0a5f] mb-4 mt-8">
            Key Contributors
          </h2>

          <p className="text-gray-700 mb-6">
            The following individuals played an outsized role in developing and
            delivering the Bennington Rising Program
          </p>

          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>Faye MacDonald & Audrey Kim, AmeriCorps VISTAs</li>
            <li>Madeline Hawes and Nick Russotti</li>
            <li>Barbara Alfano, Bennington College</li>
            <li>Blake Jones, Bennington College</li>
            <li>Fortune Ononiwu, Bennington College</li>
            <li>Melissa Senecal, SVSU</li>
            <li>
              SVMC interns, Clarissa Louis (Williams College) & Iris Nofziger
              (Colgate University)
            </li>
            <li>James Trimarchi, SVMC</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;
