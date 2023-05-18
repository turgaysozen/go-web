// 'use client'
// import React, { use, useEffect, useState, useCallback, useRef } from 'react'
// import getJobs from './lib/getJobs'
// import { AllJobs, Jobs } from './interfaces'

// const MainPage = () => {
//   // let allJobs: AllJobs[] = use(getJobs())
//   let [allJobs, setAllJobs] = useState(use(getJobs()))
//   const [selectedRegion, setSelectedRegion] = useState('')
//   const [searchText, setSearchText] = useState('');
//   const [initialJobsData, _] = useState(allJobs)
//   const [searchState, setSearchedState] = useState(false)
//   const divRef = useRef(null);

//   // const handleSearchTextChange = (event: { preventDefault: () => void; }) => {
//   //   event.preventDefault()
//   //   // const sJobs = allJobs.slice(0, 1)
//   //   setAllJobs(allJobs)
//   // }

//   const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     const filteredJobs = allJobs.filter((job) =>
//       job.Title.toLowerCase().includes(value.toLowerCase())
//     );
//     setAllJobs(filteredJobs);
//     console.log(filteredJobs)
//     setSearchText(value);
//   };

//   const handleOnFocus = () => {
//     window.addEventListener("click", onClick);
//   };

//   const onClick = () => {
//     window.removeEventListener("click", onClick);
//   };

//   const focusInput = () => {
//     if (divRef.current) {
//       const input = divRef.current.querySelector('.searchInput');
//       if (input) {
//         input.focus();
//       }
//     }
//   };

//   const fetchJobs = async () => {
//     const jobs = await getJobs(); // Fetch jobs using your API function
//     setAllJobs(jobs);
//   };

//   // useState(() => {
//   //   fetchJobs();
//   // }, []);

//   const filterJobs = () => {
//     const filteredJobs: AllJobs[] = [];
//     for (const job of initialJobsData) {
//       const filteredSubJobs = job.Jobs.filter((subJob) => {
//         if (selectedRegion && !(subJob.Region.toLowerCase().includes(selectedRegion.toLowerCase()))) {
//           return false
//         }
//         if (searchText && !(subJob.Title.toLowerCase().includes(searchText.toLowerCase()))) {
//           return false
//         }
//         return true;
//       });

//       if (filteredSubJobs.length > 0) {
//         const filteredJob: AllJobs = {
//           Description: job.Description,
//           Jobs: filteredSubJobs,
//           Language: job.Language,
//           Link: job.Link,
//           Title: job.Title,
//         };
//         filteredJobs.push(filteredJob);
//       }
//     }

//     return filteredJobs;
//   };

//   // useEffect(() => {
//   //   let filtJobs = filterJobs();
//   //   // getSearchResults(filtJobs, searchState);
//   //   setAllJobs(filtJobs)
//   // }, [searchText]);

//   let count = 0
//   allJobs.map((j) => {
//     count += j.Jobs.length
//   })

//   return (
//     <div ref={divRef}>
//       <input
//         className='searchInput'
//         type="text"
//         placeholder='search jobs'
//         onChange={handleSearchTextChange}
//         onFocus={handleOnFocus}
//       />
//       <h2>Total: {count}</h2>
//       {
//         allJobs.map((jobs: AllJobs, id: number) => (
//           <div key={id}>
//             <h3>{jobs.Title}</h3>
//             {jobs.Jobs.map((job: Jobs, idx: number) => (
//               <div key={idx}>{job.Title}</div>
//             ))}
//           </div>
//         ))
//       }
//     </div>
//   )
// }

// export default MainPage



// <div key={idx}>
//                <h2>{jobs.Title}: {jobs.Jobs.length}</h2>
//                {jobs.Jobs.slice(0, 7).map((job: Jobs, id: number) => (
//                 <li key={id}>
//                   <Link href={`/job-detail/${createSlug(jobs.Description, job.Title)}`}>
//                     <Job {...job} />
//                   </Link>
//                 </li>
//               ))}
//               {
//                 (jobs.Jobs.length > 7 &&
//                   <button onClick={() => handleClickCategoryJobs(jobs.Title.toLowerCase())} className="see-all">See All {jobs.Title}</button>)
//                 ||
//                 jobs.Jobs.length < 7 && isSearched &&
//                 <button onClick={() => handleClickCategoryJobs(jobs.Title.toLowerCase())} className="see-all">See All {jobs.Title}</button>
//               }
//               <hr />
//           </div>

'use client'
import { useCallback, useRef, useState, use, useEffect } from 'react'
import getJobs from './lib/getJobs'
import { AllJobs, Jobs } from './interfaces'

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
              <h2>{jobs.Title}: {jobs.Jobs.length}</h2>
              {jobs.Jobs.slice(0, 7).map((job: Jobs, id: number) => (
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
  let [totalJobsCount, setTotalJobsCount] = useState(0)

  const handleJobsFetched = (data: AllJobs[]) => {
    initialJobs.current = data
  };

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
      <div className='search-input-container'>
        <input
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
      {initialJobs.current ?
        <ListJobs allJobs={filterRes} isSearched={true} /> : <ServerComponent onJobsFetched={handleJobsFetched} />}
    </div>
  )
}

const filterJobs = (initialJobsData: AllJobs[], searchValue: string, selectedRegion: string) => {
  const filteredJobs: AllJobs[] = [];
  for (const job of initialJobsData) {
    const filteredSubJobs = job.Jobs.filter((subJob) => {
      if (selectedRegion && !(subJob.Region.toLowerCase().includes(selectedRegion.toLowerCase()))) {
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