import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='footer'>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          {/* <li>
            <Link href="/contact">Contact</Link>
          </li> */}
        </ul>
      </nav>
      <p>&copy; 2023 - Remote Job Finder</p>
    </footer>
  )
}

export default Footer
