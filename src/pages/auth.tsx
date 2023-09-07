import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Card from "~/components/Card";
import { Tabs } from "~/components/Tab";

import LoginTab from "~/components/authTabs/LoginTab";
import SignupTab from "~/components/authTabs/SignupTab";
import { getIsAuthenticated } from "~/utils/getUser";

const tabs = {
  Login: <LoginTab />,
  "Sign Up": <SignupTab />,
};

export const getServerSideProps: GetServerSideProps<{
  isAuthenticated: boolean;
  // eslint-disable-next-line @typescript-eslint/require-await
}> = async ({ req, res }) => {
  return {
    props: {
      isAuthenticated: getIsAuthenticated(req, res),
    },
  };
};

const AuthPage = ({
  isAuthenticated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      void router.push("/map");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card>
        <Tabs tabs={tabs} disablePanelTab />
      </Card>
    </div>
  );
};

export default AuthPage;
