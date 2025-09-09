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
  const [parentEmail, setParentEmail] = useState('');
  const [confirmParentEmail, setConfirmParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [consentDecision, setConsentDecision] = useState('');
  const [pdfViewed, setPdfViewed] = useState(false);
  
  // Extract first name from menteeName
  const menteeFirstName = matchInfo?.menteeName?.split(' ')[0] || '';
  
  // PDF URL - Update this with your actual PDF location
  const pdfUrl = '/consent-form.pdf';
  
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
  
  // Handle checkbox selection (only one at a time)
  const handleConsentChange = (value) => {
    // If clicking the same checkbox, uncheck it
    if (consentDecision === value) {
      setConsentDecision('');
    } else {
      setConsentDecision(value);
    }
  };

  // Email validation helper
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation helper
  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!parentName.trim()) {
      setError('Parent/guardian name is required');
      return;
    }

    if (!parentEmail.trim()) {
      setError('Parent/guardian email is required');
      return;
    }

    if (!validateEmail(parentEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!confirmParentEmail.trim()) {
      setError('Please confirm your email address');
      return;
    }

    if (parentEmail !== confirmParentEmail) {
      setError('Email addresses do not match');
      return;
    }

    if (!parentPhone.trim()) {
      setError('Parent/guardian phone number is required');
      return;
    }

    if (!validatePhone(parentPhone)) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!emergencyContactName.trim()) {
      setError('Emergency contact name is required');
      return;
    }

    if (!emergencyContactPhone.trim()) {
      setError('Emergency contact phone number is required');
      return;
    }

    if (!validatePhone(emergencyContactPhone)) {
      setError('Please enter a valid emergency contact phone number');
      return;
    }

    if (!emergencyContactRelation.trim()) {
      setError('Emergency contact relationship is required');
      return;
    }

    if (!consentDecision) {
      setError('Please select a consent option');
      return;
    }
    
    if (!pdfViewed) {
      setError('Please confirm that you have viewed the consent form PDF');
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
          childName: matchInfo?.menteeName || 'Not provided',
          guardianEmail: parentEmail,
          guardianPhone: parentPhone,
          emergencyContactName: emergencyContactName,
          emergencyContactPhone: emergencyContactPhone,
          emergencyContactRelation: emergencyContactRelation,
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
      <div className="max-w-4xl mx-auto">
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
        
        {/* PDF Viewer Section - Thumbnail */}
        <div className="bg-amber-50 border-2 border-amber-300 shadow-md rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            {/* PDF Thumbnail */}
            <div className="flex-shrink-0">
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <iframe
                  src={pdfUrl}
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
                  Program Consent Form (PDF)
                </h3>
                <span className="text-xs text-amber-700 font-medium bg-amber-200 px-2 py-1 rounded">
                  Required Reading
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                Please review the full consent form before proceeding.
              </p>
              
              <div className="flex gap-4 text-sm">
                <a 
                  href={pdfUrl} 
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  🔗 Open PDF
                </a>
                <a 
                  href={pdfUrl} 
                  download
                  className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  ⬇️ Download
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Consent Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Welcome message with mentee's first name */}
            {menteeFirstName && (
              <div className="text-center mb-4">
                <p className="text-lg text-gray-700">
                  Please complete this consent form for <strong>{menteeFirstName}</strong>'s participation in the Bennington Rising Program.
                </p>
              </div>
            )}
            
            {/* Parent/Guardian Name */}
            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                Parent/guardian full legal name: <span className="text-red-500">*</span>
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

            {/* Parent Email */}
            <div>
              <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                Parent/guardian email address: <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="parentEmail"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                placeholder="parent@example.com"
                required
              />
            </div>

            {/* Confirm Parent Email */}
            <div>
              <label htmlFor="confirmParentEmail" className="block text-sm font-medium text-gray-700">
                Confirm email address: <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="confirmParentEmail"
                value={confirmParentEmail}
                onChange={(e) => setConfirmParentEmail(e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 ${
                  confirmParentEmail && parentEmail !== confirmParentEmail ? 'border-red-500' : ''
                }`}
                placeholder="parent@example.com"
                required
              />
              {confirmParentEmail && parentEmail !== confirmParentEmail && (
                <p className="text-red-500 text-sm mt-1">Email addresses do not match</p>
              )}
            </div>
            
            {/* Parent Phone */}
            <div>
              <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">
                Parent/guardian phone number: <span className="text-red-500">*</span>
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

            {/* Emergency Contact Section */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                Emergency Contact Information <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Please provide a secondary emergency contact (someone other than yourself) who can be reached if needed.
              </p>
              
              <div className="space-y-4">
                {/* Emergency Contact Name */}
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                    Emergency contact full name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700">
                    Emergency contact phone number: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                {/* Emergency Contact Relationship */}
                <div>
                  <label htmlFor="emergencyContactRelation" className="block text-sm font-medium text-gray-700">
                    Relationship to child: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="emergencyContactRelation"
                    value={emergencyContactRelation}
                    onChange={(e) => setEmergencyContactRelation(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Aunt/Uncle">Aunt/Uncle</option>
                    <option value="Family Friend">Family Friend</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other Relative">Other Relative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* PDF Viewed Confirmation */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={pdfViewed}
                  onChange={(e) => setPdfViewed(e.target.checked)}
                  className="mt-1 mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  I confirm that I have reviewed the Bennington Rising Program consent form PDF above <span className="text-red-500">*</span>
                </span>
              </label>
            </div>
            
            {/* Consent Decision with colored checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Check one of the following: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {/* Approve checkbox - Green */}
                <label className="flex items-start cursor-pointer hover:bg-green-50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={consentDecision === 'approve'}
                    onChange={() => handleConsentChange('approve')}
                    className="mt-1 mr-3 h-5 w-5 text-green-600 border-green-300 rounded focus:ring-green-500"
                    style={{
                      accentColor: '#16a34a'
                    }}
                  />
                  <span className="text-sm text-gray-700">
                    I approve my child's participation in the Bennington Rising Program
                  </span>
                </label>
                
                {/* Decline checkbox - Red */}
                <label className="flex items-start cursor-pointer hover:bg-red-50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={consentDecision === 'decline'}
                    onChange={() => handleConsentChange('decline')}
                    className="mt-1 mr-3 h-5 w-5 text-red-600 border-red-300 rounded focus:ring-red-500"
                    style={{
                      accentColor: '#dc2626'
                    }}
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