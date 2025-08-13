import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_CONSENT_FORM_SUBMIT, API_CONSENT_FORM_INFO } from '../../constants/endpoints';

const ParentConsentForm = () => {
  const { matchRequestId } = useParams(); // Get match request ID from URL
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);
  const [error, setError] = useState('');
  
  // Form fields
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [consentDecision, setConsentDecision] = useState('');
  
  // Fetch match request info on load
  useEffect(() => {
    fetchMatchInfo();
  }, [matchRequestId]);
  
  const fetchMatchInfo = async () => {
    try {
      const response = await fetch(`${API_CONSENT_FORM_INFO}/${matchRequestId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load match information');
      }
      
      setMatchInfo(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching match info:', error);
      setError(error.message);
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!parentName || !childName || !parentEmail || !parentPhone || !consentDecision) {
      setError('Please fill in all fields and select a consent option');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`${API_CONSENT_FORM_SUBMIT}/${matchRequestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guardianName: parentName,
          childName: childName,
          guardianEmail: parentEmail,
          guardianPhone: parentPhone,
          approved: consentDecision === 'approve'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit consent form');
      }
      
      // Show success message
      alert(consentDecision === 'approve' 
        ? 'Thank you! Your consent has been recorded. Your child can now proceed with the match.'
        : 'Thank you for your response. We have recorded your decision.'
      );
      
      // Redirect to a thank you page or home
      navigate('/consent-submitted');
      
    } catch (error) {
      console.error('Error submitting consent:', error);
      setError(error.message);
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading consent form...</p>
        </div>
      </div>
    );
  }
  
  if (error && !matchInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">{error}</p>
          <p className="mt-4">Please contact support if you continue to have issues.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bennington Rising Program
          </h1>
          <h2 className="text-xl mt-2 text-gray-600">
            Parent/Guardian Consent Form
          </h2>
        </div>
        
        {/* Match Information */}
        {matchInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Your child <strong>{matchInfo.menteeName}</strong> has requested to join a project team with:
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  <strong>{matchInfo.mentorName}</strong> - {matchInfo.projectCategory} Project
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Consent Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parent/Guardian Name */}
            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                Parent/guardian full legal name:
              </label>
              <input
                type="text"
                id="parentName"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Child's Name */}
            <div>
              <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
                Child's name:
              </label>
              <input
                type="text"
                id="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Parent Email */}
            <div>
              <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                Parent/guardian email address:
              </label>
              <input
                type="email"
                id="parentEmail"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Parent Phone */}
            <div>
              <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">
                Parent/guardian phone number:
              </label>
              <input
                type="tel"
                id="parentPhone"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
                required
              />
            </div>
            
            {/* Consent Decision */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Check one of the following:
              </label>
              <div className="space-y-2">
                <label className="flex items-start">
                  <input
                    type="radio"
                    name="consent"
                    value="approve"
                    onChange={(e) => setConsentDecision(e.target.value)}
                    className="mt-1 mr-2"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I approve my child's participation in the Bennington Rising Program
                  </span>
                </label>
                
                <label className="flex items-start">
                  <input
                    type="radio"
                    name="consent"
                    value="decline"
                    onChange={(e) => setConsentDecision(e.target.value)}
                    className="mt-1 mr-2"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I do not approve of my child's participation in the Bennington Rising Program
                  </span>
                </label>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Additional Information */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>If you have any questions, please contact:</p>
          <p className="mt-1">
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
    </div>
  );
};

export default ParentConsentForm;