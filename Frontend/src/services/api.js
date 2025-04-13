import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
});

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');

// Job APIs
export const getJobs = () => api.get('/job');
export const createJob = (data) => api.post('/job', data);
export const updateJob = (id, data) => api.put(`/job/${id}`, data);
export const deleteJob = (id) => api.delete(`/job/${id}`);

// Candidate APIs
export const getCandidates = (filters) => 
  api.get('/candidates', { params: filters });
export const getCandidateDetails = (id) => 
  api.get(`/candidates/${id}`);
export const createCandidate = (data) => api.post('/candidates', data);

// Appointment APIs
export const getAppointments = (filters) => 
  api.get('/appointments', { params: filters });
export const getAppointmentDetails = (id) => 
  api.get(`/appointments/${id}`);
export const updateAppointmentStatus = (id, status) => 
  api.patch(`/appointments/${id}/${status}`);

// Conversation APIs
export const getConversations = (candidateId) => 
  api.get(`/conversations/candidate/${candidateId}`);

// Function to start voice interaction
export const startVoiceInteraction = async () => {
    const response = await api.post('/voice/start');
    return response.data; // Return the response data
};

// Function to respond to voice input
export async function respondToVoice({ text, candidate_id }) {
  const res = await axios.post('/api/voice/respond', {
    audio: {
      text,
      candidate_id
    }
  });
  return res.data;
}
