import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { HomeNavbar } from "~/components/HomeNavbar";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>AeroSense</title>
        <meta name="description" content="AeroSense: Your Industrial IoT Proider" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"> */}
      <main className="">
        <HomeNavbar />
        <div className="flex flex-col items-center justify-center gap-6 px-4 py-16">
          {/* <h1 className="text-5xl font-extrabold tracking-tight text-secondary1 sm:text-[5rem]"> */}
            {/* Big <span className="text-[hsl(280,100%,70%)]">Updates</span> Coming Soon! */}
            <span className="text-5xl font-extrabold tracking-tight text-secondary1 sm:text-[5rem]">Big Updates</span>
            <span className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem]"> Coming Soon!</span>
          {/* </h1> */}
          <Link
            className="p-10 rounded font-semibold"
            href="/dashboard"
          >
            I just wanna go to my dashboard →
          </Link>
        </div>

      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
