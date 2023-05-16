'use client'
import React, { useEffect, useState } from 'react'
import { Jobs } from '../interfaces'
import LoadingPage from '../loading';
import axios from 'axios';

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

type JobProps = {
    slug: string,
}

const JobDetail = ({ slug }: JobProps) => {
    const [jobDetails, setJobDetails] = useState<Jobs>()
    const [notFound, setNotFound] = useState(false)
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await axios.get(`${apiEndpoint}/job-detail/${slug}`)
            if (res.status === 200) {
                const jobDet: Jobs = await res.data
                setJobDetails(jobDet)
            } else if (res.status === 404) {
                setNotFound(true)
            }
        })()
    }, [])

    const apply = async (url: string | undefined) => {
        const appliedJobKey = `applied:job:${slug}`
        const alreadyApplied = sessionStorage.getItem(appliedJobKey);

        if (!alreadyApplied) {
            const res = await saveJobApplicant(slug)
            if (res.status === 200) {
                const jobDetails = await res.data
                setJobDetails(jobDetails)
            }
            sessionStorage.setItem(appliedJobKey, 'true');
            setIsApplied(true);
        }

        if (url) {
            window.open(url, '_blank')
        }
    }

    return (jobDetails ? <>
        <div className="job-header">
            <h1>{jobDetails?.Title}</h1>
            <span className='applicants'>App: {jobDetails.Applicants}</span>
        </div>
        <div>
            <div className='company-info'>
                <label><strong>Company:</strong> {jobDetails?.Company.Name}</label>
                <label><strong>Headquarter:</strong> {jobDetails?.Company.Headquarter}</label>
            </div>
            <div className="job-info">
                <label><strong>Job Location:</strong> {jobDetails?.Region}</label>
                <label><strong>Job Type:</strong> {jobDetails?.Type}</label>
                <label><strong>P. Date:</strong> {jobDetails?.Date.slice(0, 22)}</label>
            </div>
        </div>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: jobDetails?.Description.replace(/<(h1|h2)>/g, "<h3>") || "" }} />
        <br />
        <button onClick={() => apply(jobDetails?.ApplyUrl)} className="see-all">Apply</button>
    </> : notFound ? <div><h2>Not Found</h2></div> : <LoadingPage />)
}

export default JobDetail

const saveJobApplicant = async (slug: string) => {
    const formData = new FormData()
    formData.append('slug', slug)

    const requestOptions = {
        method: 'POST',
        body: formData,
    };

    return await axios.post(`${apiEndpoint}/jobs/apply/${slug}`, requestOptions);
};