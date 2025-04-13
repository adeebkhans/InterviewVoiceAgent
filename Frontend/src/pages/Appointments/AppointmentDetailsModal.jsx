import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AppointmentDetailsModal({ appointment, onClose }) {
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
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
                    Appointment Details
                  </h3>
                  <div className="mt-4 space-y-4 text-sm text-gray-700">
                    <div>
                      <strong>Candidate Name:</strong> {appointment.candidate_name}
                    </div>
                    <div>
                      <strong>Phone:</strong> {appointment.candidate_phone}
                    </div>
                    <div>
                      <strong>Job Title:</strong> {appointment.job_title}
                    </div>
                    <div>
                      <strong>Job Description:</strong>
                      <p className="mt-1 text-gray-900">{appointment.job_description}</p>
                    </div>
                    <div>
                      <strong>Job Requirements:</strong>
                      <ul className="list-disc pl-5 mt-1 text-gray-900">
                        {appointment.job_requirements?.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Date & Time:</strong>{' '}
                      {new Date(appointment.date_time).toLocaleString()}
                    </div>
                    <div>
                      <strong>Status:</strong> {appointment.status}
                    </div>
                    <div>
                      <strong>Current CTC:</strong>{' '}
                      ₹{parseFloat(appointment.candidate_current_ctc).toLocaleString()}
                    </div>
                    <div>
                      <strong>Expected CTC:</strong>{' '}
                      ₹{parseFloat(appointment.candidate_expected_ctc).toLocaleString()}
                    </div>
                    <div>
                      <strong>Notice Period:</strong>{' '}
                      {appointment.candidate_notice_period} days
                    </div>
                    <div>
                      <strong>Experience:</strong>{' '}
                      {appointment.candidate_experience} years
                    </div>
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
