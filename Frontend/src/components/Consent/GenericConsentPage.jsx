import React from 'react';
import { Link } from 'react-router-dom';

const GenericConsentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bennington Rising Program
          </h1>
          <h2 className="text-xl mt-2 text-gray-600">
            Parent/Guardian Consent Information
          </h2>
        </div>
        
        {/* Info Card */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-700">
                <strong>Note:</strong> This is a generic consent page. To complete an actual consent form, 
                you need to use the unique link sent to your email.
              </p>
            </div>
            
            <h3 className="text-xl font-semibold">About the Consent Process</h3>
            
            <p className="text-gray-700">
              When a student (Fellow) requests to join a mentor team in the Bennington Rising Program, 
              we require parent/guardian consent before proceeding with the match.
            </p>
            
            <h4 className="text-lg font-semibold mt-4">The Process:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Your child selects a mentor team they'd like to join</li>
              <li>You receive an email with a unique consent form link</li>
              <li>You have 48 hours to complete the consent form</li>
              <li>Once approved, your child can proceed with the mentorship</li>
            </ol>
            
            <h4 className="text-lg font-semibold mt-4">Required Information:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Parent/guardian full legal name</li>
              <li>Child's name</li>
              <li>Parent/guardian email address</li>
              <li>Parent/guardian phone number</li>
              <li>Consent decision (approve or decline)</li>
            </ul>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                <strong>Important:</strong> If you haven't received a consent email but believe you should have, 
                please check your spam folder or contact us using the information below.
              </p>
            </div>
          </div>
        </div>
        
        {/* Test Consent Form - Only in Development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Development Testing</h3>
            <p className="text-gray-700 mb-4">
              For testing purposes only - this section is not visible in production
            </p>
            <Link
              to="/consent/test-match-id"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Access Test Consent Form
            </Link>
          </div>
        )}
        
        {/* Contact Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            If you have questions about the consent process or haven't received your consent email, 
            please contact us:
          </p>
          <div className="space-y-2">
            <p>
              <a href="mailto:VISTA.svhealthcare@gmail.com" className="text-blue-600 hover:underline">
                VISTA.svhealthcare@gmail.com
              </a>
            </p>
            <p>
              <a href="mailto:james.trimarchi@svhealthcare.org" className="text-blue-600 hover:underline">
                james.trimarchi@svhealthcare.org
              </a>
            </p>
          </div>
        </div>
        
        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GenericConsentPage;