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
//               <h2>{jobs.Title}: {jobs.Jobs.length}</h2>
//               {jobs.Jobs.slice(0, 7).map((job: Jobs, id: number) => (
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
//             </div>
//           ))) : (<LoadingPage />)
//         }
//       </ul>
//     </div>
//   );
// };

// export default ListAllJobs;
