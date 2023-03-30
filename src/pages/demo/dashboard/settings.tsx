import { type NextPage } from "next";
import Head from "next/head";

import { DashboardLayout } from "~/components/DashboardLayout";

const Settings: NextPage = () => {
	return (
		<>
			<Head>
				<title>Settings - AeroSense</title>
				<meta name="description" content="Your AeroSense Settings" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="">
				<DashboardLayout isDemo={true}>
                <div className="flex flex-col items-center justify-center gap-6 px-4 py-16">
                    {/* <span className="text-5xl font-extrabold tracking-tight text-secondary1 sm:text-[5rem]">Big Updates</span> */}
                    <span className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem]"> Coming Soon!</span>
                </div>
                </DashboardLayout>
			</main>
		</>
	);
};

export default Settings;