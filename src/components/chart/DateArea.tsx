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
import DataUtils from "./DataUtils";
import CustomTooltip from "./CustomTooltip";
import { AxisDomain } from "recharts/types/util/types";
import { ContentType } from "recharts/types/component/Tooltip";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const dateFormatter = (date: number) => {
    return format(new Date(date), "dd/MMM");
};

/**
 * get the dates between `startDate` and `endSate` with equal granularity
 */
const getTicks = (startDate: Date, endDate: Date, num: number) => {
    const diffDays = differenceInCalendarDays(endDate, startDate);

    const current = startDate,
        velocity = Math.round(diffDays / (num - 1));

    const ticks = [startDate.getTime()];

    for (let i = 1; i < num - 1; i++) {
        ticks.push(add(current, { days: i * velocity }).getTime());
    }

    ticks.push(endDate.getTime());
    return ticks;
};

/**
 * Add data of the date in ticks,
 * if there is no data in that date in `data`.
 *
 * @param Array<number> _ticks
 * @param {*} data
 */
const fillTicksData = (_ticks: number[], data: { date: number, val: number }[]) => {
    const ticks = [..._ticks];
    const filled = [];
    let currentTick = ticks.shift();
    let lastData = null;
    for (const it of data) {
        if (ticks.length && currentTick && it.date > currentTick && lastData) {
            filled.push({ ...lastData, ...{ date: currentTick } });
            currentTick = ticks.shift();
        } else if (ticks.length && it.date === currentTick) {
            currentTick = ticks.shift();
        }

        filled.push(it);
        lastData = it;
    }

    return filled;
};

const DateArea: React.FC<{ data: { date: string, val: number }[], startDate: string, endDate: string }> = ({ data, startDate, endDate }) => {
    // console.log(new Date("2018-02-21 12:00:00"));
    const parsedStartDate = new Date(startDate.substring(0, 10));
    const parsedEndDate = new Date(endDate.substring(0, 10));

    // console.log(data);

    const parsedData = data.map((datum) => ({ date: new Date(datum.date.substring(0, 10)).getTime(), val: datum.val }))

    // console.log(parsedData);

    const domain = [(dataMin: number) => dataMin, () => parsedEndDate.getTime()];
    const ticks = getTicks(parsedStartDate, parsedEndDate, 5);
    const filledData = fillTicksData(ticks, parsedData);

    return (
        // <div>
            <ResponsiveContainer width="80%" height={200} className="pl-12" >
                <LineChart
                    width={900}
                    height={250}
                    data={filledData}
                    margin={{
                        top: 10,
                        right: 0,
                        bottom: 10,
                        left: 0
                    }}
                >
                    <XAxis
                        dataKey="date"
                        // hasTick
                        scale="time"
                        tickFormatter={dateFormatter}
                        type="number"
                        domain={domain as unknown as AxisDomain}
                        ticks={ticks}
                    />
                    {/* <YAxis tickCount={7} hasTick /> */}
                    <YAxis tickCount={7} />
                    <Tooltip content={CustomTooltip as ContentType<ValueType, NameType>} />
                    <Tooltip />
                    <Line type="monotone" dataKey={"val"} stroke="#8884d8" dot={<></>} />
                </LineChart>
            </ResponsiveContainer>
        // {/* </div> */}
    );
};

export default DateArea;
