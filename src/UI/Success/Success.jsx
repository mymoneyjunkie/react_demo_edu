import { Layout, Outer } from '../../components/index';

import { FaCheck } from "react-icons/fa";

const Success = () => {
	return (
		<Layout>
			<Outer className="h-lvh mt-15">
				<div className="text-black md:col-span-1 border-0"></div>
				<div className="text-black md:col-span-10 bg-white flex justify-center border-0 pt-0 md:pt-35 px-3 md:px-1">
					<div className="flex items-center border-0 gap-3 h-30 md:h-20">
						  <div className="m-1 lg:m-0 px-4 py-0 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 border-4 lg:border-2 border-green-500 rounded-full">
						    <FaCheck className="text-green-500 font-normal text-4xl md:text-5xl" />
						  </div>
						  
						<div className="font-semibold text-2xl md:text-4xl text-wrap">
							Your transaction was successful. Thank you for your payment!
						</div>
					</div>
				</div>
				<div className="text-black md:col-span-1 border-0"></div>
			</Outer>
		</Layout>
	)
}

export default Success;