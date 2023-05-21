// 'use client'
// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import Search from '@/app/components/Search'
// import { Jobs, AllJobs } from './interfaces'
// import { createSlug } from '@/app/common/slugParser'
// import Job from './components/Job'
// import LoadingPage from './loading'
// import axios from 'axios';

// const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

// const getJobs = async () => {
//   const res = await axios.get(`${apiEndpoint}/jobs`);
//   const jobs: AllJobs[] = await res.data;
//   return jobs;
// };

// const ListAllJobs = () => {
//   const [jobs, setJobs] = useState<AllJobs[]>();
//   const [isSearched, setSearchedState] = useState(false)
//   let [jobsCount, setJobsCount] = useState(0)

//   useEffect(() => {
//     (async () => {
//       const jobs: AllJobs[] = await getJobs();

//       const sortedJobs = jobs.map((jobs: AllJobs) => ({
//         ...jobs,
//         Jobs: jobs.Jobs.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
//       }));

//       sortedJobs.map((jobs: AllJobs) => {
//         jobsCount += jobs.Jobs.length
//       })
//       setJobsCount(jobsCount)

//       // sort jobs as desc by jobs count
//       sortedJobs.sort((a: AllJobs, b: AllJobs) => b.Jobs.length - a.Jobs.length)
//       setJobs(sortedJobs);
//     })()
//   }, []);

//   const handleClickCategoryJobs = (title: string) => {
//     console.log(title)
//     window.location.href = `/jobs/${createSlug(title, "")}`;
//   }

//   const setSearchedJobsCount = (results: AllJobs[]) => {
//     jobsCount = 0
//     results.map((jobs: AllJobs) => {
//       jobsCount += jobs.Jobs.length
//     })
//     setJobsCount(jobsCount)
//   }

//   return (
//     <div className='jobs-container'>
//       <h1>All Jobs Listing: {jobsCount}</h1>
//       {jobs && <Search getSearchResults={(results, isSearched) => { setJobs(results), isSearched && setSearchedJobsCount(results), setSearchedState(isSearched) }} allJobs={jobs} />}
//       <hr />
//       <ul className='job-list'>
//         {
//           jobs ? (jobs?.map((jobs: AllJobs, idx: number) => (
//             <div key={idx}>
//               <h2>{jobs.Description}: {jobs.Jobs.length}</h2>
//               {jobs.Jobs.slice(0, 7).map((job: Jobs, id: number) => (
//                 <li key={id}>
//                   <Link href={`/job-detail/${createSlug(jobs.Description, job.Title)}`}>
//                     <Job {...job} />
//                   </Link>
//                 </li>
//               ))}
//               {
//                 (jobs.Jobs.length > 7 &&
//                   <button onClick={() => handleClickCategoryJobs(jobs.Description.toLowerCase())} className="see-all">See All {jobs.Description}</button>)
//                 ||
//                 jobs.Jobs.length < 7 && isSearched &&
//                 <button onClick={() => handleClickCategoryJobs(jobs.Description.toLowerCase())} className="see-all">See All {jobs.Description}</button>
//               }
//               <hr />
//             </div>
//           ))) : (<LoadingPage />)
//         }
//       </ul>
//     </div>
//   );
// };

// export default ListAllJobs;

'use client'
import { useCallback, useRef, useState, use, useEffect } from 'react'
import getJobs from './lib/getJobs'
import { AllJobs, JobSummary } from './interfaces'

import React from 'react'
import Link from 'next/link'
import Job from './components/Job'
import { createSlug } from './common/slugParser'

const ListJobs = ({ allJobs, isSearched }: { allJobs: AllJobs[] | undefined, isSearched: boolean }) => {
  const handleClickCategoryJobs = (title: string) => {
    window.location.href = `/jobs/${createSlug(title, "")}`;
  }
  return (
    <div>
      <hr></hr>
      {
        allJobs && allJobs.map((jobs: AllJobs, id: number) => (
          <ul key={id} className='job-list'>
            <div>
              <h2>{jobs.Description}: {jobs.Jobs.length}</h2>
              {jobs.Jobs.slice(0, 7).map((job: JobSummary, id: number) => (
                <li key={id}>
                  <Link href={`/job-detail/${createSlug(jobs.Description, job.Title)}`}>
                    <Job {...job} />
                  </Link>
                </li>
              ))}
              {
                (jobs.Jobs.length > 7 &&
                  <button onClick={() => handleClickCategoryJobs(jobs.Title.toLowerCase())} className="see-all">See All {jobs.Title}</button>)
                ||
                jobs.Jobs.length < 7 && isSearched &&
                <button onClick={() => handleClickCategoryJobs(jobs.Title.toLowerCase())} className="see-all">See All {jobs.Title}</button>
              }
              <hr />
            </div>
          </ul>
        ))
      }
    </div>
  )
}

type ServerComponentProps = {
  onJobsFetched: (data: AllJobs[], isSearched: boolean) => void;
};

function ServerComponent({ onJobsFetched }: ServerComponentProps) {
  const initialJobs = useRef<AllJobs[]>(use(getJobs()))

  useEffect(() => {
    onJobsFetched(initialJobs.current, false)
  }, [])

  return (
    <div>
      <ListJobs allJobs={initialJobs.current} isSearched={false} />
    </div>
  )
}

export default function Search() {
  const [searchText, setsearchText] = useState('')
  const initialJobs = useRef<AllJobs[]>()
  const [filterRes, setFilterRes] = useState<AllJobs[]>()
  const [selectedRegion, setSelectedRegion] = useState('')
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  let [totalJobsCount, setTotalJobsCount] = useState(0)

  const handleJobsFetched = (data: AllJobs[]) => {
    initialJobs.current = data
  };

  useEffect(() => {
    if (initialJobs.current) {
      searchInputRef.current?.focus();
    }
  }, [initialJobs.current]);

  const handleSearchTextChange = ((event: { preventDefault: () => void; target: { value: any } }) => {
    event.preventDefault()
    const searchText = event.target.value;
    setsearchText(searchText)
  })

  const handleRegionChange = (e: { target: { id: React.SetStateAction<string>; }; }) => {
    setSelectedRegion(!selectedRegion ? e.target.id : selectedRegion === e.target.id ? "" : e.target.id);
  }

  useEffect(() => {
    let filtJobs = filterJobs(initialJobs.current || [], searchText, selectedRegion)
    setFilterRes(filtJobs)
    totalJobsCount = 0
    filterRes?.map((jobs: AllJobs) => {
      totalJobsCount += jobs.Jobs.length
    })
    setTotalJobsCount(totalJobsCount)
  }, [selectedRegion, searchText]);

  return (
    <div style={{ pointerEvents: !initialJobs.current ? 'none' : 'auto' }}>
      <br></br>
      <div className={`fade-container ${initialJobs.current ? 'fade-in' : ''}`}>
        <div className='search-input-container'>
          <input
            ref={searchInputRef}
            className='search-input'
            onChange={handleSearchTextChange}
            placeholder='Search Jobs, for ex: python'
            type='text'
            value={searchText}
          />
        </div>
        <div className='checkboxes-container'>
          <div className='checkbox-item'>
            <label htmlFor="anywhere">
              Anywhere In the World
              <input
                id='anywhere'
                type="checkbox"
                checked={selectedRegion === 'anywhere'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="usa">
              USA Only
              <input
                id='usa'
                type="checkbox"
                checked={selectedRegion === 'usa'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="uk">
              UK Only
              <input
                id='uk'
                type="checkbox"
                checked={selectedRegion === 'uk'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="eu">
              EU Only
              <input
                id='eu'
                type="checkbox"
                checked={selectedRegion === 'eu'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="emea">
              EMEA Only
              <input
                id='emea'
                type="checkbox"
                checked={selectedRegion === 'emea'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="asia">
              Asia Only
              <input
                id='asia'
                type="checkbox"
                checked={selectedRegion === 'asia'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="america">
              America Only
              <input
                id='america'
                type="checkbox"
                checked={selectedRegion === 'america'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
        </div>
      </div>
      {initialJobs.current ?
        <ListJobs allJobs={filterRes} isSearched={true} /> : <ServerComponent onJobsFetched={handleJobsFetched} />}
    </div>
  )
}

const filterJobs = (initialJobsData: AllJobs[], searchValue: string, selectedRegion: string) => {
  const filteredJobs: AllJobs[] = [];
  for (const job of initialJobsData) {
    const filteredSubJobs = job.Jobs.filter((subJob) => {
      if (selectedRegion && !(subJob.Location.toLowerCase().includes(selectedRegion.toLowerCase()))) {
        return false
      }
      if (searchValue && !(subJob.Title.toLowerCase().includes(searchValue.toLowerCase()))) {
        return false
      }
      return true;
    });

    if (filteredSubJobs.length > 0) {
      const filteredJob: AllJobs = {
        Description: job.Description,
        Jobs: filteredSubJobs,
        Language: job.Language,
        Link: job.Link,
        Title: job.Title,
      };
      filteredJobs.push(filteredJob);
    }
  }

  return filteredJobs;
};