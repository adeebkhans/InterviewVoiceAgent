import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCandidate } from '../../services/api';
import toast from 'react-hot-toast';

export default function AddCandidateModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    current_ctc: '',
    expected_ctc: '',
    notice_period: '',
    experience: ''
  });

  const mutation = useMutation({
    mutationFn: createCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries(['candidates']);
      toast.success('Candidate added successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add candidate');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
                    Add New Candidate
                  </h3>
                  <form onSubmit={handleSubmit} className="mt-5">
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Current CTC"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.current_ctc}
                        onChange={(e) => setFormData({ ...formData, current_ctc: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Expected CTC"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.expected_ctc}
                        onChange={(e) => setFormData({ ...formData, expected_ctc: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Notice Period (Days)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.notice_period}
                        onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Experience (Years)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mt-5 sm:mt-6">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Add Candidate
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 