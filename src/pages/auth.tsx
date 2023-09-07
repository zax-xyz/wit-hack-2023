import Card from "~/components/Card";
import { Tabs } from "~/components/Tab";

import LoginTab from "~/components/authTabs/LoginTab";
import SignupTab from "~/components/authTabs/SignupTab";

const tabs = {
  Login: <LoginTab />,
  "Sign Up": <SignupTab />,
};

const AuthPage = () => (
  <div className="flex flex-1 items-center justify-center">
    <Card>
      <Tabs tabs={tabs} disablePanelTab />
    </Card>
  </div>
);

export default AuthPage;
