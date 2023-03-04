import Link from "next/link";

export const DashboardSidebar: React.FC = () => {

    return (
        <div className="w-[200px] h-full border-r-4 border-neutral1">
            <div className="mx-5 flex flex-col">
                <div className="p-1"></div>
                <ViewLinkComponent name="Overview" href="/dashboard" />
                <ViewLinkComponent name="Data" href="/dashboard/data" />
                <ViewLinkComponent name="Devices" href="/dashboard/devices" />
            </div>
        </div>
    );
}

const ViewLinkComponent: React.FC<{name: string, href: string}> = ({name, href}) => (
    <Link className="p-1 px-5 text-slate-800 hover:text-slate-900 rounded-md hover:bg-neutral2" href={href}>
        {name}
    </Link>
)