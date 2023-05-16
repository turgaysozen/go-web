'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Search from '@/app/components/Search'
import { Jobs, AllJobs, JobDetailProps } from '../../interfaces'
import { createSlug } from '@/app/common/slugParser'
import Job from '../../components/Job'
import LoadingPage from '@/app/loading'
import axios from 'axios';

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

const getJobs = async (name: string) => {
    const res = await axios.get(`${apiEndpoint}/jobs/${name}`);
    if (res.status === 200) {
        const jobs: AllJobs[] = await res.data
        return jobs;
    } else return []
};

const ListAllJobs: React.FC<JobDetailProps> = ({ params: { name } }) => {
    const [jobs, setJobs] = useState<AllJobs[]>();
    const [isSearched, setSearchedState] = useState(false)
    let [jobsCount, setJobsCount] = useState(0)
    const [jobNotFound, setJobNotFound] = useState(false)

    useEffect(() => {
        (async () => {
            const jobs: AllJobs[] = await getJobs(name);
            if (jobs) {
                jobs.map((jobs: AllJobs) => {
                    jobsCount += jobs.Jobs.length
                })
                setJobsCount(jobsCount)

                const sortedJobs = jobs.map((jobs: AllJobs) => ({
                    ...jobs,
                    Jobs: jobs.Jobs.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
                }));
                setJobs(sortedJobs);
            } else {
                setJobNotFound(true)
            }
        })()
    }, []);

    return (
        <div className='jobs-container'>
            <br></br>
            {jobs && <Search getSearchResults={(results, isSearched) => { setJobs(results), setSearchedState(isSearched) }} allJobs={jobs} />}
            <hr />
            <ul className='job-list'>
                {
                    jobs ? (
                        jobs.map((jobs: AllJobs, idx: number) => (
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
                    ) : (<LoadingPage />)
                }
            </ul>
        </div>
    );
};

export default ListAllJobs;
