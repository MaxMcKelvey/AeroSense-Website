import { useState } from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import DropdownMenu from "./Dropdown";
import DateArea from "./chart/DateArea"

const data = [
    {
        "date": "2019-01-11 12:00:00",
        "air_quality": 76,
        "co2": 419,
    },
    {
        "date": "2019-05-30 12:00:00",
        "air_quality": 60,
        "co2": 400,
    },
    {
        "date": "2019-06-30 12:00:00",
        "air_quality": 80,
        "co2": 450,
    },
    {
        "date": "2019-07-21 12:00:00",
        "air_quality": 79,
        "co2": 410,
    },
    {
        "date": "2019-07-28 12:00:00",
        "air_quality": 79,
        "co2": 430,
    },
]

const handleMenuItem1Click = () => {
    console.log("Menu item 1 clicked");
};

const handleMenuItem2Click = () => {
    console.log("Menu item 2 clicked");
};

const handleMenuItem3Click = () => {
    console.log("Menu item 3 clicked");
};

const menuItems = [
    { label: "Menu Item 1", onClick: handleMenuItem1Click },
    { label: "Menu Item 2", onClick: handleMenuItem2Click },
    { label: "Menu Item 3", onClick: handleMenuItem3Click },
];

/*air_quality: z.optional(z.number()),
    co2: z.optional(z.number()),
    co: z.optional(z.number()),
    temperature: z.optional(z.number()),
    humidity: z.optional(z.number()),
    vtol: z.optional(z.number()),*/

const DataTypes = ['Air Quality Index', 'CO2 Concentration', 'CO Concentration', 'Temperature', 'Humidity', 'Volatile Organic Compound Concentration'];
const DataTypeSymbols = ['air_quality', 'co2', 'co', 'temperature', 'humidity', 'voc'];
const DataTypeUnits = ['AQI', 'ppm', 'ppm', '°C', 'g/m^3', 'ppm'];

export const DataView: React.FC = () => {
    const [dataName, setDataName] = useState('Air Quality');
    const dataTypes = DataTypes.map(type => ({ label: type, onClick: () => setDataName(type) }))

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

    // const parsedStartDate = new Date(2019, 0, 11);
    // const parsedEndDate = new Date(2019, 9, 15);
    // const data2 = [
    //     { date: startDate.getTime(), val: 2000 },
    //     { date: new Date(2019, 4, 30).getTime(), val: 5000 },
    //     { date: new Date(2019, 5, 30).getTime(), val: 5000 },
    //     { date: new Date(2019, 6, 21).getTime(), val: 6000 },
    //     { date: new Date(2019, 6, 28).getTime(), val: 9000 }
    // ];

    const parsedData2 = data.map(datum => ({ date: datum.date, val: (getDataType(dataName) in datum ? datum[getDataType(dataName) as keyof typeof datum] : 0) as number }));

    // console.log(parsedData2);

    const parsedData = [
        { date: "2019-01-11", val: 2000 },
        { date: "2019-05-30", val: 5000 },
        { date: "2019-06-30", val: 5000 },
        { date: "2019-07-21", val: 6000 },
        { date: "2019-07-28", val: 9000 },
    ]

    return (
        <div className="w-full h-full p-10" >
            <div className="flex flex-row justify-start gap-10">
                <DropdownMenu menuItems={dataTypes} dropdownName="Data Type" />
                <DropdownMenu menuItems={menuItems} dropdownName="Dropdown Menu" />
                <DropdownMenu menuItems={menuItems} dropdownName="Dropdown Menu" />
            </div>
            <div className="p-5"></div>
            <div className="h2 text-2xl">{`Graph of ${dataName} in ${getDataUnits(dataName)} over Time`}</div>
            <div className="p-5"></div>
            {/* <LineChart width={1000} height={500} data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }} key={getDataType(dataName)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" type="number" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={getDataType(dataName)} stroke="#8884d8" />
            </LineChart> */}

            {/* <DateArea data={parsedData2} startDate={parsedData2[0] ? parsedData2[0]?.date : "2022-01-11 12:00:00"} endDate={"2019-10-15 12:00:00"} /> */}
            <DateArea data={parsedData2} startDate={"2019-01-11 12:00:00"} endDate={"2019-10-15 12:00:00"} />
        </div>
    );
}