// Import necessary hooks and components
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAppointments, getAppointmentDetails } from '../../services/api';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import UpdateStatusModal from './UpdateStatusModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import { format } from 'date-fns';

export default function Appointments() {
    // Local state to manage selected appointment and modal visibility
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);

    // Fetch all appointments using React Query
    const { data, isLoading, error } = useQuery({
        queryKey: ['appointments'],
        queryFn: async () => {
            const response = await getAppointments();
            if (response.data && response.data.success) {
                return response.data.data; // Return array of appointments
            } else {
                throw new Error(response.data?.message || 'Failed to fetch appointments');
            }
        }
    });

    const appointments = Array.isArray(data) ? data : [];

    const handleViewDetails = async (appointmentId) => {
        try {
            const response = await getAppointmentDetails(appointmentId);
            if (response.data && response.data.success) {
                setAppointmentDetails(response.data.data);
                setDetailsModalOpen(true);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch appointment details');
            }
        } catch (error) {
            console.error('Error fetching appointment details:', error);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Appointments</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all interview appointments including candidate details and status.
                    </p>
                </div>
            </div>

            {/* Table Section */}
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Candidate</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Job Title</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {/* Loading state */}
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">Loading...</td>
                                    </tr>
                                ) : error ? (
                                    // Error state
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            Error loading appointments: {error.message}
                                        </td>
                                    </tr>
                                ) : appointments.length > 0 ? (
                                    // Render each appointment row
                                    appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {appointment.candidate_name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {appointment.job_title}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {format(new Date(appointment.date_time), 'PPp')}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <AppointmentStatusBadge status={appointment.status} />
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                {/* View Details Button */}
                                                <button
                                                    onClick={() => handleViewDetails(appointment.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                >
                                                    View Details
                                                </button>
                                                {/* Update Status Button */}
                                                <button
                                                    onClick={() => setSelectedAppointment(appointment)}
                                                    className="text-indigo-600 hover:text-indigo-900 ml-4 cursor-pointer"
                                                >
                                                    Update Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    // Empty state
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">No appointments found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {selectedAppointment && (
                <UpdateStatusModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                />
            )}

            {detailsModalOpen && appointmentDetails && (
                <AppointmentDetailsModal
                    appointment={appointmentDetails}
                    onClose={() => setDetailsModalOpen(false)}
                />
            )}
        </div>
    );
}
