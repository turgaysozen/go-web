'use client'
import React from 'react'
import Link from 'next/link'
import Job from './../components/Job'
import { createSlug } from './../common/slugParser'
import { AllJobs, JobSummary } from './../interfaces'

const ListJobs = ({ allJobs, isSearched }: { allJobs: AllJobs[] | undefined, isSearched: boolean }) => {
  const sortedJobs = allJobs?.map((jobs: AllJobs) => ({
    ...jobs,
    Jobs: jobs.Jobs.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
  }));

  sortedJobs?.sort((a: AllJobs, b: AllJobs) => b.Jobs.length - a.Jobs.length)

  const handleClickCategoryJobs = (categoryName: string, categoryID: number) => {
    window.location.href = `/jobs/${createSlug(categoryName, categoryID)}`;
  }

  return (
    <div>
      <hr></hr>
      {
        sortedJobs && sortedJobs.map((jobs: AllJobs, id: number) => (
          <ul key={id} className='job-list'>
            <div>
              <h2>{jobs.CategoryName}: {jobs.Jobs.length}</h2>
              {jobs.Jobs.slice(0, 7).map((job: JobSummary, id: number) => (
                <li key={id}>
                  <Link href={`/job-detail/${createSlug(job.Title, job.ID)}`}>
                    <Job {...job} />
                  </Link>
                </li>
              ))}
              {
                (jobs.Jobs.length > 7 &&
                  <button onClick={() => handleClickCategoryJobs(jobs.CategoryName, jobs.CategoryID)} className="see-all">See All {jobs.CategoryName}</button>)
                ||
                jobs.Jobs.length < 7 && isSearched &&
                <button onClick={() => handleClickCategoryJobs(jobs.CategoryName, jobs.CategoryID)} className="see-all">See All {jobs.CategoryName}</button>
              }
              <hr />
            </div>
          </ul>
        ))
      }
    </div>
  )
}

export default ListJobs