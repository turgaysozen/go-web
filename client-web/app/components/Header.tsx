import React from 'react'
import Link from 'next/link'

const Header = () => {
    return (
        <header className='header'>
            <div className='container'>
                <div className='logo'>
                    <Link href=''>
                        <h2>Remote Software Engineering Jobs</h2>
                    </Link>
                </div>
                <div className='links'>
                    <Link href=''>Home</Link>
                    <Link href='/about'>About</Link>
                </div>
            </div>
        </header>
    )
}

export default Header
