import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

import { Link, useNavigate, useLocation } from "react-router-dom";

import fitness from '../../assets/fitness.png'

import { connect, useDispatch } from 'react-redux';

import { persistor } from '../../redux/store'; // adjust path

import { logoutUser } from "../../redux/user/user.actions";

const Navbar = ({ currentUser }) => {
	const [isOpen, setIsOpen] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/';

	const handleClick = () => {
	    setIsOpen((prevState) => !prevState);
	};

	const dispatch = useDispatch();

	const handleLogout = () => {
	    dispatch(logoutUser());
	    persistor.purge();
	    navigate(from, { replace: true });
	};

	// console.log(currentUser);

	return (
		<div className="relative">
			<nav className="w-full flex items-center justify-between px-4 py-2 bg-gray-950 fixed top-0 left-0 border-b-1 border-gray-200 z-11">
		      	<div className="flex items-center justify-start">
		        	<img src={fitness} alt="App Logo" className="w-36 h-15" />
		      	</div>
		      	<ul className="flex items-center justify-center max-sm:hidden space-x-6">
		        	<li className="text-white text-lg font-medium hover:text-gray-400 cursor-pointer">
		        		<Link to="/home">Home</Link>
		        	</li>
		        	<li className="text-white text-lg font-medium hover:text-gray-400 cursor-pointer">
		        		<Link to="/pricing">Pricing</Link>
		        	</li>
		        	<li className="text-white text-lg font-medium hover:text-gray-400 cursor-pointer">
		        		<Link to="/changelog">Changelog</Link>
		        	</li>
		        	<li className="text-white text-lg font-medium hover:text-gray-400 cursor-pointer">
		        		<Link to="/billing">Billing & Subscriptions</Link>
		        	</li>
		      	</ul>
		      	<div className="flex items-center justify-end max-sm:hidden space-x-4">
		      		{!currentUser ? 
			        	<Link to="/login" className="text-white text-lg font-medium hover:text-gray-400 cursor-pointer">
			        		Sign In
			        	</Link> :
			        	<button onClick={handleLogout} className="text-white text-lg font-medium hover:text-gray-400 cursor-pointer">
			        		Logout
			        	</button>
			        }
		        	{/*<div className="w-px h-6 bg-gray-500" />
		        	<a href="/" className="text-white hover:text-gray-400">Book Table</a>*/}
		      	</div>
		      	<div className="md:hidden">
			        <FaBars color="#fff" fontSize={27} cursor="pointer" onClick={handleClick} />
			        { isOpen && (
			          <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-90 flex flex-col items-center space-y-6 p-8 z-50">
			            <FaTimes 
			            	color="#000"
			                className="absolute top-4 right-4 text-3xl cursor-pointer" 
			                onClick={handleClick} 
			            />
			            <ul className="flex flex-col space-y-6 text-center text-black">
			              	<li className="cursor-pointer">
				        		<Link to="/">Home</Link>
				        	</li>
				        	<li className="cursor-pointer">
				        		<Link to="/pricing">Pricing</Link>
				        	</li>
				        	<li className="cursor-pointer">
				        		<Link to="/changelog">Changelog</Link>
				        	</li>
				        	<li className="cursor-pointer">
				        		<Link to="/billing">Billing & Subscriptions</Link>
				        	</li>
			            </ul>
			            <div className="flex flex-col items-center mt-4">
			              	{!currentUser ? 
					        	<Link to="/login" className="text-black mb-2 cursor-pointer">
					        		Sign In
					        	</Link> :
					        	<button onClick={handleLogout} className="text-black mb-2 cursor-pointer">
					        		Logout
					        	</button>
					        }
			              {/*<a href="/" className="text-white">Book Table</a>*/}
			            </div>
			          </div>
			        )}
		      	</div>
	    	</nav>
	    </div>
	)
}

const mapStateToProps = state => ({
	currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(Navbar);