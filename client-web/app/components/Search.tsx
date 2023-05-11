'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { AllJobs } from '../interfaces'

const Seach = ({ allJobs, getSearchResults }: { allJobs: AllJobs[], getSearchResults: (results: AllJobs[], isSearched: boolean,) => void }) => {
    const [selectedRegion, setSelectedRegion] = useState('')
    const [searchText, setSearchText] = useState('');
    const [initialJobsData, _] = useState(allJobs)
    const [searchState, setSearchedState] = useState(false)

    const handleRegionChange = (e: { target: { id: React.SetStateAction<string>; }; }) => {
        setSelectedRegion(!selectedRegion ? e.target.id : selectedRegion === e.target.id ? "" : e.target.id);
        setSearchedState(true)
    }

    function handleSearchTextChange(event: { target: { value: React.SetStateAction<string>; }; }) {
        setSearchText(event.target.value);
        setSearchedState(true)
    }

    const filterJobs = () => {
        const filteredJobs: AllJobs[] = [];
        for (const job of initialJobsData) {
            const filteredSubJobs = job.Jobs.filter((subJob) => {
                if (selectedRegion && !(subJob.Region.toLowerCase().includes(selectedRegion.toLowerCase()))) {
                    return false
                }
                if (searchText && !(subJob.Title.toLowerCase().includes(searchText.toLowerCase()))) {
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

    useEffect(() => {
        let filtJobs = filterJobs();
        getSearchResults(filtJobs, searchState);
    }, [selectedRegion, searchText]);

    const handleFormSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
    };

    return (
        <form onSubmit={handleFormSubmit} className='search-form'>
            <div className='search-input-container'>
                <input className='search-input' type="text" value={searchText} onChange={handleSearchTextChange} placeholder='Search Jobs, for ex: python' />
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
        </form>
    )
}

export default Seach
