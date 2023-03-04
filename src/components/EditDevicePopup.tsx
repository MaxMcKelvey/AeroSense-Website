import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export const EditDevicePopup: React.FC<{ hidden: boolean, setHidden: () => void, deviceId: string, deviceName: string }> = (
    { hidden, setHidden, deviceId, deviceName }
) => {
    const [name, setName] = useState(deviceName);
    const nameDevice = api.user_client.nameDevice.useMutation();

    const handleSubmit = (event: {preventDefault: () => void}) => {
        event.preventDefault();
        nameDevice.mutate(
            { id: deviceId, name: name },
        );
        setHidden();
    }

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return function cleanup() {
            document.removeEventListener("keydown", escFunction, false);
        };
    })

    const escFunction = (event: {key: string}) => {
        if (event.key === "Escape") {
            setHidden();
        }
    }

    return (
        <div className={`${hidden ? "invisible" : "visible"} fixed w-full h-full flex place-content-center flex-wrap backdrop-blur-sm`}>
            <div className="bg-secondary1 w-60 h-60 rounded-xl p-5">
                <form onSubmit={handleSubmit} onAbort={() => setHidden()} onKeyDown={(e) => escFunction(e)}>
                    <label>Rename your device:
                        <div className="p-1"></div>
                        <input
                            className="rounded-md"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <div className="p-1"></div>
                    <input type="submit" />
                </form>
            </div>
        </div>
    );
}