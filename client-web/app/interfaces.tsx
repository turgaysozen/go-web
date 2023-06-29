export interface AllJobs {
    CategoryName: string
    CategoryID: number
    Jobs: JobSummary[]
    Language: string
    Link: string
    Title: string
}

export interface JobDetails {
    Category: string
    Description: string
    Region: string
    Title: string
    Type: string
    Logo: string
    ApplyUrl: string
    Company: company
    Salary: string
    Date: string
    Applicants: number
}

export interface JobSummary {
    ID: number
    Company: string
    Title: string
    Type: string
    Logo: string
    Location: string
    Date: string
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
