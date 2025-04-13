import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../../services/api';

export default function CandidateDetails({ candidate, onClose }) {
    const { data: conversationsData, isLoading: isLoadingConversations } = useQuery({
        queryKey: ['conversations', candidate.id],
        queryFn: async () => {
            const response = await getConversations(candidate.id);
            if (response.data && response.data.success) {
                return response.data.data; // Return the array of candidates
            } else {
                throw new Error(response.data?.message || 'Failed to fetch candidates');
            }
        }
    });

    const conversations = Array.isArray(conversationsData) ? conversationsData : []; // Ensure candidates is an array

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Candidate Details
                                    </h3>
                                    <div className="mt-2">
                                        <dl className="divide-y divide-gray-200">
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {candidate.name}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {candidate.phone}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Experience</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {candidate.experience} years
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Current CTC</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    ₹{parseFloat(candidate.current_ctc).toLocaleString()}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Expected CTC</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    ₹{parseFloat(candidate.expected_ctc).toLocaleString()}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Notice Period</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {candidate.notice_period} days
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-900">Conversation History</h4>
                                        {isLoadingConversations ? (
                                            <p className="mt-2 text-gray-500">Loading conversations...</p>
                                        ) : (
                                            <div className="mt-2 space-y-4">
                                                {conversations ? (
                                                    conversations.map((conv) => (
                                                        <div key={conv.id} className="rounded-lg bg-gray-50 p-4">
                                                            <p className="text-sm text-gray-700">{conv.transcript}</p>
                                                            {conv.entities_extracted && (
                                                                <div className="mt-2">
                                                                    <h5 className="text-xs font-medium text-gray-900">
                                                                        Extracted Entities
                                                                    </h5>
                                                                    <pre className="mt-1 text-xs text-gray-500">
                                                                        {JSON.stringify(conv.entities_extracted, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="mt-2 text-gray-500">No conversations found.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
} 