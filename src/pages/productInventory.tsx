import Link from "next/link";
import React from "react";
import Button from "~/components/Button";

const productInventory = () => {
  return (
    <div tw="flex flex-col flex-1 h-screen">
      <header tw="z-20 p-4 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md">
        <div tw="mx-auto max-w-7xl">
          <div tw="flex items-center"></div>
          <Link tw="text-xl" href="/">
            Plastech
          </Link>
        </div>
      </header>
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
