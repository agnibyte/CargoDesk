import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import CommonLayout from "@/layout/commonLayout";
import {
  checkBotUserAgent,
  checkUserDeviceTypeByUserAgent,
} from "@/utilities/utils";

export default function MyApp({ Component, pageProps, isBotAgent, isMobile }) {
  return (
    <CommonLayout>
      <Component
        isMobile={isMobile}
        isBotAgent={isBotAgent}
        {...pageProps}
      />
    </CommonLayout>
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
