import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { ArrowDownCircleIcon } from '@heroicons/react/24/outline'

import { api } from "~/utils/api";
import { HomeNavbar } from "~/components/HomeNavbar";

/*
what to do next:
- add why aeroSense section
- add how it works section
- add pricing section
- add testimonials section
- add contact us section
- add footer

aeroSense is a smart environmental monitoring system that enables the operating organization
to optimizes their HVAC systems and save energy and money.

Why AeroSense?
- HVAC systems correspond to 20% of the total energy consumption in the world
- HVAC systems are the largest energy consumers in commercial buildings
- HVAC systems are responsible for up to 40% of the energy consumption in commercial buildings (30% on avg source: https://www.energy.gov/eere/buildings/articles/energy-savings-potential-and-rdd-opportunities-commercial-building-hvac-0)
- HVAC systems typically contribute between 30% to 40% of a commercial building's total carbon emissions.

How it works?
- AeroSense is a smart environmental monitoring system that enables targeted HVAC optimization.

Our Technology
- Next.js
- TailwindCSS
- tRPC
- NextAuth.js
- Vercel
- Planetscale
- Recharts
- Leaflet

Testimonials
- "AeroSense has helped us save 20% on our energy bill"

contact us
- email:
- phone:
- address:
- social media:
*/

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: session, status: status } = useSession();

  return (
    <>
      <Head>
        <title>AeroSense</title>
        <meta name="description" content="AeroSense: Your Industrial IoT Proider" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"> */}
      <main className="h-[100vh] snap-y snap-mandatory relative overflow-scroll">
        <HomeNavbar />
        <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 relative h-[80%]">
          {/* <h1 className="text-5xl font-extrabold tracking-tight text-secondary1 sm:text-[5rem]"> */}
          {/* Big <span className="text-[hsl(280,100%,70%)]">Updates</span> Coming Soon! */}
          <span className="text-5xl font-bold tracking-tight text-secondary1 sm:text-[5rem] snap-center">Introducing</span>
          <span className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem]">AeroSense</span>
          {/* <span className="text-5xl font-bold tracking-tight text-secondary1 sm:text-[5rem]">Your Industrial IoT Provider</span> */}
          {/* subtitle */}
          <span className="rounded font-semibold">Max McKelvey's research project under Sep Makhsous</span>
          <div className="p-5"></div>
          <span className="text-2xl px-5 font-bold tracking-tight text-secondary1 sm:text-[2rem] text-center max-w-[80%]">
            {/* <div className="flex justify-center place-content-center place-items-center w-auto"> */}
              Optimizing HVAC systems with Smart Environmental Monitoring
            {/* </div> */}
          </span>
          <Link className="text-2xl px-5 font-bold tracking-tight text-primary sm:text-[1.5rem] text-center max-w-[80%]" href="https://linkedin.com/company/popular-engineering">
            See us on LinkedIn →
          </Link>
          {/* </h1> */}
          <Link
            className="p-10 rounded font-semibold"
            href={status == "authenticated" ? "/dashboard" : "/purchase"}
          >
            {status == "authenticated" ? "I just wanna go to my dashboard →" : "Purchase Now →"}
          </Link>
          <div className="absolute bottom-0 flex flex-col place-items-center place-content-center">
            <span className="text-lg font-extrabold">Read More</span>
            <div className="p-3"></div>
            <ArrowDownCircleIcon className="h-10 w-10 animate-bounce" />
          </div>
        </div>
        <div className="w-[80%] m-[10%]">
          <div className="p-10"></div>
          <div className="text-2xl font-bold tracking-tight text-secondary1 text-center sm:text-[2rem]">Why AeroSense?</div>
          <div className="p-5"></div>
          <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 relative h-[80%] snap-center text-lg">
            <ul className="list-disc flex flex-col gap-6">
              {/* <li className="tracking-tight sm:text-[2rem]">HVAC systems correspond to 20% of the total energy consumption in the world</li> */}
              <li className="tracking-tight sm:text-[2rem]">AeroSense provides a solution for commercial building to reduce the energy consumption of their HVAC systems</li>
              <li className="tracking-tight sm:text-[2rem]">HVAC systems are the largest energy consumers in commercial buildings</li>
              <li className="tracking-tight sm:text-[2rem]">HVAC systems are responsible for up to 40% of the energy consumption in commercial buildings</li>
              <li className="tracking-tight sm:text-[2rem]">{"HVAC systems typically contribute between 30% to 40% of a commercial building's total carbon emissions."}</li>
            </ul>
          </div>

          <div className="p-10"></div>

          <div className="text-2xl font-bold tracking-tight text-secondary1 text-center sm:text-[2rem]">What is AeroSense?</div>
          <div className="p-5"></div>
          <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 relative h-[80%] snap-center text-lg">
            {/* <span className="tracking-tight sm:text-[2rem]">AeroSense is a smart environmental monitoring system that enables targeted HVAC optimization.</span> */}
            <ul className="list-disc flex flex-col gap-6">
              <li className="tracking-tight sm:text-[2rem]">AeroSense is a smart environmental monitoring system that enables targeted HVAC optimization</li>
              <li className="tracking-tight sm:text-[2rem]">Utilizes LocSense to provide dynamic indoor localization of sensors</li>
              <li className="tracking-tight sm:text-[2rem]">Providing full indoor environmental mapping coverage</li>
              <li className="tracking-tight sm:text-[2rem]">A modular sensor platform for scalable networks</li>
            </ul>
          </div>

          <div className="p-10"></div>

          <div className="text-2xl font-bold tracking-tight text-secondary1 text-center sm:text-[2rem]">Our Technology</div>
          <div className="p-5"></div>
          <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 relative h-[80%] snap-center text-lg">
            <ul>
              <li className="font-bold tracking-tight sm:text-[2rem]">Next.js</li>
              <li className="font-bold tracking-tight sm:text-[2rem]">TailwindCSS</li>
              <li className="font-bold tracking-tight sm:text-[2rem]">tRPC</li>
              <li className="font-bold tracking-tight sm:text-[2rem]">NextAuth.js</li>
              <li className="font-bold tracking-tight sm:text-[2rem]">Planetscale</li>
              <li className="font-bold tracking-tight sm:text-[2rem]">Prisma</li>
              <li className="font-bold tracking-tight sm:text-[2rem]">Vercel</li>
              <li className="font-bold tracking-tight sm:text-[2rem]">Recharts</li>
              <li className="font-bold tracking-tight sm:text-[2rem]">Leaflet</li>
            </ul>
          </div>


          {/* <svg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#8ED6FF" />
                <stop offset="100%" stop-color="#004CB3" />
              </linearGradient>
            </defs>
            <rect x="20" y="20" width="60" height="60" transform="rotate(45, 50, 50)" fill="url(#grad)" stroke="#000" stroke-width="2" />
            <rect x="20" y="20" width="60" height="60" transform="rotate(45, 50, 50) translate(0, -30)" fill="none" stroke="#000" stroke-width="2" />
            <line x1="20" y1="20" x2="20" y2="50" stroke="#000" stroke-width="2" />
            <line x1="80" y1="20" x2="80" y2="50" stroke="#000" stroke-width="2" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="#000" stroke-width="2" />
          </svg> */}

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
