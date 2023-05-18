import { use, useEffect, useRef } from "react"
import getJobs from "../lib/getJobs"
import { AllJobs } from "../interfaces"
import ListJobs from "./ListJobs";


// type ServerComponentProps = {
//     onJobsFetched: (data: AllJobs[], isSearched: boolean) => void;
// };

function ServerComponent() {
    console.log("IN SSR...")
    // let initialJobs = useRef<AllJobs[]>(use(getJobs()))

    // useEffect(() => {
    //     onJobsFetched(initialJobs.current, false)
    // }, [initialJobs.current])

    const jobs = use(getJobs())

    return (
        <div>
            <ListJobs allJobs={jobs} isSearched={false} />
        </div>
    )
}

export default ServerComponent