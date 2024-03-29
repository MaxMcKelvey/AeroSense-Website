import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { DashboardLayout } from "~/components/DashboardLayout";
import { OverviewView } from "~/components/OverviewView";

const Dashboard: NextPage = () => {
	return (
		<>
			<Head>
				<title>Dashboard</title>
				<meta name="description" content="Your AeroSense Dashboard" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="">
				<DashboardLayout isDemo={false}><OverviewView isDemo={false}/></DashboardLayout>
			</main>
		</>
	);
};

export default Dashboard;

const AuthShowcase: React.FC = () => {
	const { data: sessionData } = useSession();

	const { data: secretMessage } = api.example.getSecretMessage.useQuery(
		undefined, // no input
		{ enabled: sessionData?.user !== undefined },
	);

	if (sessionData?.user) console.log(sessionData)

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
