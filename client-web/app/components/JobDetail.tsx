'use client'
import React, { useEffect, useState } from 'react'
import { Jobs } from '../interfaces'

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

type JobProps = {
    slug: string,
}

const JobDetail = ({ slug }: JobProps) => {
    const [jobDetails, setJobDetails] = useState<Jobs>()

    useEffect(() => {
        (async () => {
            const res = await fetch(`${apiEndpoint}/job-detail/${slug}`)
            const jobDet: Jobs = await res.json()
            setJobDetails(jobDet)
        })()
    }, [])

    const apply = (url: string | undefined) => {
        if (url) {
            window.open(url, '_blank')
        }
    }

    return <>
        <div className="job-header">
            <h1>{jobDetails?.Title}</h1>
            <img src={jobDetails?.Company.Logo} alt={jobDetails?.Company.Name} />
        </div>
        <div>
            <div className='company-info'>
                <label><strong>Company:</strong> {jobDetails?.Company.Name}</label>
                <label><strong>Headquarter:</strong> {jobDetails?.Company.Headquarter}</label>
            </div>
            <div className="job-info">
                <label><strong>Job Location:</strong> {jobDetails?.Region}</label>
                <label><strong>Job Type:</strong> {jobDetails?.Type}</label>
                <label><strong>P. Date:</strong> {jobDetails?.Date}</label>
            </div>
        </div>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: jobDetails?.Description.replace(/<(h1|h2)>/g, "<h3>") || "" }} />
        <br />
        <button onClick={() => apply(jobDetails?.ApplyUrl)} className="see-all">Apply</button>
    </>
}

export default JobDetail
