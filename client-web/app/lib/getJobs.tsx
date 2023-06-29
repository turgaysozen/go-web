import { AllJobs } from "../interfaces";
import axios from 'axios';

const apiEndpoint = "http://3.72.248.113:8080" // process.env.NEXT_PUBLIC_API_ENDPOINT;

const getJobs = async () => {
    const res = await axios(`${apiEndpoint}/jobs`);
    const jobs: AllJobs[] = await res.data
    return jobs;
};

export default getJobs