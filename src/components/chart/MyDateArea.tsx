import React from "react";
import { add, format, differenceInCalendarDays, isFuture } from "date-fns";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";
import { ContentType } from "recharts/types/component/Tooltip";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type PayloadType = {name: string, payload: {date: number, val: number }, value: number}[];

const CustomTooltip: React.FC<{ active: boolean, payload: PayloadType }> = ({ active, payload }) => {
	if (active && payload[0] && payload[0].payload) {
		const date = payload[0].payload.date;
		const val = payload[0].payload.val;
		return (
			<div className="p-2 bg-white border-[#8884d8] border-2 rounded-md" >
				<p>
					{/* {date ? format(new Date(date), "yyyy-MM-dd") : " -- "} */}
					{date ? (new Date(date)).toLocaleString() : " -- "}
				</p>
				<p>
					{"value: "}
					{val ? val : " -- "}
				</p>
			</div>
		);
	}

	return null;
};

// const dateFormatter = (date: number) => {
//     return (new Date(date)).toLocaleDateString();
//     // return format(new Date(date), "dd/MMM");
//     // return format(new Date(date), "mm/dd");
// };

const DateArea: React.FC<{ data: { date: Date, val: number }[], startDate: Date, endDate: Date }> = ({ data, startDate, endDate }) => {
    const ticks = data.map((datum) => datum.date)
        .filter((date, i, arr) => !(i > 0 && date.toLocaleDateString() === arr[i - 1]?.toLocaleDateString()))
        .map((date) => date.getTime());

    const dateFormatter = (date: number) => (new Date(date)).toLocaleDateString();
    
    return (
        <ResponsiveContainer width="80%" height={250} className="pl-12" >
            <LineChart
                width={900}
                height={250}
                // data={filledData}
                data={data.map((datum) => ({ date: datum.date.getTime(), val: datum.val }))}
                margin={{
                    top: 10,
                    right: 0,
                    bottom: 10,
                    left: 0
                }}
            >
                <XAxis
                    dataKey="date"
                    scale="time"
                    tickFormatter={dateFormatter}
                    type="number"
                    domain={[() => startDate.getTime(), () => (endDate.getTime() - startDate.getTime()) * 0.05 + endDate.getTime()]}
                    // ticks={ticks}
                />
                <YAxis tickCount={4} />
                <Tooltip content={CustomTooltip as ContentType<ValueType, NameType>} />
                <Line type="monotone" dataKey={"val"} stroke="#8884d8" dot={<></>} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DateArea;
