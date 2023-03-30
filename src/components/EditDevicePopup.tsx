import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export const EditDevicePopup: React.FC<{ hidden: boolean, setHidden: () => void, deviceId: string, deviceName: string, isDemo: boolean }> = (
    { hidden, setHidden, deviceId, deviceName, isDemo }
) => {
    const [name, setName] = useState(deviceName);
    const nameDevice = api[isDemo ? "demo_client" : "user_client"].nameDevice.useMutation();
    const deleteDevice = api[isDemo ? "demo_client" : "user_client"].deleteDevice.useMutation();

    const handleSubmit = (event: {preventDefault: () => void}) => {
        event.preventDefault();
        nameDevice.mutate(
            { id: deviceId, name: name },
        );
        setHidden();
    }
    
    const handleDelete = () => {
        deleteDevice.mutate(
            { id: deviceId },
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
            {/* <div className="bg-secondary1 w-60 h-60 rounded-xl p-5 relative"> */}
            <div className="bg-white drop-shadow-xl w-60 h-60 rounded-xl p-5 relative">
                <form onSubmit={handleSubmit} onAbort={() => setHidden()} onKeyDown={(e) => escFunction(e)}>
                    <label>Rename your device:
                        <div className="p-1"></div>
                        <input
                            className="rounded-md border-2 border-gray-200 px-1"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <div className="p-1"></div>
                    {/* <input type="submit" className="absolute bottom-2 right-2 bg-neutral2 p-2 rounded-lg" /> */}
                    <button className="bg-neutral2 hover:drop-shadow-md absolute bottom-2 right-2 p-2 rounded-lg px-4" type="submit">Rename</button>
                </form>
                <button className="absolute bottom-2 left-2 px-4 bg-red-600 p-2 rounded-lg text-white hover:drop-shadow-md" onClick={() => handleDelete()}>Delete</button>
            </div>
        </div>
    );
}