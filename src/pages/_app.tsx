import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import globalStyles from "~/styles/globalStyles";

const MyApp: AppType = ({ Component, pageProps }) => {
  globalStyles();
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
