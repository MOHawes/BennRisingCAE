const nodemailer = require("nodemailer");

// Check if we're in test mode
const TEST_MODE = process.env.EMAIL_TEST_MODE === "true";
const TEST_EMAIL = process.env.TEST_EMAIL_ADDRESS || "nickr967@gmail.com";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send emails
const sendEmail = async (to, subject, html) => {
  try {
    // In test mode, override recipient and add original recipient to subject
    let finalTo = to;
    let finalSubject = subject;

    if (TEST_MODE) {
      finalTo = TEST_EMAIL;
      finalSubject = `[TEST - Originally to: ${to}] ${subject}`;

      // Add a test mode banner to the email
      html = `
        <div style="background-color: #ff0; padding: 10px; margin-bottom: 20px; border: 2px solid #f00;">
          <strong>⚠️ TEST MODE EMAIL ⚠️</strong><br>
          Original recipient: ${to}<br>
          This email was redirected to the test address.
        </div>
        ${html}
      `;
    }

    const mailOptions = {
      from: `Bennington Rising Program <${process.env.EMAIL_USER}>`,
      to: finalTo,
      subject: finalSubject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Email sent: ${info.response} (${
        TEST_MODE ? "TEST MODE" : "PRODUCTION"
      } - Original to: ${to})`
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// #1 - Team Match Under Review (to Team Coordinator)
const sendMatchUnderReviewToMentor = async (
  mentorEmail,
  mentorFirstName,
  menteeData
) => {
  const subject = "Team Match Under Review -- Bennington Rising Program";

  const html = `
    <p>Dear ${mentorFirstName},</p>
    
    <p>We're excited to share that a potential team match for the Bennington Rising Program is currently under review!</p>
    
    <p>At this time, no action is required on your part. We are in the process of confirming participation with the Fellow's parent/guardian.</p>
    
    <p>In the meantime, you are welcome to review the Fellow's interests and background to get a sense of the match:</p>
    
    <blockquote style="background-color: #f0f0f0; padding: 15px; margin: 10px 0;">
      <strong>${menteeData.firstName} ${menteeData.lastName}</strong><br>
      <strong>Interests:</strong> ${menteeData.interests.join(", ")}<br>
      <strong>Answer to Question 1:</strong> ${
        menteeData.answer1 || "Not provided"
      }<br>
      <strong>Answer to Question 2:</strong> ${
        menteeData.answer2 || "Not provided"
      }
    </blockquote>
    
    <p>We'll follow up with next steps once the match is confirmed. Thank you for being a part of Bennington Rising and for your commitment to supporting our community's youth!</p>
    
    <p>Best,<br>
    The Bennington Rising Team<br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(mentorEmail, subject, html);
};

// #2 - Parent Consent Needed (to Mentee)
const sendConsentNeededToMentee = async (menteeEmail, menteeFirstName) => {
  const subject =
    "Your Bennington Rising Application Is Almost Ready -- Parent/Guardian Consent Needed";

  const html = `
    <p>Dear ${menteeFirstName},</p>
    
    <p>Thank you for applying to be a part of the Bennington Rising Program!</p>
    
    <p>Right now, your application is waiting for parent/guardian approval before we can move forward with your team project match.</p>
    
    <p>Please tell your parent/guardian to check their email for a message from The Bennington Rising Program. The email will include a consent form that your parent/guardian needs to complete and submit within 48 hours.</p>
    
    <p>Once we receive their approval, we'll confirm your team match and send you more details!</p>
    
    <p>If your parent/guardian didn't receive the email, please let us know right away so we can resend it.</p>
    
    <p>Thank you,<br>
    The Bennington Rising Team<br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(menteeEmail, subject, html);
};

// #3 - Consent Request (to Parent/Guardian)
const sendConsentRequestToGuardian = async (
  guardianEmail,
  menteeData,
  mentorData,
  consentFormUrl
) => {
  const subject =
    "Action Needed: Consent for Your Child's Participation in The Bennington Rising Program";

  // Log the consent URL for debugging
  console.log("Consent form URL being sent:", consentFormUrl);

  const html = `
    <p>Dear Parent/Guardian,</p>
    
    <p>Thank you for supporting your child's interest in the Bennington Rising Program!</p>
    
    <p>We are excited to let you know that your child has requested to join a project team! They have chosen:</p>
    
    <blockquote style="background-color: #f0f0f0; padding: 15px; margin: 10px 0;">
      <strong>${mentorData.firstName} ${mentorData.lastName}</strong><br>
      ${mentorData.bio ? `<em>${mentorData.bio}</em>` : ""}
    </blockquote>
    
    <p>To move forward, we need your consent for your child to participate in the program.</p>
    
    <div style="background-color: #e3f2fd; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
      <h3 style="color: #1976d2; margin-bottom: 15px;">Complete the Consent Form</h3>
      <p style="margin-bottom: 15px;">Please click the button below to access the consent form:</p>
      <a href="${consentFormUrl}" style="display: inline-block; background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Access Consent Form</a>
      <p style="margin-top: 15px; font-size: 12px; color: #666;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <span style="word-break: break-all;">${consentFormUrl}</span>
      </p>
    </div>
    
    <p><strong>Important:</strong> The form must be completed within 48 hours of receiving this email. Your child's application will be withdrawn after 48 hours if no response is received.</p>
    
    <p>For more information about the Bennington Rising Program, visit our website.</p>
    
    <p>If you have any questions or would like to speak with a member of our team, don't hesitate to reach out.</p>
    
    <p>Thank you,<br>
    The Bennington Rising Team<br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(guardianEmail, subject, html);
};

// #4 - Final Reminder (to Mentee)
const sendFinalReminderToMentee = async (menteeEmail, menteeFirstName) => {
  const subject = "Urgent: Final Reminder to Submit Consent Form";

  const html = `
    <p>Dear ${menteeFirstName},</p>
    
    <p>We're reaching out with an important update about your application for the Bennington Rising Program.</p>
    
    <p><strong>36 hours have passed</strong> since we sent the consent form to your parent/guardian. We have not yet received their approval. <strong>There are only 12 hours left</strong> to confirm your participation before your application expires.</p>
    
    <p>Please remind your parent/guardian to check their email for a message from The Bennington Rising Program and complete the form as soon as possible.</p>
    
    <p>If they're having trouble finding it or need the email resent, let us know right away!</p>
    
    <p>We're excited about your potential match and can't wait to move forward.</p>
    
    <p>Thank you,<br>
    The Bennington Rising Team<br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(menteeEmail, subject, html);
};

// #4 - Final Reminder (to Guardian)
const sendFinalReminderToGuardian = async (guardianEmail) => {
  const subject = "Urgent: Final Reminder to Submit Consent Form";

  const html = `
    <p>Dear Parent/Guardian,</p>
    
    <p>We're reaching out with an important update about your child's application for the Bennington Rising Program.</p>
    
    <p><strong>36 hours have passed</strong> since we sent the consent form, and we have not yet received a completed form. <strong>There are only 12 hours left</strong> to confirm your child's participation before their application expires.</p>
    
    <p>Please check your email for a message from The Bennington Rising Program and complete the consent form as soon as possible.</p>
    
    <p>If you're having trouble finding it or need the email resent, let us know right away!</p>
    
    <p>We're excited about your child's participation in The Bennington Rising Program and can't wait to move forward!</p>
    
    <p>Thank you,<br>
    The Bennington Rising Team<br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(guardianEmail, subject, html);
};

// #5 - Consent Declined (to Mentee)
const sendConsentDeclinedToMentee = async (menteeEmail, menteeFirstName) => {
  const subject = "Update on Your Bennington Rising Mentorship Application";

  const html = `
    <p>Dear ${menteeFirstName},</p>
    
    <p>Thank you again for your interest in The Bennington Rising Program. We appreciate your enthusiasm and the time you took to apply.</p>
    
    <p>We wanted to share that, unfortunately, your parent/guardian has decided not to consent to your participation in The Bennington Rising Program at this time.</p>
    
    <p>While we understand this may feel disappointing, please know this decision is not a reflection of your potential. If your parent/guardian has decided to reconsider, or if you have any questions, don't hesitate to reach out to us. We're just an email away!</p>
    
    <p>With appreciation,<br>
    The Bennington Rising Team<br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(menteeEmail, subject, html);
};

// #6 - Consent Window Closed (to Mentee)
const sendConsentWindowClosedToMentee = async (
  menteeEmail,
  menteeFirstName
) => {
  const subject = "Mentorship Application -- Consent Window Closed";

  const html = `
    <p>Dear ${menteeFirstName},</p>
    
    <p>Thank you again for your interest in the Bennington Rising Program.</p>
    
    <p>Unfortunately, the 48-hour window for your parent or guardian to approve your participation has now passed, and we have not received their consent. Because of this, we're unable to move forward with your mentor match at this time.</p>
    
    <p>We know this can be disappointing, but please know, we'd be happy to rereview your application if you would like to apply for a different team project. Thanks again for your interest, and we hope to reconnect with you soon!</p>
    
    <p>Don't hesitate to reach out if you have any questions.</p>
    
    <p>Best,<br>
    The Bennington Rising Team<br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(menteeEmail, subject, html);
};

// #7 - Consent Approved (to Mentee)
const sendConsentApprovedToMentee = async (menteeEmail, menteeFirstName) => {
  const subject = "Consent for Participation Approved";

  const html = `
    <p>Dear ${menteeFirstName},</p>
    
    <p>Great news! Your parent/guardian has submitted the consent form, and your application to the Bennington Rising Program has been officially approved!</p>
    
    <p>We're excited that your team match is moving forward. You'll soon receive an email indicating whether or not you have matched with a team.</p>
    
    <p>Stay tuned for the steps, and feel free to reach out if you have any questions.</p>
    
    <p>Thank you again for being part of Bennington Rising!</p>
    
    <p>Best,<br>
    The Bennington Rising Team<br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(menteeEmail, subject, html);
};

// #8 - Match Request to Mentor
const sendMatchRequestToMentor = async (
  mentorEmail,
  mentorFirstName,
  menteeData
) => {
  const subject = "Team Match Request -- Please Confirm Your Acceptance";

  const html = `
    <p>Dear ${mentorFirstName},</p>
    
    <p>A potential Fellow is looking to match with your Bennington Rising project team! Please take a moment to review your Fellow's information and let us know if you accept the match.</p>
    
    <p><strong>Fellow information:</strong></p>
    <ul>
      <li><strong>Name:</strong> ${menteeData.firstName}</li>
      <li><strong>Age:</strong> ${menteeData.age || "Not provided"}</li>
      <li><strong>School:</strong> ${menteeData.school}</li>
      <li><strong>Interests:</strong> ${menteeData.interests.join(", ")}</li>
      <li><strong>Answer to Q#1:</strong> ${
        menteeData.answer1 || "Not provided"
      }</li>
      <li><strong>Answer to Q#2:</strong> ${
        menteeData.answer2 || "Not provided"
      }</li>
    </ul>
    
    <p>Please take a moment to reflect on this match. We ask that you confirm your decision by taking one of the actions below:</p>
    
    <blockquote style="background-color: #f0f0f0; padding: 15px; margin: 10px 0;">
      Reply <strong>"Yes"</strong> to this email to <strong>accept</strong> your Fellow match<br><br>
      Reply <strong>"No"</strong> to this email to <strong>decline</strong> Fellow match<br><br>
      <strong>Note:</strong> To decline a match, you must first discuss the circumstances with the Bennington Rising Program Team. Once you decline a match, a notification will be sent to the Bennington Rising Project team. While we fully understand that not every match is perfect fit, we also want to acknowledge that being declined can be heartbreaking for a young person who's excited to connect.
    </blockquote>
    
    <p>Thank you for your time and for being an important part of this work — we appreciate you!</p>
    
    <p>Best,<br>
    <strong>Bennington Rising Program Team</strong><br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(mentorEmail, subject, html);
};

// #9 - Guardian Declined (to Mentor)
const sendGuardianDeclinedToMentor = async (mentorEmail, mentorFirstName) => {
  const subject = "Update on your Team Match -- Participation Declined";

  const html = `
    <p>Dear ${mentorFirstName},</p>
    
    <p>Thank you for your continued commitment to the Bennington Rising Program.</p>
    
    <p>We wanted to let you know that the potential team match previously under review has been declined by their parent/guardian, so we will not be moving forward with this particular match.</p>
    
    <p>We will continue working to find a match for you, and we'll be in touch as soon as that next opportunity arises.</p>
    
    <p>Thank you again for being part of this important work — we're grateful to have your support.</p>
    
    <p>Best,<br>
    <strong>Bennington Rising Team</strong><br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(mentorEmail, subject, html);
};

// #10 - Match Confirmed (to Mentor)
const sendMatchConfirmedToMentor = async (
  mentorEmail,
  mentorFirstName,
  menteesData,
  matchDate
) => {
  const subject = "You've Been Matched!";

  const html = `
    <p>Dear ${mentorFirstName},</p>
    
    <p>We're excited to let you know that your match in the Bennington Rising Program is official, and your Fellows are ready to connect!</p>
    
    <p>Here are the details for your two Fellows:</p>
    
    ${menteesData
      .map(
        (mentee, index) => `
      <div style="background-color: #f0f0f0; padding: 15px; margin: 10px 0;">
        <h4>Fellow #${index + 1} Name: ${mentee.firstName} ${
          mentee.lastName
        }</h4>
        <p><strong>Preferred Email:</strong> ${mentee.email}<br>
        ${
          mentee.phone
            ? `<strong>Optional Phone:</strong> ${mentee.phone}<br>`
            : ""
        }
        <strong>Interests:</strong> ${mentee.interests.join(", ")}<br>
        <strong>Answer to question #1:</strong> ${
          mentee.answer1 || "Not provided"
        }<br>
        <strong>Answer to question #2:</strong> ${
          mentee.answer2 || "Not provided"
        }</p>
      </div>
    `
      )
      .join("")}
    
    <p><strong>Next Steps:</strong></p>
    <ol>
      <li>Reach out to your Fellows via email to introduce yourself</li>
      <li>Review the Teamwork Handbook for tips on setting expectations and building a strong connection.</li>
      <li>Meet your Fellow on ${
        matchDate || "(date to be announced)"
      } for Bennington College Match Day!</li>
    </ol>
    
    <p>We hope you're as excited as we are! If you have any questions or need support at any point, don't hesitate to reach out.</p>
    
    <p>Best,<br>
    <strong>Bennington Rising Team</strong><br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(mentorEmail, subject, html);
};

// #10 - Match Confirmed (to Mentee)
const sendMatchConfirmedToMentee = async (
  menteeEmail,
  menteeFirstName,
  mentorsData,
  matchDate
) => {
  const subject = "You've Been Matched!";

  const html = `
    <p>Hi ${menteeFirstName},</p>
    
    <p>We're excited to let you know that your match in the Bennington Rising Program is official, and your Team Coordinators are ready to connect!</p>
    
    <p>Here are the details for your Team Coordinators:</p>
    
    ${mentorsData
      .map(
        (mentor, index) => `
      <div style="background-color: #f0f0f0; padding: 15px; margin: 10px 0;">
        <h4>Team Coordinator #${index + 1} Name: ${mentor.firstName} ${
          mentor.lastName
        }</h4>
        <p><strong>Preferred Email:</strong> ${mentor.email}<br>
        ${
          mentor.phone
            ? `<strong>Optional Phone:</strong> ${mentor.phone}<br>`
            : ""
        }
        <strong>Interests:</strong> ${mentor.interests.join(", ")}<br>
        <strong>Bio:</strong> ${mentor.bio || "Not provided"}<br>
        <strong>Project Category:</strong> ${mentor.projectCategory}</p>
      </div>
    `
      )
      .join("")}
    
    <p><strong>Next Steps:</strong></p>
    <ol>
      <li>Reach out to your Team Coordinators via email to introduce yourself</li>
      <li>Meet your Team Coordinators on ${
        matchDate || "(date to be announced)"
      } for Bennington College Match Day!</li>
    </ol>
    
    <p>We hope you're as excited as we are! If you have any questions or need support at any point, don't hesitate to reach out.</p>
    
    <p>Best,<br>
    <strong>Bennington Rising Team</strong><br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(menteeEmail, subject, html);
};

// #11 - Match Declined by Mentor (to Mentor)
const sendMatchDeclinedByMentor = async (mentorEmail, mentorFirstName) => {
  const subject = "Team Match Declined";

  const html = `
    <p>Dear ${mentorFirstName},</p>
    
    <p>We're writing to let you know that the Fellow match previously under review is no longer moving forward at this time.</p>
    
    <p>As a result, your mentor profile will be available on the Bennington Rising platform for selection by other interested Fellows.</p>
    
    <p>We appreciate your patience during the process and your ongoing commitment to supporting youth in our community.</p>
    
    <p>If you have any questions, feel free to reach out to our team at any time.</p>
    
    <p>Best,<br>
    <strong>Bennington Rising Program Team</strong><br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(mentorEmail, subject, html);
};

// #12 - Match Declined by Mentor (to Mentee)
const sendMatchDeclinedToMentee = async (menteeEmail, menteeFirstName) => {
  const subject = "Update on Your Team Match";

  const html = `
    <p>Dear ${menteeFirstName},</p>
    
    <p>Thank you again for your interest in the Bennington Rising Program. We appreciate your enthusiasm and the time you've put into the program so far.</p>
    
    <p>We wanted to share that the team you selected has decided not to move forward with the match at this time. While we understand this may feel disappointing, please know this decision is not a reflection of your potential.</p>
    
    <p>The good news is that you can now return to the platform and select a different team who may be an even stronger match to your goals and interests!</p>
    
    <p>We're here to support you every step of the way, and we're excited to help you find the right team. If you have any questions, don't hesitate to reach out to us. We're just an email away!</p>
    
    <p>With appreciation,</p>
    
    <p><strong>Bennington Rising Program Team</strong><br>
    <a href="mailto:VISTA.svhealthcare@gmail.com">VISTA.svhealthcare@gmail.com</a><br>
    <a href="mailto:james.trimarchi@svhealthcare.org">james.trimarchi@svhealthcare.org</a></p>
  `;

  return await sendEmail(menteeEmail, subject, html);
};

// Welcome email (existing function)
const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Bennington Rising!";

  const html = `
    <h2>Welcome to Bennington Rising, ${name}!</h2>
    <p>We're thrilled to have you join our mentorship program.</p>
    <p>Your account has been successfully created. You can now:</p>
    <ul>
      <li>Browse available mentor teams</li>
      <li>Complete your profile</li>
      <li>Request to join a team project</li>
    </ul>
    <p>If you have any questions, feel free to reach out to us!</p>
    <p>Best regards,<br>The Bennington Rising Team</p>
  `;

  return await sendEmail(email, subject, html);
};

// Test function to send all email types to test address
const sendTestEmailSuite = async () => {
  if (!TEST_MODE) {
    console.error("Test email suite can only be run in TEST_MODE");
    return;
  }

  console.log("Sending test email suite to:", TEST_EMAIL);

  // Test data
  const testMentor = {
    email: "mentor@example.com",
    firstName: "John",
    lastName: "Smith",
    bio: "Experienced educator passionate about youth development",
    interests: ["Technology", "Music", "Sports"],
    projectCategory: "video",
  };

  const testMentee = {
    email: "mentee@example.com",
    firstName: "Jane",
    lastName: "Doe",
    interests: ["Art", "Technology", "Books"],
    school: "Grace Christian School",
    age: 15,
    guardianEmail: "guardian@example.com",
    answer1: "I want to learn video production",
    answer2: "I am interested in documentary filmmaking",
  };

  // Send all email types
  const results = [];

  results.push(await sendWelcomeEmail(testMentee.email, testMentee.firstName));
  results.push(
    await sendMatchUnderReviewToMentor(
      testMentor.email,
      testMentor.firstName,
      testMentee
    )
  );
  results.push(
    await sendConsentNeededToMentee(testMentee.email, testMentee.firstName)
  );
  results.push(
    await sendConsentRequestToGuardian(
      testMentee.guardianEmail,
      testMentee,
      testMentor,
      "http://localhost:5173/consent/test-match-request-id"
    )
  );
  results.push(
    await sendFinalReminderToMentee(testMentee.email, testMentee.firstName)
  );
  results.push(await sendFinalReminderToGuardian(testMentee.guardianEmail));
  results.push(
    await sendConsentDeclinedToMentee(testMentee.email, testMentee.firstName)
  );
  results.push(
    await sendConsentWindowClosedToMentee(
      testMentee.email,
      testMentee.firstName
    )
  );
  results.push(
    await sendConsentApprovedToMentee(testMentee.email, testMentee.firstName)
  );
  results.push(
    await sendMatchRequestToMentor(
      testMentor.email,
      testMentor.firstName,
      testMentee
    )
  );
  results.push(
    await sendGuardianDeclinedToMentor(testMentor.email, testMentor.firstName)
  );
  results.push(
    await sendMatchConfirmedToMentor(
      testMentor.email,
      testMentor.firstName,
      [testMentee],
      "January 15, 2025"
    )
  );
  results.push(
    await sendMatchConfirmedToMentee(
      testMentee.email,
      testMentee.firstName,
      [testMentor],
      "January 15, 2025"
    )
  );
  results.push(
    await sendMatchDeclinedByMentor(testMentor.email, testMentor.firstName)
  );
  results.push(
    await sendMatchDeclinedToMentee(testMentee.email, testMentee.firstName)
  );

  console.log("Test suite complete. Results:", results);
  return results;
};

module.exports = {
  sendWelcomeEmail,
  sendMatchUnderReviewToMentor,
  sendConsentNeededToMentee,
  sendConsentRequestToGuardian,
  sendFinalReminderToMentee,
  sendFinalReminderToGuardian,
  sendConsentDeclinedToMentee,
  sendConsentWindowClosedToMentee,
  sendConsentApprovedToMentee,
  sendMatchRequestToMentor,
  sendGuardianDeclinedToMentor,
  sendMatchConfirmedToMentor,
  sendMatchConfirmedToMentee,
  sendMatchDeclinedByMentor,
  sendMatchDeclinedToMentee,
  sendTestEmailSuite,
};
