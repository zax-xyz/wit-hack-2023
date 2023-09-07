import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { useHydrateAtoms } from "jotai/utils";
import { useAtom } from "jotai";
import { loggedInAtom } from "~/atoms/user";
import { api } from "~/utils/api";
import { Fragment } from "react";
import { Popover } from "@headlessui/react";
import tw, { styled } from "twin.macro";
import Transition from "~/components/Transition";

type Props = {
  isAuthenticated: boolean;
  showInputs?: boolean;
};

const Navbar = ({ showInputs = false, isAuthenticated }: Props) => {
  useHydrateAtoms([[loggedInAtom, isAuthenticated]]);
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);

  const { mutate: logout } = api.user.logout.useMutation({
    onSuccess: () => {
      setLoggedIn(false);
    },
  });

  return (
    <header tw="z-20 p-4 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md">
      <div tw="mx-auto max-w-7xl">
        <div tw="flex items-center">
          <Link tw="text-xl" href={isAuthenticated ? "/map" : "/"}>
            Plastech
          </Link>
          <div tw="flex ml-auto gap-2">
            {loggedIn ? (
              <>
                <Button onClick={() => logout()}>
                  Logout
                  <ArrowRightOnRectangleIcon tw="w-6 h-6" />
                </Button>
                <ProfileButton />
              </>
            ) : (
              <Button as={Link} href="/auth?next=/map">
                Login
              </Button>
            )}
          </div>
        </div>
        {showInputs && (
          <div tw="flex py-4">
            <div tw="flex w-full text-black bg-white border border-gray-200 divide-x divide-gray-200 rounded-md shadow-sm">
              {/* 
              <select tw="pr-8 bg-transparent border-none focus-within:(border-violet-300 outline-none ring ring-violet-200/50) rounded-l-md">
                <option>All Categories</option>
              </select>
              */}
              <Input
                type="text"
                tw="flex-1 w-auto rounded-none shadow-none bg-transparent rounded-l-md"
                placeholder="I'm supplying..."
                nav
              />
              <div tw="relative flex">
                <div tw="absolute inset-y-0 left-0 flex items-center pl-1.5">
                  <MapPinIcon tw="w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  tw="w-auto rounded-none pl-7 bg-transparent"
                  defaultValue="New South Wales, AU"
                  nav
                />
              </div>
              <button
                type="button"
                tw="p-2 focus-visible:(border-violet-300 outline-none ring ring-violet-200/50) rounded-r-md"
              >
                <MagnifyingGlassIcon tw="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const ProfileButton = () => {
  const { data } = api.user.self.useQuery();

  return (
    <Popover tw="relative z-10">
      <Button as={Popover.Button}>
        My Profile
        <UserCircleIcon tw="w-6 h-6" />
      </Button>
      <Transition
        as={Fragment}
        enter={tw`transition ease-out duration-200`}
        enterFrom={tw`opacity-0 -translate-y-1`}
        leave={tw`transition ease-in duration-150`}
        leaveTo={tw`opacity-0 translate-y-0.5`}
      >
        <Popover.Panel tw="absolute top-11 right-0 w-max flex flex-col bg-white shadow-md rounded overflow-hidden">
          <div tw="px-4 py-2 text-gray-500 bg-gray-50 text-right">
            Logged in as <span tw="text-indigo-600">{data?.name}</span>
          </div>
          <div tw="px-2 py-2 flex flex-col gap-1 text-gray-600">
            <ItemButton as={Link} href="/productInventory">
              My Product Inventory
            </ItemButton>
            <ItemButton as={Link} href="/contactSuppliers">
              Contact Another Supplier
            </ItemButton>
          </div>
          <div tw="px-4 py-1.5 text-gray-600 bg-gray-50 flex justify-end text-sm">
            {data?.email}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

const ItemButton = styled.button(tw`
  px-2 py-1 flex items-center justify-end gap-1
  rounded-md transition
  hover:(bg-indigo-50 text-indigo-700)
  focus-within:(outline-none ring ring-indigo-600/50)
`);

export default Navbar;
