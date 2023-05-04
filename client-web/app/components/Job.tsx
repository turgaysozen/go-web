import React from 'react'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'
import { Jobs } from '../interfaces'

const Job = (job: Jobs) => {
    return (
        <>
            <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ margin: "-20px 0 0 0", display: "flex", flexDirection: "column" }}>
                    <h4>{job.Company.Name}</h4>
                    <h2 style={{ margin: "-15px 0 0 0" }}>{job.Title}</h2>
                </div>
                <img className="company-img" style={{ width: "70px", height: "70px", paddingTop: "10px", marginRight: "20px", objectFit: "cover" }} src={job.Company.Logo} alt="" />
            </div>
            <div className='job-details'>
                <span>
                    <FaStar /> {job.Type}
                </span>
                <span>
                    <FaMapMarkerAlt /> {job.Region}
                </span>
                <span>
                    {job.Date.split(" ")[0]}
                </span>
            </div>
        </>
    )
}

export default Job
