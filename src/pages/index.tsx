import Head from "next/head";

export default function Home() {
  return (
    <>
      <main tw="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div tw="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 tw="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            This page should be redirecting...
          </h1>
        </div>
      </main>
    </>
  );
}
