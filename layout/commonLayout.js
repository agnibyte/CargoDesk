// import Footer from "@/common/layout/footer";
import MainHeader from "@/components/layouts/mainHeader";
// import TopHeader from "@/components/layouts/topHeader";

export default function CommonLayout({ children, pageProps = {} }) {
  return (
    <>
      {/* <TopHeader /> */}
      <MainHeader pageData={pageProps.pageData} />
      {/* <MainHeader isMobile={children.props.isMobile} /> */}
      {children}
      {/* {process.env.NEXT_PUBLIC_BRAND_NAME == "fastrack" ? (
				<FtFooter isMobile={children.props.isMobile} />
			) : (
				<Footer />
			)} */}
    </>
  );
}
