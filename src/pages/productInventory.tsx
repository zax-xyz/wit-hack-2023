import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import React from "react";
import Button from "~/components/Button";
import Navbar from "~/components/Navbar";
import { getIsAuthenticated } from "~/utils/getUser";

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

const productInventory = ({
  isAuthenticated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div tw="flex flex-col flex-1 h-screen">
      <Navbar isAuthenticated={isAuthenticated} />
      <div tw="m-14">
        <div tw="flex justify-between">
          <h1 tw="text-2xl">My Product Inventory</h1>
          <Button>Filter</Button>
        </div>
        <div>
          <div tw="flex w-full text-black bg-white border border-gray-200 divide-x divide-gray-200 rounded-md shadow-sm justify-between p-6 my-4">
            <p>NUPENTIN 100 gabapentin 100 mg capsule blister pack</p>
            <p>Expiry date: 10/08/2025</p>
          </div>
          <div tw="flex w-full text-black bg-white border border-gray-200 divide-x divide-gray-200 rounded-md shadow-sm justify-between p-6 my-4">
            <p>APO-MIRTAZAPINE mirtazapine 30 mg tablet blister pack</p>
            <p>Expiry date: 26/11/2024</p>
          </div>
          <div tw="flex w-full text-black bg-white border border-gray-200 divide-x divide-gray-200 rounded-md shadow-sm justify-between p-6 my-4">
            <p>
              ALISINOPRIL SANDOZ lisinopril dihydrate 5mg tablet blister pack
            </p>
            <p>Expiry date: 9/09/2023</p>
          </div>
          <div tw="flex w-full text-black bg-white border border-gray-200 divide-x divide-gray-200 rounded-md shadow-sm justify-between p-6 my-4">
            <p>
              CLOBEX clobetasol propionate 500 microgram/mL Shampoo Application
              Bottle
            </p>
            <p>Expiry date: 12/06/2030</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default productInventory;
