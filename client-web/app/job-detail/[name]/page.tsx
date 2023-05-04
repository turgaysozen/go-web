import React from 'react'
import JobDetail from '@/app/components/JobDetail';
import { JobDetailProps } from '@/app/interfaces';

const JobPage: React.FC<JobDetailProps> = ({ params: { name } }) => {
    return (
        <div className='card'>
            <JobDetail slug={name} />
        </div>
    )
}

export default JobPage
