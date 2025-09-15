export const API = "https://bennrisingcae.onrender.com";

export const API_LOGIN = `${API}/user/login`;

export const API_REGISTER = `${API}/user/register`;

export const API_MENTOR_PROFILE = `${API}/user/mentor/update`;

export const API_DELETE_MENTOR = `${API}/user/delete`;

export const API_VIEW_MENTOR_MATCH = `${API}/match/view-matches`;

export const API_VIEW_PENDING_REQUESTS = `${API}/match/pending-requests`;

export const API_MENTEE_PROFILE = `${API}/user/mentee/update`;

export const API_VIEW_MENTORS = `${API}/user/mentor/view-all`;

// mentee endpoints
export const API_VIEW_MENTEES = `${API}/user/mentee/view-all`;

export const API_ACCEPT_REQUEST = `${API}/match/accept`;

export const API_REJECT_REQUEST = `${API}/match/deny`;

export const API_ADMIN_UPDATE_MENTOR = `${API}/admin/mentor/update`;

export const API_ADMIN_DELETE_MENTOR = `${API}/admin/mentor/delete`;

// admin mentee endpoints
export const API_ADMIN_UPDATE_MENTEE = `${API}/admin/mentee/update`;

export const API_ADMIN_DELETE_MENTEE = `${API}/admin/mentee/delete`;

export const API_REQUEST_MENTOR = `${API}/match/request`;

export const API_MENTEE_PROFILE_PREVIEW = `${API}/user/mentee/profile`;

export const API_MENTOR_PROFILE_PREVIEW = `${API}/user/mentor/profile`;

// export const API_VIEW_MENTEES = `${API}/user/mentee/view-all`;


// Admin match requests endpoint
export const API_ADMIN_MATCH_REQUESTS = `${API}/admin/match-requests`;

// Add the S3 upload URL endpoint
export const API_GET_UPLOAD_URL = `${API}/geturl`;

// !New! consent endpoints
export const API_CONSENT_FORM_SUBMIT = `${API}/match/consent`;

export const API_CONSENT_FORM_INFO = `${API}/match/consent-info`;

export const API_MENTOR_DECISION = `${API}/match/mentor-decision`;

// Admin password reset endpoints
export const API_ADMIN_RESET_MENTOR_PASSWORD = `${API}/admin/mentor/reset-password`;
export const API_ADMIN_RESET_MENTEE_PASSWORD = `${API}/admin/mentee/reset-password`;
export const API_ADMIN_RESET_ADMIN_PASSWORD = `${API}/admin/admin/reset-password`;

// Admin management endpoints
export const API_ADMIN_CREATE_ADMIN = `${API}/admin/create-admin`;
export const API_ADMIN_LIST_ADMINS = `${API}/admin/list-admins`;