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

export const MapPage: React.FC<{currentDataType: string}> = ({currentDataType}) =>  {
	const { data: sessionData } = useSession();
    const userId = sessionData?.user?.id ? sessionData.user.id : "";
    const { data: latestLogs, refetch: refetchLogs } = api.user_client.fetchLatestLogs.useQuery(
        { userId: userId },
        { enabled: sessionData?.user !== undefined },
    );
	const changePos = api.user_client.changeDevicePosition.useMutation();
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

	return (
		<div>
			{/* {image && <Map image={image} devices={devices ? devices.map(device => ({id: device.id, name: device.name, x: 1, y: 1, airQuality: "good"})) : []} />} */}
			<Map
				image={{path: "/blueprint.png", id: 1, filename: "blueprint.png", width: 550, height: 500}}
				devices={parsedDevices}
				setDevicePosition={(id, x, y) => {
					// Todo: Update device position in database
					console.log(id, "x", x, "y", y);
					// changePos.mutate({id: id, x: x, y: y});
					void changePos.mutateAsync({id: id, x: x, y: y}).then(() => {
						void refetchLogs();
						console.log("Position changed");
					});
				}}
			/>
		</div>
	);
}