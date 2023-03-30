import Link from "next/link";
import { Cog6ToothIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'

export const DashboardSidebar: React.FC = () => {

    return (
        <div className="w-[200px] h-full border-r-4 border-neutral1">
            <div className="mx-5 flex flex-col h-full">
                <div className="p-1"></div>
                <ViewLinkComponent name="Overview" href="/dashboard" />
                <ViewLinkComponent name="Data" href="/dashboard/data" />
                <ViewLinkComponent name="Blueprints" href="/dashboard/blueprints" />
                <ViewLinkComponent name="Alerts" href="/dashboard/alerts" />
                <ViewLinkComponent name="Devices" href="/dashboard/devices" />
                {/* <ViewLinkComponent name="Maps" href="/dashboard/maps" /> */}
                <div className="p-1 m-auto"></div>
                {/* <ViewLinkComponent name="Settings" href="/dashboard/settings" /> */}
                <Link className="p-1 px-5 text-slate-800 hover:text-slate-900 rounded-md hover:bg-neutral2 flex content-space-between place-items-center" href={"/dashboard/settings"}>
                    <div>{"Settings"}</div>
                    {/* <div></div> */}
                    <div className="p-1 m-auto"></div>
                    <Cog6ToothIcon className="w-5 h-5" />
                </Link>
                <div className="p-1"></div>
            </div>
        </div>
    );
}

const ViewLinkComponent: React.FC<{ name: string, href: string }> = ({ name, href }) => (
    <Link className="p-1 px-5 text-slate-800 hover:text-slate-900 rounded-md hover:bg-neutral2" href={href}>
        {name}
    </Link>
)