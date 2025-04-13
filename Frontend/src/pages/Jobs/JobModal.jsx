import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob, updateJob } from '../../services/api';
import toast from 'react-hot-toast';

export default function JobModal({ isOpen, onClose, job }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: []
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        requirements: job.requirements
      });
    } else {
      setFormData({
        title: '',
        description: '',
        requirements: []
      });
    }
  }, [job]);

  const mutation = useMutation({
    mutationFn: job ? 
      (data) => updateJob(job.id, data) : 
      createJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success(job ? 'Job updated successfully' : 'Job created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
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
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Requirements
                      </label>
                      <div className="mt-2 space-y-2">
                        {formData.requirements.map((req, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={req}
                              onChange={(e) => handleRequirementChange(index, e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => removeRequirement(index)}
                              className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addRequirement}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Add Requirement
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      disabled={mutation.isLoading}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:bg-indigo-400"
                    >
                      {mutation.isLoading
                        ? 'Saving...'
                        : job
                        ? 'Update Job'
                        : 'Create Job'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 