import { DeviceType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

const filters: SerialPortFilter[] = [
    { 'usbVendorId': 0x239A }, // Adafruit Boards!
    { 'usbVendorId': 0x303a }, // SeeedStudio XIAO C3!
    { 'usbVendorId': 0x2E8A }, // RP2040 Boards!
];

export const NewDevicePopup: React.FC<{ hidden: boolean, setHidden: () => void, isDemo: boolean }> = (
    { hidden, setHidden, isDemo }
) => {
    // const [deviceId, setDeviceId] = useState("");
    // const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.MOUNTEDv1);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { data: sessionData } = useSession();
    const userId = sessionData?.user?.id ? sessionData.user.id : "";
    const createDevice = api[isDemo ? "demo_client" : "user_client"].registerDevice.useMutation();

    const handleSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        void open(port as SerialPort);
    }

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return function cleanup() {
            document.removeEventListener("keydown", escFunction, false);
        };
    })

    const escFunction = (event: { key: string }) => {
        if (event.key === "Escape") {
            setHidden();
        }
    }

    const [port, setPort] = useState<SerialPort | null>(null);

    const Serial = navigator.serial;

    const connect = async () => {
        const port = await Serial.requestPort({ filters });
        setPort(port);
    }

    useEffect(() => {
        void connect();
    }, [])

    const open = async (port: SerialPort) => {
        await port.open({ baudRate: 9600 });

        setPort(port);
        void initRead(port);
        void write(port);

        // setTimeout(() => { initRead(port) }, 300);
        // setTimeout(() => { write(port) }, 500);
    }

    const write = async (port: SerialPort) => {
        if (!port.writable) {
            console.log("not writable");
            return;
        }
        if (port.writable.locked) {
            console.log("write locked");
            return;
        }

        const textEncoder = new TextEncoderStream();
        const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        const writer = textEncoder.writable.getWriter();
        await writer.write(JSON.stringify({ wifi_username: username, wifi_password: password, userId: userId, unix_time: Date.now(), datetime: (new Date(Date.now())).toISOString() }));
        await writer.close();
        writer.releaseLock();
    }

    const initRead = async (port: SerialPort) => {
        if (!port.readable) {
            console.log("not readable");
            return;
        }
        if (port.readable.locked) {
            console.log("read locked");
            return;
        }

        // console.log("reading!");

        // Listen to data coming from the serial device.
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        let input = "";
        while (true) {
            const { value, done } = await reader.read();
            if (!value) continue;
            input += value;
            if (input.charAt(input.length - 1) != '}') continue;
            // console.log(input);
            input = input.substring(input.lastIndexOf("{"));
            // console.log(input);
            const json = JSON.parse(input) as { mac_addr: string, type: string, userId: string };
            // console.log({ mac_addr: json.mac_addr, userId: userId, type: json.type });
            console.log(json);
            createDevice.mutate({ mac_addr: json.mac_addr, userId: userId, type: json.type as DeviceType });
            setHidden();
            
            void reader.cancel();
            await readableStreamClosed.catch(() => {/* ignore the error */});

            await port.close();

            break;
        }
    }

    return (
        <div className={`${hidden ? "invisible" : "visible"} fixed w-full h-full flex place-content-center flex-wrap backdrop-blur-sm`}>
            {/* <div className="bg-secondary1 w-60 h-60 rounded-xl p-5"> */}
            <div className="w-60 h-60 rounded-xl p-5 drop-shadow-xl bg-white">
            <h2 className="text-lg pb-3">Add a New Device</h2>
                <form onSubmit={handleSubmit} onAbort={() => setHidden()} onKeyDown={(e) => escFunction(e)}>
                    <label>WIFI Username:
                        <div className="p-1"></div>
                        <input
                            className="rounded-md border-2 border-gray-200 px-1"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label>WIFI Password:
                        <div className="p-1"></div>
                        <input
                            className="rounded-md border-2 border-gray-200 px-1"
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <div className="p-1"></div>
                    {/* <input type="submit"/> */}
                    <button className="bg-neutral2 hover:drop-shadow-md absolute bottom-2 right-2 p-2 px-4 rounded-lg" type="submit">Add Device</button>
                </form>
            </div>
        </div>
    );
}