import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function CandidateFilters({ filters, setFilters }) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Disclosure as="section" className="mt-6">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-100">
            <span>Filters</span>
            <ChevronDownIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-gray-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience (Years)
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    name="experience_min"
                    placeholder="Min"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={filters.experience_min}
                    onChange={handleFilterChange}
                  />
                  <input
                    type="number"
                    name="experience_max"
                    placeholder="Max"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={filters.experience_max}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current CTC (₹)
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    name="ctc_min"
                    placeholder="Min"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={filters.ctc_min}
                    onChange={handleFilterChange}
                  />
                  <input
                    type="number"
                    name="ctc_max"
                    placeholder="Max"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={filters.ctc_max}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notice Period (Days)
                </label>
                <select
                  name="notice_period"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={filters.notice_period}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="0">Immediate</option>
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                </select>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 