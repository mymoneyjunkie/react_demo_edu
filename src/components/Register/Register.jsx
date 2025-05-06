import { Fragment, useState, useRef, useEffect } from 'react';

import { Link, useNavigate, useLocation } from "react-router-dom";

import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaEyeSlash, FaEye, FaUpload } from "react-icons/fa6";

import { Outer, Loader } from "../index";

import axios from 'axios';

import axiosInstance, { axiosPrivate } from '../../api/axios';

import { connect } from "react-redux";

import { setCurrentUser } from "../../redux/user/user.actions";

const Register = ({setCurrentUser}) => {
	const userRef = useRef();
	const errRef = useRef();

	const BASE_IMG_URL = import.meta.env.VITE_IMG_URL;

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/home';

	const [ userInput, setUserInput ] = useState({
		name: '',
		image: '',
		email: '',
		password: '',
		confirmPassword: ''
	})

	const [ showPassword, setShowPassword ] = useState({
		password: false,
		confirmPassword: false
	});

	const [ inputError, setInputError ] = useState({
		name: '',
		image: '',
		email: '',
		password: '',
		confirmPassword: ''
	})

	const [ errMsg, setErrMsg ] = useState('');
	const [ matchPwd, setMatchPwd ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(false);

	const NAME_REGEX = /^[A-Za-z ]+$/;
	const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const PASSWORD_REGEX = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{6,}$/;
	const IMAGE_REGEX = /^(?!.*\.avif$)(.*\.(jpg|jpeg|png|gif))$/;

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		if (userInput.name.trim() !== '') {
			const result = NAME_REGEX.test(userInput.name);

			setInputError((prevState) => {
				return {
					...prevState,
					name: result
				}
			})
		}
	}, [userInput.name])

	useEffect(() => {
		const result = EMAIL_REGEX.test(userInput.email);

		setInputError((prevState) => {
			return {
				...prevState,
				email: result
			}
		})
	}, [userInput.email])

	useEffect(() => {
		const result = IMAGE_REGEX.test(userInput.image);

		setInputError((prevState) => {
			return {
				...prevState,
				image: result
			}
		})
	}, [userInput.image])

	useEffect(() => {
		if (userInput.password.trim() !== '' || userInput.confirmPassword.trim() !== '') {
			const result = PASSWORD_REGEX.test(userInput.password);

			const matchPwd = userInput.password === userInput.confirmPassword;

			// console.log(result, !matchPwd);

			setMatchPwd(!matchPwd);

			setInputError((prevState) => {
				return {
					...prevState,
					password: result,
					confirmPassword: matchPwd
				}
			})
		}
	}, [userInput.password, userInput.confirmPassword])

	useEffect(() => {
		setErrMsg('');

		setInputError({
			name: '',
			image: '',
			email: '',
			password: '',
			confirmPassword: ''
		})
	}, [ userInput.email, userInput.password, userInput.image, userInput.name, userInput.confirmPassword ])

	const handleNameChange = (e) => {
		setUserInput((prevState) => {
			return {
				...prevState,
				name: e.target.value
			}
		})
	}

	const handleEmailChange = (e) => {
		setUserInput((prevState) => {
			return {
				...prevState,
				email: e.target.value
			}
		})
	}

	const handlePasswordChange = (e) => {
		setUserInput((prevState) => {
			return {
				...prevState,
				password: e.target.value
			}
		})
	}

	const handleConfirmPasswordChange = (e) => {
		setUserInput((prevState) => {
			return {
				...prevState, 
				confirmPassword: e.target.value
			}
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		// console.log(userInput);

		if (!userInput.email || !userInput.password || !userInput.name || !userInput.confirmPassword) {
    		setInputError((prevState) => {
	    		return {
	    			...prevState,
	    			email: userInput.email === '' ? true : false,
	    			password: userInput.password === '' ? true : false,
	    			name: userInput.name === '' ? true : false,
	    			image: userInput.image === '' ? true : false,
	    			confirmPassword: userInput.confirmPassword === '' ? true : false,
	    		}
	    	});
    		return;
    	}

    	else {
    		// console.log(userInput);
    		try {
    			setIsLoading(true);

				const response = await axiosInstance.post('/api/v1/auth/register',
	    			{
					    name: userInput.name,
						email: userInput.email,
						password: userInput.password,
						cpassword: userInput.confirmPassword,
						image: userInput.image
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
	    				name: '',
						image: '',
						email: '',
						password: '',
						confirmPassword: ''
	    			})

	    			setCurrentUser({
					  email: userInput.email,
					  token: response.data.token
					});

	    			navigate(from, { replace: true });
	    		}

	    		else {
	    			setErrMsg("Register Failed...");
	    		}
	    	}

	    	catch (error) {
	    		// console.log(error);
	    		if (!error?.response) {
	    			setErrMsg("Failed to Register. Try Again...");
	    		}
	    		else if (error.response.data?.statusCode === 400 && !error.response.data?.isSuccess) {
	    			setErrMsg(error.response?.data.message);
	    		}

	    		else if (error.response.data?.statusCode === 401) {
	    			setErrMsg(error.response?.data.message)
	    		}

	    		else {
	    			setErrMsg("Register Failed...");
	    		}

	    		// errRef.current.focus();
	    	}
	    	
	    	finally {
		      setIsLoading(false); // Stop loading after request completes
		    }

		    errRef.current?.focus();
    	}
	}

	const togglePasswordVisibility = (field) => {
	  	setShowPassword((prevState) => ({
	    	...prevState,
	    	[field]: !prevState[field], // <-- toggle only the selected field
	  	}));
	};

	const handleImageUpload = async (e) => {
	    const file = e.target.files[0];
	    if (file) {
	    	const reader = new FileReader();
				    reader.onloadend = () => {
				        setUserInput((prevState) => {
				        	return {
				        		...prevState,
				        		image: reader.result
				        	}
				        }); // Store image base64 preview
				        // console.log(reader.result);
				    };
				    reader.readAsDataURL(file); // Convert image to base64
		  	try {
				const data = new FormData();
		  		data.append('fileToUpload', file);

				let config = {
				  method: 'post',
				  maxBodyLength: Infinity,
				  url: BASE_IMG_URL,
				  headers: { },
				  data : data
				};

				const response = await axios.request(config);

	    		// console.log(JSON.stringify(response.data), response.data.image);

	    		if (response.data && response.data.isSuccess) {
	    			setUserInput((prevState) => {
	    				return {
	    					...prevState,
	    					image: response.data.image
	    				}
	    			})
	    		}

	    		else {
	    			setErrMsg("Failed to add image...");
	    			setUserInput((prevState) => {
	    				return {
	    					...prevState,
	    					image: ''
	    				}
	    			})
	    		}
			}

			catch (error) {
				setErrMsg("Failed to add image...");
			}
	    }
	};

	return (
		<Fragment>
			<Outer className="min-h-screen items-center justify-center md:py-5 bg-gray-950">
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
								tabIndex={-1}
								>
									{errMsg}
								</p>
							)}
							<p className={`font-medium text-white sm:text-2xl sm:font-normal ${errMsg === '' && 'lg:text-4xl sm:mt-5 mb-8'}`}>Create Account</p>

							<form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
								<div className="mb-8 border-0 flex flex-col items-center">
								    <div className="relative w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer">
								        {/* Upload Icon and Text */}
								        {!userInput.image ? (
								          <>
								            <label
								              htmlFor="image-upload"
								              className="absolute flex items-center justify-center cursor-pointer"
								            >
								              <FaUpload className="text-gray-500 w-6 h-6" />
								              <span className="ml-2 text-gray-400 text-sm">Upload Image</span>
								            </label>
								          </>
								        ) : (
								          <img
								            src={userInput.image.startsWith('data:image') 
											  ? userInput.image 
											  : `https://api.edugarciamovimiento.com/fitness/uploads/${userInput.image}`
											}
								            alt="Uploaded preview"
								            className="w-32 h-32 object-cover rounded-full"
								          />
								        )}
								        {/* Hidden File Input */}
								        <input
								          type="file"
								          id="image-upload"
								          accept="image/*"
								          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								          onChange={handleImageUpload}
								        />
								    </div>
								    {userInput.image && <button className="text-white border-2 border-red-300" onClick={deleteImage}>Delete</button>}
								</div>

								<div className="mb-8">
								  <div className="relative">
								    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
								      <FaUser />
								    </span>
								    <input
								      type="text"
								      id="name"
								      ref={userRef}
								      className={`w-full px-10 py-2 rounded-xl shadow-xl bg-transparent text-white border-1 border-gray-500s focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputError.name ? 'border-2 border-red-500 focus:ring-0' : ''}`}
								      placeholder="NAME"
								      value={userInput.name}
								      onChange={handleNameChange}
								    />
								  </div>
								  	{inputError.name && (
							          <p className="text-red-500 text-sm mt-2">Please enter a valid name.</p>
							        )}
								</div>

								<div className="mb-8">
								  <div className="relative">
								    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
								      <FaEnvelope />
								    </span>
								    <input
								      type="email"
								      id="email"
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
								      type={showPassword.password ? 'text' : 'password'}
								      id="password"
								      className={`w-full px-10 py-2 rounded-xl shadow-xl bg-transparent text-white border-1 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputError.password ? 'border-2 border-red-500 focus:ring-0' : ''}`}
								      placeholder="PASSWORD"
								      value={userInput.password}
								      onChange={handlePasswordChange}
								    />
								    <span
							          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
							          onClick={() => togglePasswordVisibility('password')}
							        >
							          { showPassword.password ? <FaEyeSlash /> : <FaEye /> }
							        </span>
								  </div>
								  	{inputError.password && (
							          <p className="text-red-500 text-sm mt-2">Your password must contain between 8 and 24 characters. 
							          Must include uppercase and lowercase letters, a number and a special character.</p>
							        )}
								</div>

								<div className="mb-8">
								  <div className="relative">
								    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
								      <FaLock />
								    </span>
								    <input
								      type={showPassword.confirmPassword ? 'text' : 'password'}
								      id="confirm-password"
								      className={`w-full px-10 py-2 rounded-xl shadow-xl bg-transparent text-white border-1 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${matchPwd ? 'border-2 border-red-500 focus:ring-0' : ''}`}
								      placeholder="CONFIRM PASSWORD"
								      value={userInput.confirmPassword}
								      onChange={handleConfirmPasswordChange}
								    />
								    <span
							          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
							          onClick={() => togglePasswordVisibility('confirmPassword')}
							        >
							          { showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye /> }
							        </span>
								  </div>
								  	{matchPwd && (
							          <p className="text-red-500 text-sm mt-2">Must match the above password.</p>
							        )}
								</div>

								<div className="mb-8 flex items-center">
									<button type="submit" className="bg-blue-500 w-full font-medium text-lg text-white px-6 py-2 flex justify-center rounded-full hover:bg-blue-600">
										SIGN UP
									</button>
								</div>
							</form>

							<p className="text-center mb-2 text-md sm:mt-5 text-gray-400 font-medium">Already have a account? 
								<Link to="/login" className="text-white font-medium hover:text-blue-800"> Sign In</Link>
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

export default connect(null, mapDispatchToProps)(Register);