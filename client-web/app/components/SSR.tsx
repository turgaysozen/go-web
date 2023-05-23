import { use, useEffect, useRef } from 'react';
import { AllJobs } from '../interfaces';
import ListJobs from './../components/ListJobs'
import getJobs from '../lib/getJobs';

type ServerComponentProps = {
  onJobsFetched: (data: AllJobs[], isSearched: boolean) => void;
};

function ServerComponent({ onJobsFetched }: ServerComponentProps) {
  const initialJobs = useRef<AllJobs[]>(use(getJobs()))

  useEffect(() => {
    onJobsFetched(initialJobs.current, false)
  }, [])

  return (
    <div>
      <ListJobs allJobs={initialJobs.current} isSearched={false} />
    </div>
  )
}

export default ServerComponent