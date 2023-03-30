import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import L, { LatLng, LatLngBoundsLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { LeafletEvent, Marker as MarkerType } from "leaflet";
import { useMemo, useRef } from "react";

// Set up marker colors based on air quality thresholds
const markerColors = {
    good: "green",
    moderate: "yellow",
    unhealthy: "orange",
    veryUnhealthy: "red",
    hazardous: "purple",
};

const markers = {
    good: L.divIcon({
        html: `<div class="bg-green-500 rounded-full w-5 h-5 animate-ping"></div>`,
        className: `bg-green-500 rounded-full`, // border-2 border-white
        iconSize: [20, 20],
    }),
    moderate: L.divIcon({
        html: `<div class="bg-yellow-500 rounded-full w-5 h-5 animate-ping"></div>`,
        className: `bg-yellow-500 rounded-full`, // border-2 border-white
        iconSize: [20, 20],
    }),
    unhealthy: L.divIcon({
        html: `<div class="bg-orange-500 rounded-full w-5 h-5 animate-ping"></div>`,
        className: `bg-orange-500 rounded-full`, // border-2 border-white
        iconSize: [20, 20],
    }),
    veryUnhealthy: L.divIcon({
        html: `<div class="bg-red-500 rounded-full w-5 h-5 animate-ping"></div>`,
        className: `bg-red-500 rounded-full`, // border-2 border-white
        iconSize: [20, 20],
    }),
    hazardous: L.divIcon({
        html: `<div class="bg-purple-500 rounded-full w-5 h-5 animate-ping"></div>`,
        className: `bg-purple-500 rounded-full`, // border-2 border-white
        iconSize: [20, 20],
    }),
};

// const makeMarker = (color: string) => {
//     return L.divIcon({
//         html: `<div class="bg-${color}-500 rounded-full w-5 h-5 animate-ping"></div>`,
//         className: `bg-${color}-500 rounded-full`, // border-2 border-white
//         iconSize: [20, 20],
//     });
// };

// const markers = {
//     good: makeMarker("green"),
//     moderate: makeMarker("yellow"),
//     unhealthy: makeMarker("orange"),
//     veryUnhealthy: makeMarker("red"),
//     hazardous: makeMarker("purple"),
// };

const Map: React.FC<{
    image: {
        id: number,
        filename: string,
        path: string,
        width: number,
        height: number
    }, devices: {
        id: string,
        name: string,
        x?: number,
        y?: number,
        quality?: string,
    }[],
    setDevicePosition: (deviceId: string, x: number, y: number) => void,
    deviceClickHandler: (deviceId: string) => void,
}> = ({ image, devices, setDevicePosition, deviceClickHandler }) => {
    const bounds: LatLngBoundsLiteral = [[0, 0], [image.height, image.width]];
    const markerRefs = useRef<Array<MarkerType<unknown> | null>>([]);

    const getFixedPos = (marker: MarkerType<unknown>) => {
        const markerPos = marker.getLatLng()
        const fixedPos = new LatLng(markerPos.lat, markerPos.lng);
        if (markerPos.lat < 0) {
            fixedPos.lat = 0;
        }
        if (markerPos.lat > image.height) {
            fixedPos.lat = image.height;
        }
        if (markerPos.lng < 0) {
            fixedPos.lng = 0;
        }
        if (markerPos.lng > image.width) {
            fixedPos.lng = image.width;
        }
        return fixedPos;
    };

    const eventHandlers = useMemo(
		() => ({
			drag(event: LeafletEvent) {
                const markerIndex = markerRefs.current.indexOf(event.target as MarkerType<unknown>);
                const marker = markerRefs.current[markerIndex];
				if (marker != null) {
                    marker.setLatLng(getFixedPos(marker));
				}
			},
			dragend(event: LeafletEvent) {
				const markerIndex = markerRefs.current.indexOf(event.target as MarkerType<unknown>);
                const marker = markerRefs.current[markerIndex];
				if (marker != null) {
                    const fixedMarkerPos = getFixedPos(marker);
					// console.log(markerPos, markerIndex, devices[markerIndex]?.id);
                    if (devices[markerIndex]?.id) {
                        setDevicePosition(devices[markerIndex]?.id as string, fixedMarkerPos.lng, fixedMarkerPos.lat);
                        marker.setLatLng(fixedMarkerPos);
                    }
				}
			},
            click(event: LeafletEvent) {
                const markerIndex = markerRefs.current.indexOf(event.target as MarkerType<unknown>);
                // const marker = markerRefs.current[markerIndex];
                // console.log("click", devices[markerIndex]?.id as string);
                if (devices[markerIndex]?.id as string) {
                    deviceClickHandler(devices[markerIndex]?.id as string);
                }
            }
		}),
		[devices],
	);

    return (
        <MapContainer
            center={[image.height / 2, image.width / 2]}
            className={`m-10`}
            style={{ height: (500), width: (500) }}
            zoom={0}
            maxBounds={bounds}
            minZoom={-1}
            maxZoom={5}
            zoomControl={false}
            crs={L.CRS.Simple}
        >
            <ImageOverlay url={image.path} bounds={bounds} />
            {devices.map((device, index) => {
                // const color = markerColors[device.airQuality as keyof typeof markerColors];

                return (device.y && device.x &&
                    <Marker
                        key={device.id}
                        position={[device.y, device.x]}
                        draggable
                        eventHandlers={eventHandlers}
                        icon={markers[device.quality as keyof typeof markers]}
                        ref={(ref) => markerRefs.current[index] = ref}
                    >
                        {/* <Popup
                            closeOnEscapeKey
                            autoClose={true}
                        >{device.name}</Popup> */}
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;
