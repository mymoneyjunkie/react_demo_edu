import { Layout, Outer, Loader } from '../index';

import { useEffect, useState, useRef } from 'react';

import { Card } from '../index';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { useSelector } from 'react-redux';

import { useNavigate, useLocation } from "react-router-dom";

const Pricing = () => {
	const [ plans, setPlans ] = useState(null);
	const [ planName, setPlanName ] = useState(null);
	const [ errMsg, setErrMsg ] = useState('');
	// const [ isLoading, setIsLoading ] = useState(false);
	const errRef = useRef();

	const axiosPrivate = useAxiosPrivate();

	const currentUser = useSelector((state) => state.user.currentUser);

	const [ singlePlan, setSinglePlan ] = useState({
		amount: '',
		name: '',
		description: ['Full HD', 'Watch on Your Phone, Tablet', 'Easy Change or Cancel', 'Better video quality']
	});

	const [ isLoading, setIsLoading ] = useState(false);

	const handleClick = (type, price, description) => {
		// console.log(price, type, description);
		setSinglePlan((prevState) => {
			return {
				...prevState,
				amount: price,
				name: type,
				description: description
			}
		})
	}

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getPlans = async () => {
		  	try {
			    const response = await axiosPrivate.post(
			      "/api/v1/users/subscription-plan",
			      { email: currentUser?.email },
			      { signal: controller.signal }
			    );
			    
			    if (isMounted && response.data?.isSuccess) {
			      const fetchedPlans = response.data.plans;
			      setPlans(fetchedPlans);
			      setIsLoading(false);

			      // console.log(fetchedPlans);
			      
			      if (fetchedPlans.length > 1) {
			        setSinglePlan((prevState) => {
			          return {
			            ...prevState,
			            amount: fetchedPlans[1].amount,
			            name: fetchedPlans[1].name
			          };
			        });
			      }
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

	const handlePlanClick = async (name) => {
		setPlanName(name);
		setIsLoading(true);
	};

	// console.log(plans);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController(); 

		const checkout = async() => {
			// console.log(planName);
			try {
			    const response = await axiosPrivate.post(
			      "/api/v1/users/subscribe",
			      { email: currentUser?.email, plan: planName },
			      { signal: controller.signal }
			    );

			    // console.log(response.data);
			    
			    // if (isMounted && response.data?.isSuccess) {
			    // 	response.data?.message ? setErrMsg(response.data?.message) : window.open(response.data?.url, '_blank');
			    //   	setIsLoading(false);
			    // }

				if (isMounted && response.data?.isSuccess) {
				  if (response.data?.message) {
				    setErrMsg(response.data?.message); // Show the message in case of an error
				  } else {
				    window.location.href = response.data?.url; // Open the URL in the same page
				  }
				  setIsLoading(false);
				}
		  	}

		  	catch (error) {
		  		// console.log(error);
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
			    	console.error("Error in processing checkout:", error.response.data);
			    	return;
			    }
		  	}
		}

		planName && checkout();

		return () => {
			isMounted = false;
			controller.abort();
		}
	}, [planName]);


	return (
		<Layout>
			<Outer className="h-full sm:h-dvh mt-15">
				{!plans || isLoading ? (
				  	<Loader />
				) : (
					<>
						<div className="text-black md:col-span-1 border-0"></div>
						<div className="text-black md:col-span-10 bg-white border-0 pt-5 px-1">
							<div className="mb-3 px-2">
								<p className="uppercase text-base">Step 4 OF 4</p>
							</div>

							{errMsg && (<p 
								ref={errRef} 
								className="sm:text-xl lg:text-4xl sm:mb-5 md:mb-3 p-2 text-center border-2 border-red-500 mb-4 text-red-400"
								aria-live="assertive"
								>
									{errMsg}
								</p>)
							}

							<div className="mb-8 px-2">
								<p className="text-2xl lg:text-4xl">Choose the plan that's right for you</p>
							</div>

							<div className="flex flex-row items-center justify-center gap-6 p-6 bg-gray-100 hidden sm:flex">
							  {/* Basic Plan */}
								{/*<div className="flex flex-wrap gap-6 justify-center">*/}
								{plans &&
								    plans.map((plan, index) => {
								      const isPopular = index === 1;

								      return isPopular ? (
								        // ⭐️ Special card for index === 2 (MOST POPULAR)
								        <div key={plan.id || index} className="relative flex-1 max-w-sm">
								          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg z-10">
								            MOST POPULAR
								          </div>
								          <Card className="bg-white rounded-xl shadow-2xl p-6 text-center border-4 border-red-500">
								            <h2 className="text-xl font-semibold mb-2 uppercase">{plan.name}</h2>
								            <p className="text-4xl font-bold mb-4">€{plan.amount/100}</p>
								            <ul className="space-y-2 mb-6 text-sm text-gray-600">
								            	<li>{plan.description}</li>
								                {singlePlan.description && singlePlan.description.map((i, index) => (
													<li key={index}>{i}</li>
												))}
								            </ul>
								            <button
								              onClick={() => handlePlanClick(plan.name)}
								              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 cursor-pointer"
								            >
								              Choose Plan
								            </button>
								          </Card>
								        </div>
								      ) : (
								        // Default card
								        <Card
								          key={plan.id || index}
								          className="flex-1 max-w-sm bg-white rounded-xl shadow-lg p-6 text-center"
								        >
								          <h2 className="text-xl font-semibold mb-2 uppercase">{plan.name}</h2>
								          <p className="text-4xl font-bold mb-4">€{plan.amount / 100}</p>
								          <ul className="space-y-2 mb-6 text-sm text-gray-600">
								            <li>{plan.description}</li>
								          	{singlePlan.description && singlePlan.description.map((i, index) => (
												<li key={index}>{i}</li>
											))}
								          </ul>
								          <button
								            onClick={() => handlePlanClick(plan.name)}
								            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 cursor-pointer"
								          >
								            Choose Plan
								          </button>
								        </Card>
								      );
								})}
								{/*</div>*/}
							</div>

							<div className="flex flex-row items-center justify-center gap-2 py-3 bg-gray-100 sm:hidden">
								{plans &&
								    plans.map((plan, index) => {
								      const isPopular = index === 1;

								      return isPopular ? (
								        // ⭐️ Special card for index === 2 (MOST POPULAR)
										<div key={plan.id || index} className="relative flex-1">
										    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg z-10">
										      MOST POPULAR
										    </div>
										    <Card className="bg-white rounded-xl shadow-2xl p-3 text-center border-4 border-red-500"
										    	onClick={() => handleClick(plan.name, plan.amount, [plan.description, ...singlePlan.description])}>
										      	<h2 className="text-lg font-semibold mb-2 uppercase">{plan.name}</h2>
									            <p className="text-xl font-bold mb-4">€{plan.amount/100}</p>
									            <ul className="space-y-2 mb-6 text-sm text-gray-600">
									            	<li>{plan.description}</li>
								            	</ul>
										    </Card>
									  	</div>
									  ) : (
										<Card
											key={plan.id || index} 
											className="flex-1 bg-white rounded-xl shadow-lg p-3 text-center"
											onClick={() => handleClick(plan.name, plan.amount, [plan.description, ...singlePlan.description])}>
										      	<h2 className="text-lg font-semibold mb-2 uppercase">{plan.name}</h2>
									            <p className="text-xl font-bold mb-4">€{plan.amount/100}</p>
									            <ul className="space-y-2 mb-6 text-sm text-gray-600">
									            	<li>{plan.description}</li>
									            </ul>
										</Card>
									  );
								})}
							</div>

							<div className="h-3 bg-gray-300 w-full sm:hidden" />

							<div className="flex flex-col gap-3 p-3 sm:hidden bg-gray-100 border-0">
								{singlePlan && (
									<>
										<h2 className="text-xl text-center font-semibold mb-2 uppercase">{singlePlan.name}</h2>
										<div className="flex justify-between items-center">
											<span>Total amount</span>
											<span className="text-2xl font-bold mb-4">${singlePlan.amount/100}</span>
										</div>
										<ul className="space-y-2 text-sm text-gray-600">
											{singlePlan.description && singlePlan.description.map((i, index) => (
												<li key={index} className="capitalize">{i}</li>
											))}
										</ul>
										<button onClick={() => handlePlanClick(singlePlan.name)} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 cursor-pointer">
									      Choose Plan
									    </button>
									</>
								)}
							</div>

							<div className="h-20 md:h-30 bg-transparent w-full lg:hidden" />
						</div>
						<div className="text-black md:col-span-1 border-0"></div>
					</>
				)}
			</Outer>
		</Layout>
	)
}

export default Pricing;
