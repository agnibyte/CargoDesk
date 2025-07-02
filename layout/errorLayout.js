import TopHeader from "@/common/layout/topHeader";

export default function CommonLayout({ children }) {
	return (
		<>
			<TopHeader />
			{/* <MainHeader isMobile={children.props.isMobile} /> */}
			{children}
		</>
	);
}
