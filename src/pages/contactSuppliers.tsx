import Link from "next/link";
import React from "react";
import Button from "~/components/Button";

const contactSuppliers = () => {
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
  );
};

export default contactSuppliers;
