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
type LGAs = {
  LocalGovernmentArea: {
    type: string;
    features: LGA[];
  };
};

const assetsDir = path.join(process.cwd(), "src/server/assets");

const readJSONFile = async (filename: string) => {
  const fileContents = await fs.readFile(`${assetsDir}/${filename}`, "utf8");
  return JSON.parse(fileContents) as unknown;
};

export const dataRouter = createTRPCRouter({
  getLGAs: publicProcedure.query(async () => {
    return (await readJSONFile("LocalGovernmentArea_EPSG4326.json")) as LGAs;
  }),
  getLGAsRed: publicProcedure.query(async () => {
    return (await readJSONFile("LGAs_red.json")) as LGAs;
  }),
});
