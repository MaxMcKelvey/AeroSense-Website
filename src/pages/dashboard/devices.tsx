import { type NextPage } from "next";
import Head from "next/head";

import { DashboardLayout } from "~/components/DashboardLayout";
import { DeviceView } from "~/components/DeviceView";

const Devices: NextPage = () => {
	return (
		<>
			<Head>
				<title>Devices</title>
				<meta name="description" content="Your AeroSense Devices" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="">
				<DashboardLayout><DeviceView /></DashboardLayout>
			</main>
		</>
	);
};

export default Devices;