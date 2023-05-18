// 'use client'
// import { useRef, useState, useEffect } from 'react'
// import { AllJobs, Jobs } from './interfaces'
// import React from 'react'
// import ServerComponent from './components/SSR'
// // import ListJobs from './components/ListJobs'

// export default function Search() {
//   const [searchText, setsearchText] = useState('')
//   const initialJobs = useRef<AllJobs[]>()
//   const [filterRes, setFilterRes] = useState<AllJobs[]>()
//   const [selectedRegion, setSelectedRegion] = useState('')
//   let [totalJobsCount, setTotalJobsCount] = useState(0)

//   console.log("IJ:", initialJobs.current, "ST:", searchText)

//   const handleJobsFetched = (data: AllJobs[]) => {
//     initialJobs.current = data
//   };

//   const handleSearchTextChange = ((event: { preventDefault: () => void; target: { value: any } }) => {
//     event.preventDefault()
//     const searchText = event.target.value;
//     setsearchText(searchText)
//     console.log(searchText)

//     console.log("PC:", initialJobs.current)
//   })

//   const handleRegionChange = (e: { target: { id: React.SetStateAction<string>; }; }) => {
//     setSelectedRegion(!selectedRegion ? e.target.id : selectedRegion === e.target.id ? "" : e.target.id);
//   }

//   useEffect(() => {
//     let filtJobs = filterJobs(initialJobs.current || [], searchText, selectedRegion)
//     setFilterRes(filtJobs)
//     totalJobsCount = 0
//     filterRes?.map((jobs: AllJobs) => {
//       totalJobsCount += jobs.Jobs.length
//     })
//     setTotalJobsCount(totalJobsCount)
//   }, []);

//   return (
//     <div>
//       <br></br>
//       <div className='search-input-container'>
//         <input
//           className='search-input'
//           onChange={handleSearchTextChange}
//           placeholder='Search Jobs, for ex: python'
//           type='text'
//           value={searchText}
//         />
//       </div>
//       <div className='checkboxes-container'>
//         <div className='checkbox-item'>
//           <label htmlFor="anywhere">
//             Anywhere In the World
//             <input
//               id='anywhere'
//               type="checkbox"
//               checked={selectedRegion === 'anywhere'}
//               onChange={(e) => handleRegionChange(e)}
//             />
//           </label>
//         </div>
//         <div className='checkbox-item'>
//           <label htmlFor="usa">
//             USA Only
//             <input
//               id='usa'
//               type="checkbox"
//               checked={selectedRegion === 'usa'}
//               onChange={(e) => handleRegionChange(e)}
//             />
//           </label>
//         </div>
//         <div className='checkbox-item'>
//           <label htmlFor="uk">
//             UK Only
//             <input
//               id='uk'
//               type="checkbox"
//               checked={selectedRegion === 'uk'}
//               onChange={(e) => handleRegionChange(e)}
//             />
//           </label>
//         </div>
//         <div className='checkbox-item'>
//           <label htmlFor="eu">
//             EU Only
//             <input
//               id='eu'
//               type="checkbox"
//               checked={selectedRegion === 'eu'}
//               onChange={(e) => handleRegionChange(e)}
//             />
//           </label>
//         </div>
//         <div className='checkbox-item'>
//           <label htmlFor="emea">
//             EMEA Only
//             <input
//               id='emea'
//               type="checkbox"
//               checked={selectedRegion === 'emea'}
//               onChange={(e) => handleRegionChange(e)}
//             />
//           </label>
//         </div>
//         <div className='checkbox-item'>
//           <label htmlFor="asia">
//             Asia Only
//             <input
//               id='asia'
//               type="checkbox"
//               checked={selectedRegion === 'asia'}
//               onChange={(e) => handleRegionChange(e)}
//             />
//           </label>
//         </div>
//         <div className='checkbox-item'>
//           <label htmlFor="america">
//             America Only
//             <input
//               id='america'
//               type="checkbox"
//               checked={selectedRegion === 'america'}
//               onChange={(e) => handleRegionChange(e)}
//             />
//           </label>
//         </div>
//       </div>
//       {searchText ?
//         "<ListJobs allJobs={filterRes} isSearched={true} />" : <ServerComponent onJobsFetched={handleJobsFetched} />}
//     </div>
//   )
// }

// const filterJobs = (initialJobsData: AllJobs[], searchValue: string, selectedRegion: string) => {
//   const filteredJobs: AllJobs[] = [];
//   for (const job of initialJobsData) {
//     const filteredSubJobs = job.Jobs.filter((subJob) => {
//       if (selectedRegion && !(subJob.Region.toLowerCase().includes(selectedRegion.toLowerCase()))) {
//         return false
//       }
//       if (searchValue && !(subJob.Title.toLowerCase().includes(searchValue.toLowerCase()))) {
//         return false
//       }
//       return true;
//     });

//     if (filteredSubJobs.length > 0) {
//       const filteredJob: AllJobs = {
//         Description: job.Description,
//         Jobs: filteredSubJobs,
//         Language: job.Language,
//         Link: job.Link,
//         Title: job.Title,
//       };
//       filteredJobs.push(filteredJob);
//     }
//   }

//   return filteredJobs;
// };,



import React from 'react'
import ServerComponent from './components/SSR'

const page = () => {
  return (
    <div>
      <ServerComponent />
    </div>
  )
}

export default page
