import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { DataType, DataTypes, DataTypeSymbols, defaultThresholds, getNameFromThreshold } from "~/utils/DataTypes";
import { Prisma } from "@prisma/client";

const Map = dynamic(() => import("./Map"), {
	ssr: false,
});

export const MapPage: React.FC<{ currentDataType: string, isDemo: boolean }> = ({ currentDataType, isDemo }) => {
	// console.log(isDemo);
	const { data: sessionData } = useSession();
	const userId = sessionData?.user?.id ? sessionData.user.id : "";
	const { data: latestLogs, refetch: refetchLogs } = isDemo ? api.demo_client.fetchLatestLogs.useQuery(
		{ userId: userId },
	) : api.user_client.fetchLatestLogs.useQuery(
		{ userId: userId },
		{ enabled: sessionData?.user !== undefined },
	);

	const changePos = api[isDemo ? "demo_client" : "user_client"].changeDevicePosition.useMutation();
	const [parsedDevices, setParsedDevices] = useState<{
		id: string;
		name: string;
		x?: number | undefined;
		y?: number | undefined;
		quality?: string;
	}[]>([]);
	const [image, setImage] = useState<{
		id: number,
		filename: string,
		path: string,
		width: number,
		height: number
	} | null>(null);
	const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);

	const getDataRating = (data: DataType, typeName: string) => {
		// if (typeName === "Overview") {
		if (!typeName) {
			// console.log("Overview");
			// const ratings = DataTypes.map(type => {console.log(data, type); return getSpecificDataRating(data, type)});
			const ratings = DataTypeSymbols.map(type => getSpecificDataRating(data, type));
			const worstRating = ratings.reduce((worst, rating) => {
				if (!worst) return rating;
				if (!rating) return worst;
				const idx = Object.keys(defaultThresholds.co2).indexOf(rating);
				const worstIdx = Object.keys(defaultThresholds.co2).indexOf(worst);
				// console.log(idx, worstIdx);
				return idx > worstIdx ? rating : worst;
			});
			// console.log(ratings);
			// console.log(worstRating);
			return worstRating;
		}

		return getSpecificDataRating(data, typeName);
	}

	const getSpecificDataRating = (data: DataType, typeName: string) => {
		return getNameFromThreshold(data[typeName as keyof DataType] as number, typeName);
	}

	useEffect(() => {
		// console.log(latestLogs);
	}, [latestLogs])

	// useEffect(() => {
	// const fetchImage = async () => {
	// 	const response = await fetch("/api/image");
	// 	if (response.ok) {
	// 		const imageData = await response.json();
	// 		setImage(imageData);
	// 	}
	// };
	// fetchImage();
	// }, []);

	useEffect(() => {
		if (!latestLogs) return;

		void setParsedDevices(
			latestLogs.filter(
				device => !currentDataType || (device.data && Object.keys(device.data as object).includes(currentDataType))
			).map(device => ({
				id: device.deviceId,
				name: device.deviceName,
				x: (device.deviceInfo as Prisma.JsonObject)?.x ? (device.deviceInfo as Prisma.JsonObject).x as number : 10,
				y: (device.deviceInfo as Prisma.JsonObject)?.y ? (device.deviceInfo as Prisma.JsonObject).y as number : 10,
				quality: getDataRating(device.data as DataType, currentDataType),
			}))
		);
	}, [latestLogs, currentDataType]);

	const setDevicePosition = (id: string, x: number, y: number) => {
		// console.log(id, x, y);
		const newDevices = parsedDevices.map(device => {
			if (device.id === id) {
				return { ...device, x: x, y: y };
			}
			return device;
		});
		setParsedDevices(newDevices);

		void changePos.mutateAsync({ id: id, x: x, y: y }).then(() => {
			void refetchLogs();
			// console.log("Position changed");
		});
	};	

	useEffect(() => {
		const handleEsc = (event: {keyCode: number}) => {
			if (event.keyCode === 27) {
				// console.log('Close')
				setSelectedDevice(undefined);
			}
		};
		window.addEventListener('keydown', handleEsc);

		// return () => {
		// 	window.removeEventListener('keydown', handleEsc);
		// };
	}, []);

	return (
		<div className="flex flex-row">
			{/* {image && <Map image={image} devices={devices ? devices.map(device => ({id: device.id, name: device.name, x: 1, y: 1, airQuality: "good"})) : []} />} */}
			<Map
				image={{ path: "/blueprint.jpeg", id: 1, filename: "blueprint.jpeg", width: 1000, height: 500 }}
				devices={parsedDevices}
				setDevicePosition={(id, x, y) => {
					console.log(id, "x", x, "y", y);
					// changePos.mutate({id: id, x: x, y: y});
					void setDevicePosition(id, x, y);
				}}
				deviceClickHandler={(id) => {
					// console.log(id);
					setSelectedDevice(id);
				}}
			/>
			{selectedDevice &&
				<div className="flex flex-col w-60 break-words mt-10 p-5 rounded-2xl bg-neutral2 shadow-xl h-[500px]">
					<div className="text-xl">
						{latestLogs?.find(device => device.deviceId == selectedDevice)?.deviceName}
					</div>
					{/* <div>
						{`Most Recent Log: ${(JSON.stringify(latestLogs?.find(device => device.deviceId == selectedDevice)))}`}
					</div> */}
					<ul>
						{latestLogs?.find(
							device => device.deviceId == selectedDevice
						)?.data && Object.keys(
							latestLogs?.find(
								device => device.deviceId == selectedDevice
							)?.data as object
						).map((key, index) => {
							return (
								<li key={index}>
									{key}: {latestLogs?.find(
										device => device.deviceId == selectedDevice
									)?.data && (latestLogs?.find(
										device => device.deviceId == selectedDevice
									)?.data as DataType)[key as keyof DataType]}
								</li>
							);
						})}
					</ul>
					<div className="p-1 m-auto"></div>
					<div className="">Measured At:</div>
					<div>
						{latestLogs?.find(device => device.deviceId == selectedDevice)?.datetime.toLocaleString()}
					</div>
				</div>
			}
		</div>
	);
}