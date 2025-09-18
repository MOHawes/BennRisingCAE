// showing up on the mentees dashboard
import React, { useEffect, useState } from "react";
import { API_MENTEE_PROFILE_PREVIEW } from "../../constants/endpoints";

const MentorPreview = ({ token }) => {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        // First get the mentee's profile to find their approved mentors
        const response = await fetch(API_MENTEE_PROFILE_PREVIEW, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch mentee data");

        const data = await response.json();
        console.log("Mentee profile data:", data);

        // Check if mentee has approved mentors
        if (
          data.user &&
          data.user.approvedMentors &&
          data.user.approvedMentors.length > 0
        ) {
          // For now, we'll need to get the mentor details from the mentors list
          // In a real app, you might have a separate endpoint to get mentor details
          const mentorsResponse = await fetch(
            "https://bennrisingcae.onrender.com/user/mentor/view-all",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            }
          );

          if (mentorsResponse.ok) {
            const mentorsData = await mentorsResponse.json();
            const approvedMentorId = data.user.approvedMentors[0];
            const matchedMentor = mentorsData.mentors.find(
              (m) => m.id === approvedMentorId
            );

            if (matchedMentor) {
              setMentor(matchedMentor);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        setLoading(false);
      }
    };

    if (token) fetchMentorData();
  }, [token]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-900 dark:text-white">
        Loading...
      </div>
    );

  if (!mentor) {
    return (
      <div className="text-center mt-10 text-gray-900 dark:text-white">
        <p>No matched team yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Your Matched Team
      </h2>

      {/* Team Coordinators */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {/* Coordinator 1 */}
        <div className="flex flex-col items-center">
          <img
            src={
              mentor.profilePhoto1 ||
              mentor.profilePhoto ||
              "/images/blank-profile-picture-973460_1280.png"
            }
            alt={`${mentor.firstName}`}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-lg"
          />
          <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
            {mentor.firstName}
          </p>
        </div>

        {/* Coordinator 2 */}
        <div className="flex flex-col items-center">
          <img
            src={
              mentor.profilePhoto2 ||
              "/images/blank-profile-picture-973460_1280.png"
            }
            alt={`${mentor.lastName}`}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-lg"
          />
          <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
            {mentor.lastName}
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Team Email:
        </p>
        <a
          href={`mailto:${mentor.email}`}
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-lg"
        >
          {mentor.email}
        </a>
      </div>
    </div>
  );
};

export default MentorPreview;
