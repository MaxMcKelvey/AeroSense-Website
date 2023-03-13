import { useEffect, useState } from "react";
import DropdownMenu from "./Dropdown";
import DateArea from "./chart/DateArea"
import { api } from "~/utils/api";

const DataTypes = ['Air Quality Index', 'CO2 Concentration', 'CO Concentration', 'Temperature', 'Humidity', 'Volatile Organic Compound Concentration'];
const DataTypeSymbols = ['aq', 'co2', 'co', 'temp', 'hum', 'voc'];
const DataTypeUnits = ['AQI', 'ppm', 'ppm', '°C', 'g/m^3', 'ppm'];

export const DataView: React.FC = () => {
    const [dataName, setDataName] = useState<string>(DataTypes[0] as string);
    const [parsedData, setParsedData] = useState<{ date: Date, val: number }[]>([]);
    const [parsedEndDate, setParsedEndDate] = useState<Date>(new Date("2019-10-15 12:00:00"));
    const dataTypes = DataTypes.map(type => ({ label: type, onClick: () => setDataName(type) }))
    const { data: data } = api.user_client.fetchDeviceLogs.useQuery({ deviceId: "00:00:00:00:00:00", datetimeParams: "none" });

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
            data.map(datum => ({
                // date: datum.date, val: (
                // date: datum.datetime.toLocaleString().replace(/\//g, '-').replace(/,|\sPM|\sAM/g, ''), val: (
                date: datum.datetime, val: (
                    getDataType(dataName) in datum ? datum[getDataType(dataName) as keyof typeof datum] : 0
                ) as number
            }))
        );
    }, [dataName, data])

    useEffect(() => {
        const endDate = parsedData[parsedData.length - 1]?.date;
        setParsedEndDate(endDate ? endDate : new Date("2019-10-15 12:00:00"));
    }, [parsedData])

    return (
        <div className="w-full h-full p-10" >
            <div className="flex flex-row justify-start gap-10">
                <DropdownMenu menuItems={dataTypes} dropdownName="Data Type" />
            </div>
            <div className="p-5"></div>
            <div className="h2 text-2xl">{`Graph of ${dataName} in ${getDataUnits(dataName)} over Time`}</div>
            <div className="p-5"></div>

            <DateArea data={parsedData} startDate={parsedData[0] ? parsedData[0]?.date : new Date("2022-01-11 12:00:00")} endDate={new Date("2019-10-15 12:00:00")} />
        </div>
    );
}