import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
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

const contactSuppliers = ({
  isAuthenticated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Find Suppliers · MediLink</title>
      </Head>
      <div tw="flex flex-col flex-1 h-screen">
        <Navbar isAuthenticated={isAuthenticated} />
        <div tw="m-14">
          <div tw="flex justify-between">
            <h1 tw="text-2xl">Suppliers Near Me 🩺</h1>
            <Button>Filter</Button>
          </div>
          <div>
            <div tw="flex w-full text-black bg-white border border-gray-200 divide-x divide-gray-200 rounded-md shadow-sm justify-between p-6 my-4">
              <p>John Smith</p>
              <div>
                <p>Phone: 0412 345 678</p>
                <p>Email: johnsmith@gmail.com</p>
              </div>
            </div>
            <div tw="flex w-full text-black bg-white border border-gray-200 divide-x divide-gray-200 rounded-md shadow-sm justify-between p-6 my-4">
              <p>Jane Doe</p>
              <div>
                <p>Phone: 0439 321 670</p>
                <p>Email: janedoe@hotmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default contactSuppliers;
