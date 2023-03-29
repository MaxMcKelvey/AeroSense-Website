import { useEffect, useState } from "react";
// import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { RadioGroup } from "./RadioGroup";
import { DataTypeSymbols, DataTypeUnits, DataTypes, DataTypesShort, getNameFromThreshold, defaultThresholds } from "~/utils/DataTypes";
import { MapPage } from "./map/MapPage";
import { thresholdType } from "~/utils/DataTypes";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useRouteGuard } from "~/utils/redirectUtils";

const data = [
    {
        "name": "Page A",
        "uv": 4000,
        "pv": 2400,
        "amt": 2400
    },
    {
        "name": "Page B",
        "uv": 3000,
        "pv": 1398,
        "amt": 2210
    },
    {
        "name": "Page C",
        "uv": 2000,
        "pv": 9800,
        "amt": 2290
    },
    {
        "name": "Page D",
        "uv": 2780,
        "pv": 3908,
        "amt": 2000
    },
    {
        "name": "Page E",
        "uv": 1890,
        "pv": 4800,
        "amt": 2181
    },
    {
        "name": "Page F",
        "uv": 2390,
        "pv": 3800,
        "amt": 2500
    },
    {
        "name": "Page G",
        "uv": 3490,
        "pv": 4300,
        "amt": 2100
    }
]

export const OverviewView: React.FC = () => {
    const [selected, setSelected] = useState("Overview");
    const [authorized] = useRouteGuard("/purchase");

    return (
        <div className="w-full h-full">
            {/* <h2 className="text-2xl p-5 underline underline-offset-4">Your Month at a Glance</h2> */}

            <RadioGroup name="test" values={["Overview", ...DataTypesShort]} selected={selected} onChange={setSelected} />

            <MapPage currentDataType={DataTypeSymbols[DataTypesShort.indexOf(selected)] as string} />

            {/* <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 ">
                <span className="text-5xl font-extrabold tracking-tight text-secondary1 sm:text-[5rem]">Big Updates</span>
                <span className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem]"> Coming Soon!</span>
            </div> */}
        </div>
    );
}