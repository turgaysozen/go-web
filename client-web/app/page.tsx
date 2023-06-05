'use client'
import { useRef, useState, useEffect } from 'react'
import { AllJobs } from './interfaces'
import React from 'react'
import ListJobs from './components/ListJobs'
import ServerComponent from './components/SSR'

export default function MainPage() {
  const [searchText, setsearchText] = useState('')
  const initialJobs = useRef<AllJobs[]>()
  const [filterRes, setFilterRes] = useState<AllJobs[]>()
  const [selectedRegion, setSelectedRegion] = useState('')
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  let [totalJobsCount, setTotalJobsCount] = useState(0)

  const handleJobsFetched = (data: AllJobs[]) => {
    initialJobs.current = data
  };

  useEffect(() => {
    if (initialJobs.current) {
      totalJobsCount = 0
      initialJobs.current?.map((jobs: AllJobs) => {
        totalJobsCount += jobs.Jobs.length
      })
      setTotalJobsCount(totalJobsCount)
      searchInputRef.current?.focus();
    } else {
      setTotalJobsCount(0)
    }
  }, [initialJobs.current]);

  const handleSearchTextChange = ((event: { preventDefault: () => void; target: { value: any } }) => {
    event.preventDefault()
    const searchText = event.target.value;
    setsearchText(searchText)
  })

  const handleRegionChange = (e: { target: { id: React.SetStateAction<string>; }; }) => {
    setSelectedRegion(!selectedRegion ? e.target.id : selectedRegion === e.target.id ? "" : e.target.id);
  }

  useEffect(() => {
    let filtJobs = filterJobs(initialJobs.current || [], searchText, selectedRegion)
    console.log("log...")
    setFilterRes(filtJobs)
    totalJobsCount = 0
    filtJobs?.map((jobs: AllJobs) => {
      totalJobsCount += jobs.Jobs.length
    })
    setTotalJobsCount(totalJobsCount)
  }, [selectedRegion, searchText]);

  return (
    <div style={{ pointerEvents: !initialJobs.current ? 'none' : 'auto' }}>
      <h1>Total {totalJobsCount} jobs are listing</h1>
      <div className={`fade-container ${initialJobs.current ? 'fade-in' : ''}`}>
        <div className='search-input-container'>
          <input
            ref={searchInputRef}
            className='search-input'
            onChange={handleSearchTextChange}
            placeholder='Search Jobs, for ex: python'
            type='text'
            value={searchText}
          />
        </div>
        <div className='checkboxes-container'>
          <div className='checkbox-item'>
            <label htmlFor="anywhere">
              Anywhere In the World
              <input
                id='anywhere'
                type="checkbox"
                checked={selectedRegion === 'anywhere'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="usa">
              USA Only
              <input
                id='usa'
                type="checkbox"
                checked={selectedRegion === 'usa'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="uk">
              UK Only
              <input
                id='uk'
                type="checkbox"
                checked={selectedRegion === 'uk'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="eu">
              EU Only
              <input
                id='eu'
                type="checkbox"
                checked={selectedRegion === 'eu'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="emea">
              EMEA Only
              <input
                id='emea'
                type="checkbox"
                checked={selectedRegion === 'emea'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="asia">
              Asia Only
              <input
                id='asia'
                type="checkbox"
                checked={selectedRegion === 'asia'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
          <div className='checkbox-item'>
            <label htmlFor="america">
              America Only
              <input
                id='america'
                type="checkbox"
                checked={selectedRegion === 'america'}
                onChange={(e) => handleRegionChange(e)}
              />
            </label>
          </div>
        </div>
      </div>
      {initialJobs.current ?
        <ListJobs allJobs={filterRes} isSearched={true} /> : <ServerComponent onJobsFetched={handleJobsFetched} />}
    </div>
  )
}

const filterJobs = (initialJobsData: AllJobs[], searchValue: string, selectedRegion: string) => {
  const filteredJobs: AllJobs[] = [];
  for (const job of initialJobsData) {
    const filteredSubJobs = job.Jobs.filter((subJob) => {
      if (selectedRegion && !(subJob.Location.toLowerCase().includes(selectedRegion.toLowerCase()))) {
        return false
      }
      if (searchValue && !(subJob.Title.toLowerCase().includes(searchValue.toLowerCase()))) {
        return false
      }
      return true;
    });

    if (filteredSubJobs.length > 0) {
      const filteredJob: AllJobs = {
        Description: job.Description,
        Jobs: filteredSubJobs,
        Language: job.Language,
        Link: job.Link,
        Title: job.Title,
      };
      filteredJobs.push(filteredJob);
    }
  }

  return filteredJobs;
};