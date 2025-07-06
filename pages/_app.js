import "../styles/globals.css";
import CommonLayout from "@/layout/commonLayout";
import LoginLayout from "@/layout/loginLayout";
import {
  checkBotUserAgent,
  checkUserDeviceTypeByUserAgent,
} from "@/utilities/utils";

export default function MyApp({ Component, pageProps, isBotAgent, isMobile }) {
  const selectLayout = (component) => {
    if (typeof Component.layoutName !== "undefined") {
      if (Component.layoutName == "login") {
        return <LoginLayout>{component}</LoginLayout>;
      }
    }

    return <CommonLayout pageProps={pageProps}>{component}</CommonLayout>;
  };

  return (
    <>
      {/* <Head>
				<FontLoad />
			</Head> */}
      <>
        {selectLayout(
          <Component
            isMobile={isMobile}
            isBotAgent={isBotAgent}
            {...pageProps}
          />
        )}
      </>
    </>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    isMobile: ctx?.req?.headers["user-agent"]
      ? checkUserDeviceTypeByUserAgent(ctx.req.headers["user-agent"])
      : false,
    isBotAgent: ctx?.req?.headers["user-agent"]
      ? checkBotUserAgent(ctx.req.headers["user-agent"])
      : false,
  };
};
