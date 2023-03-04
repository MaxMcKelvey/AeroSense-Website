import React from "react";
import { format } from "date-fns";

const style = {
	padding: 6,
	backgroundColor: "#fff",
	border: "1px solid #ccc"
};

type PayloadType = {name: string, payload: {date: number, val: number }, value: number}[];

const CustomTooltip: React.FC<{ active: boolean, payload: PayloadType }> = ({ active, payload }) => {
	if (active && payload[0] && payload[0].payload) {
		const date = payload[0].payload.date;
		const val = payload[0].payload.val;
		return (
			<div className="p-2 bg-white border-[#8884d8] border-2 rounded-md" >
				<p>
					{date ? format(new Date(date), "yyyy-MM-dd") : " -- "}
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

export default CustomTooltip;
