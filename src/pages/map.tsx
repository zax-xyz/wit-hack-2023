/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
import {
  ArrowTopRightOnSquareIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useMemo, useState } from "react";
import MapGl, {
  type GeoJSONSourceRaw,
  Layer,
  type MapLayerMouseEvent,
  Popup,
  Source,
} from "react-map-gl";
import tw, { styled, theme } from "twin.macro";
import "mapbox-gl/dist/mapbox-gl.css";

import Transition from "~/components/Transition";
import { api } from "~/utils/api";
import { useHydrateAtoms } from "jotai/utils";
import { loggedInAtom } from "~/atoms/user";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import { getIsAuthenticated } from "~/utils/getUser";
import Navbar from "~/components/Navbar";
import { type LGAs } from "~/server/api/routers/data";
import Slider from "~/components/Slider";

const StyledPopup = styled(Popup, {
  ...tw`filter drop-shadow-md`,
  // ...tw`backdrop-blur`,

  "& .mapboxgl-popup-tip": tw`border-t-white/90`,

  "& .mapboxgl-popup-content": {
    ...tw`shadow-none rounded pr-8 text-black bg-white/90`,
    "& button": tw`text-lg px-2 py-1`,
  },
});

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
  const [selectedCouncil, setSelectedCouncil] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupCoords, setPopupCoords] = useState({ longitude: 0, latitude: 0 });
  const [predictedScarcity, setPredictedScarcity] = useState<
    Record<string, Record<string, number>>
  >({});
  const [years, setYears] = useState<Record<string, number>>({});

  const { data } = api.data.getLGAs.useQuery();
  const { data: scarcityLevels } = api.data.getScarcityLevels.useQuery();

  const getScarcity = useCallback(
    (council: string) => {
      const originalScarcity = scarcityLevels![council]!;

      const year = years[council];
      if (year === undefined || year === 2023) {
        return originalScarcity;
      }

      const predictedScarcities = { ...predictedScarcity[council] };
      const prevPredicted = predictedScarcities[year];
      if (prevPredicted !== undefined) {
        return prevPredicted;
      }

      const predicted =
        Math.round(
          (originalScarcity + -0.5 + Math.random() + Number.EPSILON) * 10
        ) / 10;
      predictedScarcities[year] = predicted;
      setPredictedScarcity({
        ...predictedScarcity,
        [council]: predictedScarcities,
      });
      return predicted;
    },
    [predictedScarcity, years, scarcityLevels]
  );

  const lgas = useMemo(() => {
    if (!data) {
      return undefined;
    }
    return (JSON.parse(data) as LGAs).LocalGovernmentArea;
  }, [data]);

  const sortedLGAs = useMemo(() => {
    if (!scarcityLevels || !lgas) {
      return lgas;
    }
    return {
      ...lgas,
      features: lgas.features.sort(
        (a, b) =>
          scarcityLevels[a.properties.councilname]! -
          scarcityLevels[b.properties.councilname]!
      ),
    };
  }, [lgas, scarcityLevels]);

  const LGAsNeedsMet = useMemo(
    () => ({
      ...lgas,
      features: lgas?.features.filter((f) => {
        const scarcity = scarcityLevels?.[f.properties.councilname];
        return scarcity !== undefined && scarcity >= 3.5;
      }),
    }),
    [lgas, scarcityLevels]
  );

  const LGAsNeedsNotMet = useMemo(
    () => ({
      ...lgas,
      features: lgas?.features.filter((f) => {
        const scarcity = scarcityLevels?.[f.properties.councilname];
        return scarcity !== undefined && scarcity < 3.5;
      }),
    }),
    [lgas, scarcityLevels]
  );

  const togglePopup = (e: MapLayerMouseEvent) => {
    setShowPopup(!showPopup);
    const { lng: longitude, lat: latitude } = e.lngLat;
    setPopupCoords({ longitude, latitude });
    setSelectedCouncil(
      !showPopup ? (e.features?.[0]?.properties?.councilname as string) : ""
    );
  };

  return (
    <div tw="flex flex-col flex-1 h-screen">
      <Navbar isAuthenticated={isAuthenticated} showInputs />
      <div tw="flex h-full min-h-0">
        <div tw="flex flex-col flex-shrink-0 w-96 h-full overflow-y-auto shadow-md z-10 bg-white">
          <h2 tw="text-xl p-4">Local Government Areas</h2>
          {!sortedLGAs || !scarcityLevels ? (
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
            sortedLGAs.features.map((lga, i) => (
              <div
                key={lga.properties.councilname}
                tw="flex flex-col p-4 rounded cursor-pointer select-none hover:bg-gray-50"
                css={{
                  ...(selectedCouncil === lga.properties.councilname &&
                    tw`bg-violet-50 hover:bg-violet-100`),
                }}
                onClick={() => setSelectedCouncil(lga.properties.councilname)}
              >
                <p tw="flex items-center font-medium gap-1">
                  {i < LGAsNeedsNotMet.features!.length && (
                    <ExclamationCircleIcon
                      strokeWidth={2}
                      tw="w-4 h-4 text-red-600"
                    />
                  )}{" "}
                  {lga.properties.councilname}, NSW
                </p>
                <div>
                  <p>Score: {getScarcity(lga.properties.councilname)}</p>
                  <div tw="flex gap-2">
                    <span>
                      Year: {years[lga.properties.councilname] ?? 2023}
                    </span>
                    <Slider
                      defaultValue={[2023]}
                      onValueChange={([value]) =>
                        setYears({
                          ...years,
                          [lga.properties.councilname]: value!,
                        })
                      }
                      min={2023}
                      max={2025}
                      step={1}
                    />
                  </div>
                </div>
                <p
                  css={{
                    ...(i < LGAsNeedsNotMet.features!.length &&
                      tw`text-red-600`),
                  }}
                >
                  In need
                </p>
                <p>
                  Shortage Level:{" "}
                  {i < LGAsNeedsNotMet.features!.length ? "HIGH" : "LOW"}
                </p>
                <p>
                  Contact Info: {lga.properties.councilname.split(" ")[0]}{" "}
                  Hospital 0412 345 678
                </p>
                <a
                  href="https://www.google.com/"
                  tw="underline text-blue-500 flex gap-1"
                >
                  Medical supplies in this LGA
                  <ArrowTopRightOnSquareIcon tw="h-5 w-5" />
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
          {LGAsNeedsMet && (
            <Source
              type="geojson"
              data={LGAsNeedsMet as GeoJSONSourceRaw["data"]}
            >
              <Layer
                id="lgas-layer"
                type="fill"
                paint={{
                  "fill-color": "rgba(156, 163, 175, 15%)",
                  "fill-outline-color": theme`colors.green.500`,
                }}
              />
            </Source>
          )}
          {LGAsNeedsNotMet && (
            <Source
              type="geojson"
              data={LGAsNeedsNotMet as GeoJSONSourceRaw["data"]}
            >
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
                <h4 tw="font-bold">{selectedCouncil}</h4>
                <p>Score: {scarcityLevels![selectedCouncil]}</p>
                <p>
                  Shortage level:{" "}
                  {scarcityLevels![selectedCouncil]! >= 3.5 ? "low" : "high"}
                </p>
              </StyledPopup>
            </Transition>
          )}
        </MapGl>
      </div>
    </div>
  );
};

export default Map;
