import { useSession } from "next-auth/react";
import { DeviceCard } from "./DeviceCard";

import { api } from "~/utils/api";
import { EditDevicePopup } from "./EditDevicePopup";
import { useState } from "react";
import React from "react";
import { NewDevicePopup } from "./NewDevicePopup";
import { useRouteGuard } from "~/utils/redirectUtils";

export const DeviceView: React.FC = () => {
    const [authorized] = useRouteGuard("/purchase");
    const [popupVisible, setPopupVisible] = useState(false);
    const [newDevicePopupVisible, setNewDevicePopupVisible] = useState(false);
    const [editDeviceId, setEditDeviceId] = useState("");
    const [editDeviceName, setEditDeviceName] = useState("");

    const { data: sessionData } = useSession();
    const userId = sessionData?.user?.id ? sessionData.user.id : "";
    const { data: devices, refetch: refetchQuery } = api.user_client.getAllDevices.useQuery(
        { userId: userId },
        { enabled: sessionData?.user !== undefined },
    );

    const editDeviceLambda = (id: string, name: string) => {
        setEditDeviceId(id);
        setEditDeviceName(name);
        setPopupVisible(true);
    }

    const newDevice = () => {
        if (!("serial" in navigator)) {
            // The Web Serial API is supported.
            alert("Your browser isn't supported. Please use chrome version 89 or higher.");
            return;
        }
        setNewDevicePopupVisible(true);
    }

    const refetchTimer = () => {
        setTimeout(() => {void refetchQuery()}, 100);
        setTimeout(() => {void refetchQuery()}, 500);
        setTimeout(() => {void refetchQuery()}, 1000);
        setTimeout(() => {void refetchQuery()}, 10000);
    }

    return (
        <>
            <div className="w-full h-full p-10 grid grid-cols-[repeat(auto-fill,160px)] grid-rows-[repeat(auto-fill,192px)] justify-start gap-10 overflow-scroll">
                {devices ? devices.map(device => <DeviceCard key={device.id} name={device.name} type={device.deviceType} edit={() => editDeviceLambda(device.id, device.name)} />) : ""}
            </div>
            <button className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-secondary1 text-5xl text-white p-2" onClick={() => newDevice()}>
                <svg className="svg-icon fill-white" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M836 476H548V188c0-19.8-16.2-36-36-36s-36 16.2-36 36v288H188c-19.8 0-36 16.2-36 36s16.2 36 36 36h288v288c0 19.8 16.2 36 36 36s36-16.2 36-36V548h288c19.8 0 36-16.2 36-36s-16.2-36-36-36z"  /></svg>
            </button>
            {popupVisible && <EditDevicePopup hidden={!popupVisible} setHidden={() => {setPopupVisible(false); refetchTimer();}} deviceId={editDeviceId} deviceName={editDeviceName} />}
            {newDevicePopupVisible && <NewDevicePopup hidden={!newDevicePopupVisible} setHidden={() => {setNewDevicePopupVisible(false); refetchTimer();}} />}
        </>
    );
}