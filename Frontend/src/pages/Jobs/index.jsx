import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getJobs, deleteJob } from '../../services/api';
import JobModal from './JobModal';

export default function Jobs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const queryClient = useQueryClient();

//   console.log('Component rendering');

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
        const response = await getJobs(); // getJobs still returns the full Axios response
        // Check if the backend indicates success within the data payload
        if (response.data && response.data.success) {
           return response.data.data; // Return the actual array of jobs
        } else {
           // Throw an error if the backend response indicates failure
           // Adjust the error message based on your backend's failure response structure
           throw new Error(response.data?.message || 'Failed to fetch jobs');
        }
      },
  
    onSuccess: (data) => {
        console.log('onSuccess callback triggered');
    // console.log('Raw data from API:', data);
    //   console.log('Jobs fetched successfully:', data); // Log the data
    },
    onError: (error) => {
        console.log('onError callback triggered');
    // console.error('Error details:', error);
    //   console.error('Error fetching jobs:', error); // Log any errors
    }
  });

//   console.log('Query state:', { data, isLoading, error });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete job');
    }
  });

  const handleEdit = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading jobs: {error.message}</div>; // Handle error

  
  
  // Ensure data is an object and has a data property that is an array
  const jobs = Array.isArray(data) ? data : [];
//   console.log('Jobs data being used for render:', jobs);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Jobs</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all job postings including their title, requirements, and creation date.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedJob(null);
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500 cursor-pointer"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1 " />
            Add Job
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Requirements</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <ul>
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString()} {/* Format date as needed */}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-900 ml-4 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No jobs available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
      />
    </div>
  );
} 