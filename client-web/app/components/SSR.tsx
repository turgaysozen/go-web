import { use, useEffect, useRef } from 'react';
import { AllJobs } from '../interfaces';
import ListJobs from './../components/ListJobs'
import getJobs from '../lib/getJobs';

type ServerComponentProps = {
  onJobsFetched: (data: AllJobs[], isSearched: boolean) => void;
};

function ServerComponent({ onJobsFetched }: ServerComponentProps) {
  const initialJobs = useRef<AllJobs[]>(use(getJobs()))

  const sortedJobs = initialJobs.current.map((jobs: AllJobs) => ({
    ...jobs,
    Jobs: jobs.Jobs.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
  }));

  sortedJobs?.sort((a: AllJobs, b: AllJobs) => b.Jobs.length - a.Jobs.length)

  useEffect(() => {
    onJobsFetched(initialJobs.current, false)
  }, [])

  return (
    <div>
      <ListJobs allJobs={sortedJobs} isSearched={false} />
    </div>
  )
}

export default ServerComponent