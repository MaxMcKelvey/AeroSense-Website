import { type NextPage } from "next";
import Head from "next/head";

import { DashboardLayout } from "~/components/DashboardLayout";
import { DataView } from "~/components/DataView";

const Data: NextPage = () => {
	return (
		<>
			<Head>
				<title>Data</title>
				<meta name="description" content="Your AeroSense Data" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="">
				<DashboardLayout><DataView /></DashboardLayout>
			</main>
		</>
	);
};

export default Data;