import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export const DashboardNavbar: React.FC = () => {
    const { data: sessionData } = useSession();
    const username = sessionData?.user?.name ? sessionData.user.name : "User";

    return (
        <div className="w-full h-[50px] bg-neutral1 flex flex-row justify-start">
            <div className="absolute w-full z-0 place-self-center text-center"><div className="p-1">{`Hello, ${username}`}</div></div>
            <div className="p-3"></div>
            {/* <div className="m-2 w-10 bg-primary rounded-md"></div>
            <div className="p-1"></div>
            <div className="place-self-center">AeroSense</div> */}
            <Link
                className="z-10 flex flex-row justify-start place-items-center"
                href="/"
            >
                {/* <div className="m-2 w-10 bg-primary rounded-md"></div> */}
                <div className="w-10">
                    <Image src="/favicon.ico" alt="aerosense logo" width={50} height={50} />
                </div>
                <div className="p-1"></div>
                <div className="place-self-center">AeroSense</div>
            </Link>
            <div className="w-auto p-1 flex-grow"></div>
            {/* <div className="place-self-center">Sign Out</div> */}
            <button
                className="z-10"
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData ? "Sign out" : "Sign in - Register"}
            </button>
            <div className="p-3"></div>
        </div>
    );
}