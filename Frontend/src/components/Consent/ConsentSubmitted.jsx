import React from "react";
import { Link } from "react-router-dom";

const ConsentSubmitted = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thank You!
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Your consent form has been successfully submitted.
          </p>
          <p className="mt-2 text-gray-600">
            We have sent a confirmation email to the address you provided.
          </p>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If you have any questions, please contact us at:</p>
          <p className="mt-2">
            <a
              href="mailto:VISTA.svhealthcare@gmail.com"
              className="text-blue-600 hover:underline"
            >
              VISTA.svhealthcare@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentSubmitted;
