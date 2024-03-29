import { useEffect, useState } from "react";
import DropdownMenu from "./Dropdown";
import DateArea from "./chart/MyDateArea"
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import SearchBar from "./SearchBar";
import { DataType, DataTypeSymbols, DataTypeUnits, DataTypes } from "~/utils/DataTypes";
import { useRouteGuard } from "~/utils/redirectUtils";

export const DataView: React.FC<{ isDemo: boolean }> = ({isDemo}) => {
    const { data: sessionData } = useSession();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [authorized] = !isDemo ? useRouteGuard("/purchase") : [null];
    const userId = sessionData?.user?.id ? sessionData.user.id : "";
    // const { data: devices } = api[isDemo ? "demo_client" : "user_client"].getAllDevices.useQuery(
    //     { userId: userId },
    //     { enabled: sessionData?.user !== undefined },
    // );

    const { data: devices } = isDemo ? api.demo_client.getAllDevices.useQuery(
        { userId: userId },
    ) : api.user_client.getAllDevices.useQuery(
        { userId: userId },
        { enabled: sessionData?.user !== undefined },
    );
    
    console.log(sessionData);

    const parsedDevices = [{label: "All Devices", onClick: () => {
        setSelectedDeviceIds(undefined);
        setSelectedDevices("All Devices");
        void refetchData();
    }}];
    if (devices) parsedDevices.push(...devices.map(d => ({label: d.name, onClick: () => {
        setSelectedDeviceIds([d.id]);
        setSelectedDevices(d.name);
        void refetchData();
    }})));

    const [dataName, setDataName] = useState<string>(DataTypes[0] as string);
    const [selectedDevices, setSelectedDevices] = useState<string>("All Devices");
    const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[] | undefined>(undefined);
    const [parsedData, setParsedData] = useState<{ date: Date, val: number }[]>([]);
    const [parsedStartDate, setParsedStartDate] = useState<string>("");
    const [parsedEndDate, setParsedEndDate] = useState<string>("");
    const [datetimeParamString, setDatetimeParamString] = useState<string | undefined>(undefined);
    const dataTypes = DataTypes.map(type => ({ label: type, onClick: () => setDataName(type) }))
    // const { data: data, refetch: refetchData } = api[isDemo ? "user_client" : "user_client"].fetchDeviceLogs.useQuery(
    //     { userId: userId, deviceIds: selectedDeviceIds, datetimeParams: datetimeParamString },
    // );

    const { data: data, refetch: refetchData } = isDemo ? api.demo_client.fetchDeviceLogsMonometric.useQuery(
        {
            userId: userId,
            deviceIds: selectedDeviceIds,
            datetimeParams: datetimeParamString,
            key: DataTypeSymbols[DataTypes.indexOf(dataName)] as string,
        },
    ) : api.user_client.fetchDeviceLogsMonometric.useQuery(
        {
            userId: userId,
            deviceIds: selectedDeviceIds,
            datetimeParams: datetimeParamString,
            key: DataTypeSymbols[DataTypes.indexOf(dataName)] as string,
        },
        { enabled: sessionData?.user !== undefined },
    );
    // ) : api.user_client.fetchDeviceLogs.useQuery(
    //     { userId: userId, deviceIds: selectedDeviceIds, datetimeParams: datetimeParamString },
    //     { enabled: sessionData?.user !== undefined },
    // );

    const getDataType = (name: string) => {
        const idx = DataTypes.indexOf(name);
        const type = DataTypeSymbols[idx];
        return type ? type : "";
    }

    const getDataUnits = (name: string) => {
        const idx = DataTypes.indexOf(name);
        const type = DataTypeUnits[idx];
        return type ? type : "";
    }

    useEffect(() => {
        if (!data) return;

        setParsedData(
            (data as [{ datetime: Date; key: number }]).filter(datum => getDataType(dataName) in datum).map(datum => ({
                // date: datum.date, val: (
                // date: datum.datetime.toLocaleString().replace(/\//g, '-').replace(/,|\sPM|\sAM/g, ''), val: (
                date: datum.datetime, val: (
                    // getDataType(dataName) in datum ? datum[getDataType(dataName) as keyof typeof datum] : 0
                    datum[getDataType(dataName) as keyof typeof datum]
                ) as number
            }))
        );
    }, [dataName, data])

    useEffect(() => {
        setDatetimeParamString(JSON.stringify({gte: parsedStartDate, lt: parsedEndDate}));
        void refetchData();
    }, [parsedStartDate, parsedEndDate])

    useEffect(() => {
        void refetchData();
    }, [selectedDeviceIds])

    return (
        <div className="w-full h-full p-10" >
            <div className="flex flex-row justify-start gap-10">
                <DropdownMenu menuItems={dataTypes} dropdownName={dataName} title="Data Type"/>
                <DropdownMenu menuItems={parsedDevices} dropdownName={selectedDevices} title="Select Device(s)"/>
                <SearchBar title="Start Date" setParam={setParsedStartDate}/>
                <SearchBar title="End Date" setParam={setParsedEndDate}/>
            </div>
            <div className="p-5"></div>
            <div className="h2 text-2xl">{`Graph of ${dataName} in ${getDataUnits(dataName)} over Time`}</div>
            <div className="p-5"></div>

            { parsedData.length > 0 && parsedData[0]?.date && parsedData[parsedData.length - 1]?.date &&
                <DateArea
                    data={parsedData}
                    startDate={parsedData[0].date}
                    endDate={(parsedData[parsedData.length - 1] as {date: Date, val: number}).date}
                    // startDate={parsedStartDate ? parsedStartDate : parsedData[0]?.date}
                    // endDate={parsedEndDate ? parsedEndDate : (parsedData[parsedData.length - 1] as {date: Date, val: number}).date}
                />
            }
        </div>
    );
}