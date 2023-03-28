import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import L, { LatLng, LatLngBoundsLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { LeafletEvent, DragEndEvent, MarkerOptions, Marker as MarkerType } from "leaflet";
import { MutableRefObject, Ref, useMemo, useRef } from "react";

// Set up marker colors based on air quality thresholds
const markerColors = {
    good: "green",
    moderate: "yellow",
    unhealthy: "orange",
    veryUnhealthy: "red",
    hazardous: "purple",
};

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
        airQuality: string,
    }[]
}> = ({ image, devices }) => {
    const bounds: LatLngBoundsLiteral = [[0, 0], [image.height, image.width]];
    const markerRefs = useRef<Array<MarkerType<unknown> | null>>([]);

    const eventHandlers = useMemo(
		() => ({
			drag(event: LeafletEvent) {
                const markerIndex = markerRefs.current.indexOf(event.target);
                const marker = markerRefs.current[markerIndex];
				if (marker != null) {
					const markerPos = marker.getLatLng()
					if (markerPos.lat < 0) {
						marker.setLatLng(new LatLng(0, markerPos.lng));
					}
					if (markerPos.lat > image.height) {
						marker.setLatLng(new LatLng(image.height, markerPos.lng));
					}
					if (markerPos.lng < 0) {
						marker.setLatLng(new LatLng(markerPos.lat, 0));
					}
					if (markerPos.lng > image.width) {
						marker.setLatLng(new LatLng(markerPos.lat, image.width));
					}
				}
			},
			dragend(event: LeafletEvent) {
				const markerIndex = markerRefs.current.indexOf(event.target);
                const marker = markerRefs.current[markerIndex];
				if (marker != null) {
					const markerPos = marker.getLatLng()
					if (markerPos.lat < 0) {
						marker.setLatLng(new LatLng(0, markerPos.lng));
					}
					if (markerPos.lat > image.height) {
						marker.setLatLng(new LatLng(image.height, markerPos.lng));
					}
					if (markerPos.lng < 0) {
						marker.setLatLng(new LatLng(markerPos.lat, 0));
					}
					if (markerPos.lng > image.width) {
						marker.setLatLng(new LatLng(markerPos.lat, image.width));
					}
                    // marker.setIcon(L.divIcon({
                    //     className: `bg-${markerColors[devices[markerIndex]?.airQuality as keyof typeof markerColors]}-500 rounded-full border-2 border-white`,
                    //     iconSize: [16, 16],
                    // }));
					console.log(markerPos, markerIndex, devices[markerIndex]?.id);
				}
			},
		}),
		[],
	);

    return (
        <MapContainer
            center={[image.height / 2, image.width / 2]}
            className={`m-10`}
            style={{ height: (image.height), width: (image.width) }}
            zoom={0}
            maxBounds={bounds}
            minZoom={0}
            maxZoom={5}
            zoomControl={false}
            crs={L.CRS.Simple}
        >
            <ImageOverlay url={image.path} bounds={bounds} />
            {devices.map((device, index) => {
                const color = markerColors[device.airQuality as keyof typeof markerColors];

                return (device.y && device.x &&
                    <Marker
                        key={device.id}
                        position={[device.y, device.x]}
                        draggable
                        eventHandlers={eventHandlers}
                        icon={L.divIcon({
                            // className: `bg-${color}-500 rounded-full border-2 border-white`,
                            className: `bg-${color}-500 rounded-full`,
                            iconSize: [16, 16],
                        })}
                        ref={(ref) => markerRefs.current[index] = ref}
                    >
                        <Popup>{device.name}</Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;
