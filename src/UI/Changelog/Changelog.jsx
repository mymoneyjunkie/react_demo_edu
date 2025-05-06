import { Layout, Outer } from '../../components';

const Changelog = () => {
	return (
		<Layout>
			<Outer className="h-auto">
				<div className="text-black md:col-span-3 border-0"></div>
				<div className="text-black md:col-span-6 bg-white flex flex-col gap-3 lg:gap-5 justify-start border-0 pt-5">		
				    <p className="text-4xl text-center mb-3">Changelog</p>

				    <div className="text-base">
				        <p className="text-lg mb-2 font-semibold">v1.4.0 <span className="">– April 28, 2025</span></p>
				        <ul className="list-disc list-inside space-y-2 ml-2">
				            <li>Added premium video filters and personalized workout recommendations.</li>
				            <li>Stripe payment bug resolved during subscription checkout.</li>
				            <li>Improved video upload speed for trainers.</li>
				        </ul>
				    </div>

				    <div className="text-base">
				        <p className="text-lg mb-2 font-semibold">v1.3.2 <span className="">– March 15, 2025</span></p>
				        <ul className="list-disc list-inside space-y-2 ml-2">
				            <li>Fixed autoplay issue on mobile browsers.</li>
				            <li>Enhanced password reset security.</li>
				        </ul>
				    </div>

				    <div className="text-base">
				        <p className="text-lg mb-2 font-semibold">v1.3.0 <span className="">– February 10, 2025</span></p>
				        <ul className="list-disc list-inside space-y-2 ml-2">
				            <li>Launched trainer profiles with social media integration.</li>
				            <li>Integrated Stripe checkout for in-app purchases.</li>
				        </ul>
				    </div>

				    <div className="text-base">
				        <p className="text-lg mb-2 font-semibold">v1.0.0 <span className="">– January 1, 2025</span></p>
				        <ul className="list-disc list-inside space-y-2 ml-2">
				            <li>Initial release of the fitness app with video library and user login.</li>
				        </ul>
				    </div>
				</div>
				<div className="text-black md:col-span-3 border-0"></div>

				<div className="col-span-12 h-30"></div>
			</Outer>
		</Layout>
	)
}

export default Changelog;