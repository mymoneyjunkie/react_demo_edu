import { Layout, Outer, Loader } from '../index';

import { useEffect, useState, useRef } from 'react';

import { Card } from '../index';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { useSelector } from 'react-redux';

import { useNavigate, useLocation } from "react-router-dom";

const Billing = () => {
	const [ errMsg, setErrMsg ] = useState('');
	const errRef = useRef();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/pricing';

	const axiosPrivate = useAxiosPrivate();

	const currentUser = useSelector((state) => state.user.currentUser);

	const [ isLoading, setIsLoading ] = useState(true);

	const [ activePlan, setActivePlan ] = useState(null);

	const [ planStatus, setPlanStatus ] = useState(null);

	const [ subID, setSubID ] = useState(null);

	const handleClick = (id, status) => {
		// currentUser.email ? navigate(from, { replace: true }) : navigate("/login");
		// console.log(id, status);

		id ? setSubID(id) : setSubID(null);

		status === "active" ? setPlanStatus(true) : setPlanStatus(false);

		setIsLoading(true);
	}

	// console.log(currentUser?.email);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getPlans = async () => {
		  	try {
			    const response = await axiosPrivate.post(
			      "/api/v1/users/subscriptions",
			      { email: currentUser?.email },
			      { signal: controller.signal }
			    );

			    // console.log(response.data);
			    
			    if (isMounted && response.data?.isSuccess) {
			      setIsLoading(false);
			      setActivePlan(response.data?.plans[0].status === "fulfilled" ? response.data?.plans[0].value : null);
			    }
		  	}

		  	catch (error) {
		  		// console.log(error.response?.data);
			    // Check if this is a canceled request - this is normal during unmounting
			    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
			      console.log('Request was canceled', error.message);
			      return; // Don't navigate if it was just canceled
			    }

			    else if (error.response?.data) {
			    	setErrMsg(error.response?.data.message);

			    	setIsLoading(false);

			    	const interval = setTimeout(() => {
	                    if (isMounted) setErrMsg('');
	                }, 1000);

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

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const cancelPlan = async () => {
		  	try {
			    const response = await axiosPrivate.post(
			      "/api/v1/users/subscription-cancel",
			      { email: currentUser?.email, subscription_id: subID },
			      { signal: controller.signal }
			    );

			    // console.log(response.data);
			    
			    if (isMounted && response.data?.isSuccess) {
			      setIsLoading(false);
			      navigate(from, { replace: true })
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

		planStatus && subID && cancelPlan();

		return () => {
			isMounted = false;
			controller.abort();
		}
	}, [planStatus, subID]);

	return (
		<Layout>
			<Outer className="h-lvh mt-15">
				{isLoading ? (
				  	<Loader />
				) : (
					<>
						<div className="text-black md:col-span-1 border-0"></div>
						<div className="text-black md:col-span-10 bg-white border-0 pt-5 px-1">
							<div className="mb-3 px-2">
								<p className="text-2xl lg:text-4xl">Your Subscriptions</p>
							</div>

							{errMsg && (<p 
								ref={errRef} 
								className="sm:text-xl lg:text-4xl sm:mb-5 md:mb-3 p-2 text-center border-2 border-red-500 mb-4 text-red-400"
								aria-live="assertive"
								>
									{errMsg}
								</p>)
							}

							{activePlan ? (
								<div className="flex flex-row items-center justify-center gap-1 py-3 sm:gap-6 sm:p-6 bg-gray-100">
								  <Card className="flex-1 sm:max-w-sm bg-white rounded-xl shadow-lg p-3 sm:p-6 text-center">
								    <h2 className="text-base uppercase sm:text-xl font-semibold mb-2">{activePlan?.product_name}</h2>
								    <p className="text-2xl sm:text-4xl font-bold mb-4">${activePlan?.amount/100}</p>
								    <ul className="space-y-2 mb-6 text-sm text-gray-600 capitalize">
								      <li>{activePlan?.product_description}</li>
								      <li>Watch on Your Phone, Tablet</li>
								      <li>Easy Change or Cancel</li>
								      <li>Better video quality</li>
								      <li>Full HD</li>
								    </ul>
								    <button className="bg-red-600 cursor-pointer text-white py-2 px-4 rounded hover:bg-red-700" onClick={() => handleClick(activePlan?.subscription_id, activePlan?.subscription_status)}>
								      Cancel
								    </button>
								  </Card>
								</div>
							): (
								<div className="flex flex-col items-center justify-center gap-1 py-3 sm:gap-6 sm:p-6 bg-gray-100">
								  <p className="text-xl capitalize font-semibold text-center">
								    You don’t have an active subscription plan.
								  </p>

								  <button 
								    className="bg-[linear-gradient(145deg,_oklch(62.3%_0.214_259.815),_oklch(55.8%_0.288_302.321))] 
								           hover:bg-[linear-gradient(145deg,_oklch(50%_0.214_259.815),_oklch(45%_0.288_302.321))] 
								           py-3 px-6 text-white cursor-pointer rounded-full uppercase transition duration-300"
								    onClick={() => navigate(from, { replace: true })}
								  >
								    View Available Plans
								  </button>
								</div>
							)}
						</div>
						<div className="text-black md:col-span-1 border-0"></div>
					</>
				)}
			</Outer>
		</Layout>
	)
}

export default Billing;