import { Link } from 'react-router-dom';

import { useState } from 'react';

const Footer = () => {
	const [ pages, setPages ] = useState([
	  {
	    label: "Support",
	    path: "/support",
	  },
	  {
	    label: "Privacy",
	    path: "/privacy",
	  },
	  {
	    label: "Terms",
	    path: "/terms",
	  },
	  {
	    label: "DMCA",
	    path: "/dmca",
	  },
	  {
	    label: "EULA",
	    path: "/eula",
	  }
	]);

	return (
		<div className="relative">
			<nav className="w-full fixed bottom-0 left-0 flex items-center justify-evenly px-2 sm:px-4 py-2 bg-gray-950 md:mt-3">
			    <ul className="flex items-center justify-evenly space-x-6 h-15 w-full">
			      {pages.map(({ label, path }) => (
			      	<li key={path} className="text-white text-lg font-medium hover:text-gray-500 cursor-pointer text-sm xm:text-base md:text-lg">
				        <Link key={path} to={path} rel="noopener noreferrer">
				        	{label}
				        </Link>
				      </li>
			      ))}
			    </ul>
			</nav>
		</div>
	)
}

export default Footer;