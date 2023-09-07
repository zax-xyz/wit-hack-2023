/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
import {
  ArrowRightOnRectangleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import MapGl, {
  type GeoJSONSourceRaw,
  Layer,
  type MapLayerMouseEvent,
  Popup,
  Source,
} from "react-map-gl";
import tw, { styled, theme } from "twin.macro";
import "mapbox-gl/dist/mapbox-gl.css";

import Input from "~/components/Input";
// import logo from "../../logo.png";
import Transition from "~/components/Transition";
import Link from "next/link";
import { api } from "~/utils/api";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { loggedInAtom } from "~/atoms/user";
import Button from "~/components/Button";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import { getIsAuthenticated } from "~/utils/getUser";
import { OpenInNew } from "@mui/icons-material";

const StyledPopup = styled(Popup, {
  ...tw`filter drop-shadow-md`,
  // ...tw`backdrop-blur`,

  "& .mapboxgl-popup-tip": tw`border-t-white/90`,

  "& .mapboxgl-popup-content": {
    ...tw`shadow-none rounded pr-8 text-black bg-white/90`,
    "& button": tw`text-lg px-2 py-1`,
  },
});

const sidebarLGAs = [
  { name: "Bathurst Regional Council", highDemand: true, active: true },
  { name: "Lithgow City Council", highDemand: true, active: false },
  { name: "Oberon Council", highDemand: false, active: false },
  { name: "Blayney Shire Council", highDemand: false, active: false },
  { name: "Cabonne Shire Council", highDemand: false, active: false },
  { name: "Orange City Council", highDemand: false, active: false },
  { name: "Mid-Western Regional Council", highDemand: false, active: false },
  { name: "Cowra Shire Council", highDemand: false, active: false },
];

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

const Map = ({
  isAuthenticated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useHydrateAtoms([[loggedInAtom, isAuthenticated]]);
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);

  const [showPopup, setShowPopup] = useState(false);
  const [popupCoords, setPopupCoords] = useState({ longitude: 0, latitude: 0 });
  const [popupTitle, setPopupTitle] = useState("");

  const { data: { LocalGovernmentArea: LGAs } = {}, isLoading: lgasLoading } =
    api.data.getLGAs.useQuery();
  const {
    data: { LocalGovernmentArea: LGAsRed } = {},
    isLoading: lgasRedLoading,
  } = api.data.getLGAsRed.useQuery();

  const { mutate: logout } = api.user.logout.useMutation({
    onSuccess: () => {
      setLoggedIn(false);
    },
  });

  const togglePopup = (e: MapLayerMouseEvent) => {
    setShowPopup(!showPopup);
    const { lng: longitude, lat: latitude } = e.lngLat;
    setPopupCoords({ longitude, latitude });
    setPopupTitle(e.features?.[0]?.properties?.councilname as string);
  };

  const handleClickLGA = () => {
    setShowPopup(true);
  };

  return (
    <div tw="flex flex-col flex-1 h-screen">
      <header tw="z-20 p-4 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md">
        <div tw="mx-auto max-w-7xl">
          <div tw="flex items-center">
            <Link tw="text-xl" href="/">
              Plastech
            </Link>
            <div tw="flex ml-auto gap-2">
              {loggedIn ? (
                <Button onClick={() => logout()}>
                  Logout
                  <ArrowRightOnRectangleIcon tw="w-6 h-6" />
                </Button>
              ) : (
                <Button as={Link} href="/auth">
                  Login
                </Button>
              )}
            </div>
          </div>
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
        </div>
      </header>
      <div tw="flex h-full min-h-0">
        <div tw="flex flex-col flex-shrink-0 w-96 h-full overflow-y-auto shadow-md z-10 bg-white">
          <h2 tw="text-xl p-4">Local Government Areas</h2>
          {lgasLoading || lgasRedLoading ? (
            <div
              className="flex flex-1 items-center justify-center"
              role="status"
              aria-label="loading"
            >
              <svg
                aria-hidden="true"
                className="mr-2 h-8 w-8 animate-spin fill-gray-600 text-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            sidebarLGAs.map(({ name, active, highDemand }) => (
              <div
                key={name}
                tw="flex flex-col p-4 rounded cursor-pointer select-none hover:bg-gray-50"
                css={{ ...(active && tw`bg-violet-50 hover:bg-violet-100`) }}
                onClick={handleClickLGA}
              >
                <p tw="flex items-center font-medium gap-1">
                  {highDemand && (
                    <ExclamationCircleIcon
                      strokeWidth={2}
                      tw="w-4 h-4 text-red-600"
                    />
                  )}{" "}
                  {name}, NSW
                </p>
                <p>Shortage Level: {highDemand === true ? "HIGH" : "LOW"}</p>
                <p>Contact Info: {name.split(" ")[0]} Hospital 0412 345 678</p>
                <a href="https://www.google.com/" tw="underline text-blue-500">
                  Medical supplies in this LGA
                  <OpenInNew />
                </a>
              </div>
            ))
          )}
        </div>
        <MapGl
          tw="border-none"
          initialViewState={{
            latitude: -33.4612,
            longitude: 149.7787,
            zoom: 9,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken="pk.eyJ1IjoidXRhdGEtaW5hbml0eSIsImEiOiJjbDl0eG5mcDgxcjBhNDFvMGp0ajk2MHFpIn0.cY6quNmJDnW3qwXFSjy8cA"
          onClick={togglePopup}
          interactiveLayerIds={["lgas-layer", "lgas-layer-red"]}
        >
          {LGAs && (
            <Source type="geojson" data={LGAs as GeoJSONSourceRaw["data"]}>
              <Layer
                id="lgas-layer"
                type="fill"
                paint={{
                  "fill-color": "rgba(156, 163, 175, 15%)",
                  "fill-outline-color": theme`colors.violet.500`,
                }}
              />
            </Source>
          )}
          {LGAsRed && (
            <Source type="geojson" data={LGAsRed as GeoJSONSourceRaw["data"]}>
              <Layer
                id="lgas-layer-red"
                type="fill"
                paint={{
                  "fill-color": "rgba(239, 68, 68, 15%)",
                  "fill-outline-color": theme`colors.red.500`,
                }}
              />
            </Source>
          )}
          {showPopup && (
            <Transition
              appear
              show
              enter={tw`transition [&+.mapboxgl-popup>*]:(transition)`}
              enterFrom={tw`[&+.mapboxgl-popup>*]:(translate-y-2 opacity-0)`}
            >
              <StyledPopup
                {...popupCoords}
                anchor="bottom"
                onClose={() => setShowPopup(false)}
              >
                <h4 tw="font-bold">{popupTitle}</h4>
                <p>TODO</p>
              </StyledPopup>
            </Transition>
          )}
        </MapGl>
      </div>
    </div>
  );
};

export default Map;
