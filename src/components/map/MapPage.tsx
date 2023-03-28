// pages/map.js

import { PrismaClient } from "@prisma/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
// import blueprint from "../public/blueprint.png";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

const Map = dynamic(() => import("./Map"), {
	ssr: false,
});

export default function MapPage() {
	const { data: sessionData } = useSession();
    const userId = sessionData?.user?.id ? sessionData.user.id : "";
    const { data: devices } = api.user_client.getAllDevices.useQuery(
        { userId: userId },
        { enabled: sessionData?.user !== undefined },
    );
	const [parsedDevices, setParsedDevices] = useState<{
		id: string;
		name: string;
		x?: number | undefined;
		y?: number | undefined;
		airQuality: string;
	}[]>([]);
	const [image, setImage] = useState<{
		id: number,
		filename: string,
		path: string,
		width: number,
		height: number
	} | null>(null);

	useEffect(() => {
		// const fetchImage = async () => {
		// 	const response = await fetch("/api/image");
		// 	if (response.ok) {
		// 		const imageData = await response.json();
		// 		setImage(imageData);
		// 	}
		// };
		// fetchImage();

		// setImage({
		// 	id: 1,
		// 	filename: "blueprint.png",
		// 	path: blueprint.src,
		// 	width: blueprint.width,
		// 	height: blueprint.height
		// });
	}, []);

	useEffect(() => {
		if (!devices) return;
		
		setParsedDevices(devices.map(device => ({id: device.id, name: device.name, x: 200, y: 100, airQuality: "good"})));
	}, [devices]);

	return (
		<div>
			{/* {image && <Map image={image} devices={devices ? devices.map(device => ({id: device.id, name: device.name, x: 1, y: 1, airQuality: "good"})) : []} />} */}
			<Map image={{path: "/blueprint.png", id: 1, filename: "blueprint.png", width: 550, height: 500}} devices={parsedDevices} />
		</div>
	);
}