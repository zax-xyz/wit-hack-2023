import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { promises as fs } from "fs";
import path from "path";

type LGA = {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number][][];
  };
  properties: {
    rid: number;
    startdate: string;
    enddate: string;
    lastupdate: string;
    msoid: number;
    centroidid: null;
    shapeuuid: string;
    changetype: string;
    processstate: null;
    urbanity: string;
    Shape__Length: number;
    Shape__Area: number;
    cadid: number;
    createdate: string;
    modifieddate: string;
    lganame: string;
    councilname: string;
    abscode: number;
    ltocode: number;
    vgcode: number;
    wbcode: null;
  };
};
export type LGAs = {
  LocalGovernmentArea: {
    type: string;
    features: LGA[];
  };
};

const scarcityLevels: Record<string, number> = {
  "KU-RING-GAI COUNCIL": 8.1,
  "WAVERLEY COUNCIL": 8.9,
  "BLAYNEY SHIRE COUNCIL": 3.2,
  "BURWOOD COUNCIL": 7.3,
  "BLACKTOWN CITY COUNCIL": 7.2,
  "COWRA SHIRE COUNCIL": 2.8,
  "GEORGES RIVER COUNCIL": 7.1,
  "OBERON COUNCIL": 5.4,
  "STRATHFIELD MUNICIPAL COUNCIL": 7.4,
  "CUMBERLAND COUNCIL": 6.8,
  "BAYSIDE COUNCIL": 7.0,
  "LITHGOW CITY COUNCIL": 5.9,
  "WINGECARRIBEE SHIRE COUNCIL": 6.1,
  "LAKE MACQUARIE CITY COUNCIL": 6.0,
  "NORTHERN BEACHES COUNCIL": 8.4,
  "LANE COVE MUNICIPAL COUNCIL": 8.0,
  "BATHURST REGIONAL COUNCIL": 3.5,
  "WOLLONDILLY SHIRE COUNCIL": 6.1,
  "FAIRFIELD CITY COUNCIL": 6.9,
  "MOSMAN MUNICIPAL COUNCIL": 7.2,
  "BLUE MOUNTAINS CITY COUNCIL": 6.6,
  "CITY OF PARRAMATTA COUNCIL": 7.3,
  "UPPER LACHLAN SHIRE COUNCIL": 6.0,
  "CESSNOCK CITY COUNCIL": 6.3,
  "HILLTOPS COUNCIL": 1.8,
  "NORTH SYDNEY COUNCIL": 8.1,
  "THE COUNCIL OF THE SHIRE OF HORNSBY": 7.7,
  "CENTRAL COAST COUNCIL": 6.4,
  "SUTHERLAND SHIRE COUNCIL": 7.4,
  "THE COUNCIL OF THE MUNICIPALITY OF HUNTERS HILL": 7.2,
  "MID-WESTERN REGIONAL COUNCIL": 1.8,
  "CAMDEN COUNCIL": 6.7,
  "CAMPBELLTOWN CITY COUNCIL": 6.9,
  "WOLLONGONG CITY COUNCIL": 6.8,
  "LIVERPOOL CITY COUNCIL": 7.3,
  "CANTERBURY-BANKSTOWN COUNCIL": 7.0,
  "INNER WEST COUNCIL": 7.9,
  "CABONNE SHIRE COUNCIL": 2.0,
  "ORANGE CITY COUNCIL": 3.5,
  "THE HILLS SHIRE COUNCIL": 6.8,
  "WOOLLAHRA MUNICIPAL COUNCIL": 9.2,
  "HAWKESBURY CITY COUNCIL": 6.5,
  "PENRITH CITY COUNCIL": 7.0,
  "RYDE CITY COUNCIL": 7.3,
  "CITY OF CANADA BAY COUNCIL": 7.2,
  "WILLOUGHBY CITY COUNCIL": 8.1,
  "COUNCIL OF THE CITY OF SYDNEY": 9.0,
  "RANDWICK CITY COUNCIL": 8.0,
};

const assetsDir = path.join(process.cwd(), "src/server/assets");

const readFile = async (filename: string) => {
  const fileContents = await fs.readFile(`${assetsDir}/${filename}`, "utf8");
  return fileContents;
};

export const dataRouter = createTRPCRouter({
  getLGAs: publicProcedure.query(async () => {
    return await readFile("LGAs.json");
  }),
  getScarcityLevels: publicProcedure.query(() => {
    return scarcityLevels;
  }),
});
