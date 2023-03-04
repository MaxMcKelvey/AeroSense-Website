import { DeviceType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

import { WebUSBTest } from "./WebUSBTest";

export const NewDevicePopup: React.FC<{ hidden: boolean, setHidden: Function }> = (
    { hidden, setHidden }
) => {
    const [deviceId, setDeviceId] = useState("");
    const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.MOUNTEDv1);
    const { data: sessionData } = useSession();
    const userId = sessionData?.user?.id ? sessionData.user.id : "";
    const createDevice = api.user_client.registerDevice.useMutation();

    const handleSubmit = (event: any) => {
        event.preventDefault();
        createDevice.mutate(
            { mac_addr: deviceId, userId: userId, type: deviceType},
        );
        setHidden();
    }

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return function cleanup() {
            document.removeEventListener("keydown", escFunction, false);
        };
    })

    const escFunction = (event: any) => {
        if (event.key === "Escape") {
            setHidden();
        }
    }

    return (
        <div className={`${hidden ? "invisible" : "visible"} fixed w-full h-full flex place-content-center flex-wrap backdrop-blur-sm`}>
            <div className="bg-secondary1 w-60 h-60 rounded-xl p-5">
                {/* <form onSubmit={handleSubmit} onAbort={() => setHidden()} onKeyDown={(e) => escFunction(e)}> */}
                    {/* <label>Rename your device:
                        <div className="p-1"></div>
                        <input
                            className="rounded-md"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <div className="p-1"></div>
                    <input type="submit" /> */}
                    Add a new device here in the future!
                    <WebUSBTest />
                {/* </form> */}
            </div>
        </div>
    );
}