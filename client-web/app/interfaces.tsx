export interface AllJobs {
    Description: string
    Jobs: Jobs[]
    Language: string
    Link: string
    Title: string
}

export interface Jobs {
    Category: string,
    Description: string
    Region: string,
    Title: string,
    Type: string
    Image: string
    ApplyUrl: string
    Company: company
    Salary: string
    Date: string
    Applicants: number
}

interface company {
    Name: string
    Headquarter: string
    Url: string
    Logo: string
}

export interface JobDetailProps {
    params: {
        name: string;
    }
}
