import { Layout, Outer } from '../../components/index';

const Cancel = () => {
	return (
		<Layout>
			<Outer className="h-lvh mt-15">
				<div className="text-black md:col-span-1 border-0"></div>
				<div className="text-black md:col-span-10 bg-white border-0 pt-5 px-1">
					<h3>Failed...</h3>
				</div>
				<div className="text-black md:col-span-1 border-0"></div>
			</Outer>
		</Layout>
	)
}

export default Cancel;