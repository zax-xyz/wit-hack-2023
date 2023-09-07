import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import globalStyles from "~/styles/globalStyles";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  globalStyles();
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
        }}
      />
    </div>
  );
};

export default api.withTRPC(MyApp);
