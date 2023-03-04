import { useSession } from "next-auth/react";
// import { useEffect } from "react";

export const DashboardNavbar: React.FC = () => {
    const { data: sessionData } = useSession();
    const username = sessionData?.user?.name ? sessionData.user.name : "User";

    // useEffect(() => {
    //     setInterval(() => {
    //         username = sessionData?.user?.name ? sessionData.user.name : "User";
    //     }, 1000);
    // }, []);

    return (
        <div className="w-full h-[50px] bg-neutral1 flex flex-row justify-start">
            <div className="absolute w-full place-self-center text-center"><div className="p-1">{`Hello, ${username}`}</div></div>
            <div className="p-3"></div>
            <div className="m-2 w-10 bg-primary rounded-md"></div>
            <div className="p-1"></div>
            <div className="place-self-center">AeroSense</div>
            <div className="w-auto p-5 flex-grow"></div>
            <div className="place-self-center">Sign Out</div>
            <div className="p-3"></div>
        </div>
    );
}