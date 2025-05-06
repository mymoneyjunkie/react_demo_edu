import { Fragment, useRef, useState, useEffect } from 'react';

import { Link, useNavigate, useLocation } from "react-router-dom";

import { FaEnvelope, FaLock, FaArrowRight, FaEyeSlash, FaEye } from "react-icons/fa6";

import { Outer, Loader } from "../index";

import axiosInstance, { axiosPrivate } from '../../api/axios';

import { connect } from "react-redux";

import { setCurrentUser } from "../../redux/user/user.actions";

const Login = ({setCurrentUser}) => {
	const userRef = useRef();
	const errRef = useRef();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/home';

	const [ userInput, setUserInput ] = useState({
		email: '',
		password: ''
	})

	const [ inputError, setInputError ] = useState({
		email: '',
		password: ''
	})

	const [ showPassword, setShowPassword ] = useState(false);
	const [ errMsg, setErrMsg ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
		setInputError({
			email: '',
			password: ''
		})
	}, [ userInput.email, userInput.password ])

	const handleEmailChange = (e) => {
		setUserInput((prevState) => {
			return {...prevState,
			email: e.target.value}
		})
	}

	const handlePasswordChange = (e) => {
		setUserInput((prevState) => {
			return {...prevState,
			password: e.target.value}
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		// console.log(userInput);

    	if (!userInput.email || !userInput.password) {
    		setInputError((prevState) => {
	    		return {
	    			...prevState,
	    			email: userInput.email === '' ? true : false,
	    			password: userInput.password === '' ? true : false
	    		}
	    	});
    		return;
    	}

    	else {
	    	try {
	    		setIsLoading(true);

				const response = await axiosInstance.post('/api/v1/auth/login',
	    			{
					    email: userInput.email,
					    password: userInput.password,
					},
					{
					    headers: {
					      'Content-Type': 'application/json', // Send data as JSON
					    },
					    withCredentials: true,
					}
	    		);

	    		// console.log(JSON.stringify(response.data));

	    		if (response.data && response.data.isSuccess) {
	    			setUserInput({
	    				email: '',
	    				password: ''
	    			})

	    			setCurrentUser({
					  email: userInput.email,
					  token: response.data.token
					});

	    			navigate(from, { replace: true });
	    		}

	    		else {
	    			setErrMsg("Login Failed...");
	    		}
	    	}

	    	catch (error) {
	    		// console.log(error?.response.data);
	    		if (!error?.response) {
	    			setErrMsg("Failed to Login In. Try Again...");
	    		}
	    		else if (error.response.data?.statusCode === 400 && !error.response.data?.isSuccess) {
	    			setErrMsg(error.response?.data.message);
	    		}

	    		else if (error.response.data?.statusCode === 401) {
	    			setErrMsg(error.response?.data.message)
	    		}

	    		else {
	    			setErrMsg("Login Failed...");
	    		}

	    		// errRef.current.focus();
	    	}

	    	finally {
		      setIsLoading(false); // Stop loading after request completes
		    }

		    errRef.current?.focus();
	    }
	}

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	}

	return (
		<Fragment>
			<Outer className="min-h-screen items-center justify-center bg-gray-950">
				{isLoading ? (
				  	<Loader />
				) : (
					<>
						<div className="text-black sm:col-span-3 lg:col-span-4 border-0"></div>
						<div className="text-black sm:col-span-6 lg:col-span-4 bg-gray-900 flex flex-col justify-between p-6 md:py-0 lg:py-0 border-0 rounded-lg shadow-md">
							{errMsg && (<p 
								ref={errRef} 
								className="sm:text-xl lg:text-4xl sm:mt-5 md:mt-15 lg:mt-20 p-2 text-center border-2 border-red-500 mb-4 text-red-400"
								aria-live="assertive"
								>
									{errMsg}
								</p>)
							}
							<p className={`text-2xl text-white sm:text-2xl md:text-4xl ${errMsg === '' && 'sm:mt-5 md:mt-15 lg:mt-20'}`}>Login</p>
							<p className="text-base text-gray-400 mt-2 mb-8">Please sign in to continue</p>

							<form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
								<div className="mb-5">
								  <div className="relative">
								    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
								      <FaEnvelope />
								    </span>
								    <input
								      type="email"
								      id="email"
								      ref={userRef}
								      autoComplete="off"
								      className={`w-full px-10 py-2 rounded-xl shadow-xl bg-transparent text-white border-1 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputError.email ? 'border-2 border-red-500 focus:ring-0' : ''}`}
								      placeholder="EMAIL"
								      aria-describedby="emailHelp"
								      value={userInput.email}
								      onChange={handleEmailChange}
								    />
								  </div>
								  {inputError.email && (
							          <p className="text-red-500 text-sm mt-2">Please enter a valid email.</p>
							        )}
								</div>

								<div className="mb-8">
								  <div className="relative">
								    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
								      <FaLock />
								    </span>
								    <input
								      type={showPassword ? 'text' : 'password'}
								      id="password"
								      className={`w-full px-10 py-2 rounded-xl shadow-xl bg-transparent text-white border-1 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputError.password ? 'border-2 border-red-500 focus:ring-0' : ''}`}
								      placeholder="PASSWORD"
								      value={userInput.password}
								      onChange={handlePasswordChange}
								    />
								    <span
							          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
							          onClick={togglePasswordVisibility}
							        >
							          { showPassword ? <FaEyeSlash /> : <FaEye /> }
							        </span>
								  </div>
								  {inputError.password && (
							          <p className="text-red-500 text-sm mt-2">Your password must contain between 8 and 24 characters.</p>
							        )}
								</div>

								<div className="mb-5 flex items-center">
									<button type="submit" className="bg-blue-500 w-full font-medium text-lg text-white px-6 py-2 flex justify-center rounded-full hover:bg-blue-600">
										LOGIN
									</button>
								</div>
							</form>

							<p className="text-center text-md mb-2 sm:mt-5 md:mt-15 lg:mt-20 text-gray-400 font-medium">Don't have an account? 
								<Link to="/register" className="text-white font-medium hover:text-blue-500"> Sign up</Link>
							</p>
						</div>
						<div className="text-black sm:col-span-3 lg:col-span-4 border-0"></div>
					</>
				)}
			</Outer>
		</Fragment>
	);
};

const mapDispatchToProps = dispatch => ({
	setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Login);
