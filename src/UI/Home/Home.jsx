import { useEffect, useState } from "react";

import { FaCheck } from "react-icons/fa";

import { Layout, Outer, Loader } from '../../components';

import { useNavigate, useLocation } from "react-router-dom";

import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { useSelector } from 'react-redux';

const Home = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/pricing';

	const axiosPrivate = useAxiosPrivate();

	const currentUser = useSelector((state) => state.user.currentUser);

	const [ isLoading, setIsLoading ] = useState(true);

	const handleClick = () => {
		currentUser.email ? navigate(from, { replace: true }) : navigate("/login");
	}

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getPlans = async () => {
		  	try {
			    const response = await axiosPrivate.post(
			      "/api/v1/users/subscription-home",
			      { email: currentUser?.email },
			      { signal: controller.signal }
			    );
			    
			    if (isMounted) {
			      setIsLoading(false);
			    }
		  	}

		  	catch (error) {
			    // Check if this is a canceled request - this is normal during unmounting
			    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
			      console.log('Request was canceled', error.message);
			      return; // Don't navigate if it was just canceled
			    }

			    else if (error.response?.data) {
			    	setErrMsg(error.response?.data.message);

			    	const interval = setTimeout(() => {
	                    if (isMounted) setErrMsg('');
	                }, 3000);

	                // Clear the timeout on cleanup
	                return () => {
	                    clearTimeout(interval);
	                };
			    }
			    
			    // Only navigate to login for actual auth errors
			    else if (error.response?.data.statusCode === 401) {
			      navigate("/login", { state: { from: location }, replace: true });
			    }

			    else {
			    	console.error("Error fetching plans:", error);
			    	return;
			    }
		  	}
		};

		getPlans();

		return () => {
			isMounted = false;
			controller.abort();
		}
	}, []);

	// useEffect(() => {
	// 	setIsLoading(true);
	// 	setTimeout(() => {
	//       setIsLoading(false); // Stop loading after 3 seconds
	//     }, 1000);
	// }, [])

	return (
		<Layout>
			<Outer className="mt-12 h-lvh">
				{isLoading ? (
				  	<Loader />
				) : (
					<>
						<div className="text-black md:col-span-4 border-0"></div>
						<div className="text-black md:col-span-4 bg-white flex flex-col gap-3 lg:gap-5 justify-start items-center border-0 pt-5">
							<div className="border-2 border-red-500 rounded-full p-3 flex items-center">
								<FaCheck color="red" cursor="pointer" fontSize={20} />
							</div>

							<div>
								<p className="uppercase text-base">Step 3 OF 4</p>
							</div>

							<div>
								<p className="text-2xl lg:text-4xl">Choose your plan.</p>
							</div>

							<div className="border-0 flex justify-center items-center">
								<table className="table-auto border-0 xs:pl-12 xs:pr-10 xd:pl-20 xm:pl-25 xm:pr-15 sm:px-4 border-separate border-spacing-y-2">
								  <tbody>
								    <tr>
								      <td><FaCheck color="red" fontSize={20} fontWeight={0} /></td>
								      <td className="text-lg subpixel-antialiased xm:line-clamp-0 sm:line-clamp-2">No commitments, cancel anytime.</td>
								    </tr>
								    <tr>
								      <td><FaCheck color="red" fontSize={20} fontWeight={0} /></td>
								      <td className="text-lg subpixel-antialiased xm:line-clamp-0 sm:line-clamp-2">Everything on Fitness for one low price.</td>
								    </tr>
								    <tr>
								      <td><FaCheck color="red" fontSize={20} fontWeight={0} /></td>
								      <td className="text-lg subpixel-antialiased xm:line-clamp-0 sm:line-clamp-2">No ads and no extra fees. Ever.</td>
								    </tr>
								  </tbody>
								</table>
							</div>

							<div className="border-0">
								<button 
									type="button"
									onClick={handleClick} 
									className="
										w-60 
										lg:w-90 
										font-semibold 
										px-4 
										py-4 
										bg-red-500 
										text-lg 
										text-white 
										tracking-wide
										cursor-pointer
										transition delay-50 duration-300 ease-in-out
										hover:bg-red-600
									"
								>
									Next
								</button>
							</div>
						</div>
						<div className="text-black md:col-span-4 border-0"></div>
					</>
				)}
			</Outer>
		</Layout>
	)
}

export default Home;