# Remote Job Finder

## Demo
You can access the app from the following URL: http://3.72.248.113

The Remote Job Finder is a web application that fetches jobs from multiple sources and provides a platform for users to search and browse available job listings. It is built using Go for the backend API and Next.js for the client web application. The app is designed to be responsive and can be accessed from both desktop and mobile devices.

## Features
- Job search: Users can search for jobs based on keywords, location, and other criteria.
- Job browsing: Users can browse through the list of available job listings.
- Real-time updates: The app fetches job listings from various sources and updates the database periodically, ensuring that the job data is up to date.
- Caching: The app utilizes Redis as a caching layer to improve performance and reduce the load on external job sources.
- Background job fetching: The app automatically fetches new job listings in the background every hour to keep the data fresh.
- Docker deployment: The app can be easily deployed using Docker Compose by running the command ```docker-compose up --build```. This sets up the necessary containers for the backend API, client web application, and Redis cache.
- SSR: Uses server-side rendering (SSR) along with client-side components on the main page to render the entire page for improved SEO. The combination of client-side and server-side components also enables the addition of live search functionality.

## Prerequisites
- Before running the application, ensure that you have docker on your machine, if you run it without docker on the machine:

- Go (version 1.20)
- Node (version 18)
- Redis

The app requires .env files for backend and client side, but .env files are confidential, so the app can not run properly without them.

## Future Development
- Adding 3rd party api calls and web scraping jobs
- Adding user login and reqister
- Adding user can post jobs and create company profile
- Adding tests
