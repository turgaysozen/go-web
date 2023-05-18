import { AllJobs, Jobs } from './../interfaces'

import React from 'react'
import Link from 'next/link'
import Job from './../components/Job'
import { createSlug } from './../common/slugParser'

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
              {/* {
                (jobs.Jobs.length > 7 &&
                  <button onClick={() => handleClickCategoryJobs(jobs.Title.toLowerCase())} className="see-all">See All {jobs.Title}</button>)
                ||
                jobs.Jobs.length < 7 && isSearched &&
                <button onClick={() => handleClickCategoryJobs(jobs.Title.toLowerCase())} className="see-all">See All {jobs.Title}</button>
              } */}
              <hr />
            </div>
          </ul>
        ))
      }
    </div>
  )
}

export default ListJobs