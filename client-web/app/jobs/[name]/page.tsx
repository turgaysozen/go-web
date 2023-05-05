'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Search from '@/app/components/Search'
import { Jobs, AllJobs, JobDetailProps } from '../../interfaces'
import { createSlug } from '@/app/common/slugParser'
import Job from '../../components/Job'

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

const getJobs = async (name: string) => {
    const res = await fetch(`${apiEndpoint}/jobs/${name}`);
    const jobs: AllJobs[] = await res.json();
    return jobs;
};

const ListAllJobs: React.FC<JobDetailProps> = ({ params: { name } }) => {
    const [jobs, setJobs] = useState<AllJobs[]>();
    const [isSearched, setSearchedState] = useState(false)
    let [jobsCount, setJobsCount] = useState(0)

    useEffect(() => {
        (async () => {
            const jobs: AllJobs[] = await getJobs(name);
            jobs.map((jobs: AllJobs) => {
                jobsCount += jobs.Jobs.length
            })
            setJobsCount(jobsCount)
            setJobs(jobs);
        })()
    }, []);

    return (
        <div className='jobs-container'>
            {jobs && <Search getSearchResults={(results, isSearched) => { setJobs(results), setSearchedState(isSearched) }} allJobs={jobs} />}
            <hr />
            <ul className='job-list'>
                {
                    jobs?.map((jobs: AllJobs, idx: number) => (
                        <div key={idx}>
                            <h1>{jobs.Jobs.length} {jobs.Title} found</h1>
                            {jobs.Jobs.map((job: Jobs, id: number) => (
                                <li key={id}>
                                    <Link href={`/job-detail/${createSlug(jobs.Description, job.Title)}`}>
                                        <Job {...job} />
                                    </Link>
                                </li>
                            ))}
                        </div>
                    ))
                }
            </ul>
        </div>
    );
};

export default ListAllJobs;
