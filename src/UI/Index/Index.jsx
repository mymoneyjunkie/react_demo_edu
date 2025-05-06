import { Fragment, useRef, useState, useEffect } from "react";

import { useNavigate, useLocation, Link } from "react-router-dom";

import { IoFitness } from "react-icons/io5";

import { Outer, Loader } from "../../components/index";

import cc1 from '../../assets/cc1.png';
import card4 from '../../assets/card4.png';
import card2 from '../../assets/card2.png';
import card5 from '../../assets/card5.png';
import card6 from '../../assets/card6.png';

import socket from '../../socket/socket';

import { getDeviceId } from '../../DeviceId/deviceId';

import axiosInstance, { axiosPrivate } from '../../api/axios';

import { connect } from "react-redux";

import { setCurrentUser } from "../../redux/user/user.actions";

const Index = ({setCurrentUser}) => {
	const errRef = useRef();
	const [isSocketReady, setIsSocketReady] = useState(false);
  	const [paymentConfirmed, setPaymentConfirmed] = useState(null);

  	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/login';

	const [ token, setToken ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ errMsg, setErrMsg ] = useState(null);

	const urlParams = new URLSearchParams(window.location.search);
  	const tokenParam = urlParams.get("token");

  	// console.log(tokenParam);

  	useEffect(() => {
	  const urlParams = new URLSearchParams(window.location.search);
	  const tokenParam = urlParams.get("token");
	  setToken(tokenParam); // This runs only once after mount
	}, []);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getUser = async () => {
		  	try {
			    const response = await axiosInstance.post("/api/v1/generate/token-verify",
			      	{ short_token: token },
					{
					    headers: {
					      'Content-Type': 'application/json', // Send data as JSON
					    },
					    withCredentials: true,
					    signal: controller.signal
					}
	    		);

	    		// console.log(response.data);
			    
			    if (isMounted && response.data?.isSuccess) {
			      setIsLoading(false);
			      setCurrentUser({
					  email: response.data.user,
					  token: response.data.token
					});
			      navigate("/home");
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
	                }, 5000);

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
			    	console.log("Error fetching plans:", error);
			    	return;
			    }
		  	}
		};

		token && getUser();

		return () => {
			isMounted = false;
			controller.abort();
		}
	}, [token]);

	// useEffect(() => {
	//     socket.connect();

	//     const deviceID = getDeviceId();

	//     console.log(deviceID);

	//     socket.on("connect", () => {
	//       console.log("Connected:", socket.id);
	//     	console.log("deviceID", deviceID);
	      
	//       // Example: register deviceID
	//       socket.emit("register", { deviceID: deviceID });
	//       setIsSocketReady(true);
	//       // window.open(`https://buy.stripe.com/test_fZe2bI7RVckb2GI28b?client_reference_id=${deviceID}`, '_blank')
	//     });

	//     socket.on("success", (data) => {
	//       console.log("Received success:", data);
	//       // Do something on success
	//       setPaymentConfirmed(true);
	//     });

	//     socket.on("disconnect", () => {
	//       console.log("Disconnected from server");
	//     });

	//     return () => {
	//       socket.disconnect();
	//     };
	// }, []);

	return (
		<Fragment>
			<Outer
			  	className="bg-[linear-gradient(145deg,_oklch(62.3%_0.214_259.815),_oklch(55.8%_0.288_302.321))] min-h-screen items-center justify-center"
			>
			  	<div className="text-white sm:col-span-3 md:col-span-2 lg:col-span-3 border-0"></div>
			  	<div className="text-white sm:col-span-6 md:col-span-8 lg:col-span-6 bg-black border-l-2 border-l-white rounded-4xl shadow-xl flex flex-col py-6 px-4 sm:px-6 md:p-10 overflow-x-hidden">
			  		{errMsg && (<p 
						ref={errRef} 
						className="sm:text-xl lg:text-4xl sm:mb-5 md:mb-3 p-2 text-center border-2 border-red-500 mb-4 text-red-400"
						aria-live="assertive"
						>
							{errMsg}
						</p>)
					}

			  		<nav className="flex items-center justify-between md:p-0 mb-5">
			  			<div className="uppercase font-medium text-2xl flex flex-start items-center">
			  				<IoFitness className="text-red-500 mr-2" fontSize={27} />fitness
			  			</div>

			  			<div className="mr-5 md:mr-0">
			  				<button 
							  	className="bg-[linear-gradient(145deg,_oklch(62.3%_0.214_259.815),_oklch(55.8%_0.288_302.321))] 
							        hover:bg-[linear-gradient(145deg,_oklch(50%_0.214_259.815),_oklch(45%_0.288_302.321))] 
							        py-3 px-6 cursor-pointer rounded-full uppercase transition duration-300"
							    onClick={() => navigate(from, { replace: true })}
							>
							  sign up
							</button>
			  			</div>
			  		</nav>

			  		{/*<section className="flex flex-wrap items-center gap-6 bg-gradient-to-r from-black via-50% via-purple-200 via-5% via-black via-50% to-black">
						<div className="flex-1 text-wrap text-white text-3xl">
						    Secure payments, seamlessly connected to your app
						</div>*/}
					<section className="flex flex-col md:flex-row md:flex-wrap items-center gap-3 md:gap-6 border-0">
						<div className="flex-1 text-wrap text-white text-xl md:text-3xl border-0">
						  Secure payments, seamlessly connected to your app
						</div>

						<div className="flex-shrink-0 w-90 h-50 md:w-80 md:h-48 border-0">
						    {/*<img
						      src="https://img.freepik.com/free-vector/isometric-glass-effect-credit-card-template_52683-73869.jpg"
						      alt="Credit Card Illustration"
						      className="w-full h-full object-cover rounded-xl"
						    />*/}

			  				{/*<img
						      src="https://img.freepik.com/free-vector/credit-card-coming-out-mobile-concept-background_1017-36141.jpg?ga=GA1.1.101606333.1745572617&semt=ais_hybrid&w=740"
						      alt="Credit Card Illustration"
						      className="w-full h-full object-cover rounded-xl"
						    />*/}

						    <img
						      src={card5}
						      alt="Credit Card Illustration"
						      className="w-full h-full object-cover rounded-xl"
						    />
			  			</div>
			  		</section>

			  		<section className="mt-3 p-2 border-0 flex flex-row justify-between xd:inline-block">
			  			<button 
							  	className="bg-[linear-gradient(145deg,_oklch(62.3%_0.214_259.815),_oklch(55.8%_0.288_302.321))] 
							        hover:bg-[linear-gradient(145deg,_oklch(50%_0.214_259.815),_oklch(45%_0.288_302.321))] 
							        py-2 px-4 cursor-pointer rounded-full uppercase transition duration-300"
							    onClick={() => navigate(from, { replace: true })}
							>
							  get started
						</button>

						<button className="text-white capitalize ml-5 text-base hover:text-gray-500">
							Learn More
						</button>
			  		</section>

			  		<section className="mt-3 p-2 border-0 flex gap-4 items-center">
					  <div className="flex flex-col text-white">
					    <p className="text-xl">16%</p>
					    <p className="text-xs">Less commission</p>
					  </div>

					  <div className="w-px h-8 bg-gray-700" />

					  <div className="flex flex-col text-white">
					    <p className="text-xl">25K</p>
					    <p className="text-xs">Registered Users</p>
					  </div>

					  <div className="w-px h-8 bg-gray-700" />

					  <div className="flex flex-col text-white">
					    <p className="text-xl">95%</p>
					    <p className="text-xs">Effective Trading</p>
					  </div>
					</section>
			  	</div>
			  	<div className="text-white sm:col-span-3 md:col-span-2 lg:col-span-3 border-0"></div>
			</Outer>
		</Fragment>
	)
}

const mapDispatchToProps = dispatch => ({
	setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Index);