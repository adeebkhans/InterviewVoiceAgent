import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCandidates } from '../../services/api';
import CandidateDetails from './CandidateDetails';
import CandidateFilters from './CandidateFilters';
import AddCandidateModal from './AddCandidateModal';

export default function Candidates() {
    const [filters, setFilters] = useState({
        experience_min: '',
        experience_max: '',
        ctc_min: '',
        ctc_max: '',
        notice_period: ''
    });
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['candidates', filters],
        queryFn: async () => {
            const response = await getCandidates(filters);
            if (response.data && response.data.success) {
                return response.data.data; // Return the array of candidates
            } else {
                throw new Error(response.data?.message || 'Failed to fetch candidates');
            }
        }
    });

    const candidates = Array.isArray(data) ? data : []; // Ensure candidates is an array

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Candidates</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all candidates including their personal details and interview status.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => setIsAddCandidateModalOpen(true)}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500 cursor-pointer"
                    >
                        Add Candidate
                    </button>
                </div>
            </div>

            <CandidateFilters filters={filters} setFilters={setFilters} />

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Experience</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Current CTC</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expected CTC</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Notice Period</th>
                                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">Loading...</td>
                                    </tr>
                                ) : candidates.length > 0 ? (
                                    candidates.map((candidate) => (
                                        <tr key={candidate.id}>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{candidate.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{candidate.phone}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{candidate.experience} years</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹{parseFloat(candidate.current_ctc).toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹{parseFloat(candidate.expected_ctc).toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{candidate.notice_period} days</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button
                                                    onClick={() => setSelectedCandidate(candidate)}
                                                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">No candidates found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedCandidate && (
                <CandidateDetails
                    candidate={selectedCandidate}
                    onClose={() => setSelectedCandidate(null)}
                />
            )}

            <AddCandidateModal
                isOpen={isAddCandidateModalOpen}
                onClose={() => setIsAddCandidateModalOpen(false)}
            />
        </div>
    );
} 