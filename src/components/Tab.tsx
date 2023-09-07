import { Tab as HUITab } from "@headlessui/react";
import tw, { styled } from "twin.macro";

import type { ReactNode } from "react";

const StyledTab = styled(HUITab, {
  ...tw`
    flex-1 px-4 py-1 border border-transparent rounded
    focus-visible:(outline-none ring ring-violet-200/50)
    ui-selected:(bg-white shadow-sm border-violet-300)
  `,
});

const TabList = styled(HUITab.List, tw`flex gap-2 p-1 bg-slate-50 rounded`);

const Tab = Object.assign(StyledTab, {
  Group: HUITab.Group,
  List: TabList,
  Panels: HUITab.Panels,
  Panel: HUITab.Panel,
});

export default Tab;

type TabsProps = {
  tabs: Record<string, ReactNode>;
  /**
   * This should only be disabled if there is a focusable element inside every panel
   */
  disablePanelTab?: boolean;
};
export const Tabs = ({ tabs, disablePanelTab }: TabsProps) => (
  <Tab.Group>
    <Tab.List>
      {Object.keys(tabs).map((name) => (
        <Tab key={name}>{name}</Tab>
      ))}
    </Tab.List>
    <Tab.Panels>
      {Object.entries(tabs).map(([name, element]) => (
        <Tab.Panel key={name} tabIndex={disablePanelTab ? -1 : undefined}>
          {element}
        </Tab.Panel>
      ))}
    </Tab.Panels>
  </Tab.Group>
);
