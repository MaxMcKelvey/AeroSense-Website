import { useEffect, useState } from "react";
import { Port, Serial } from "~/utils/Serial";

const payload = {
    wifi_username: "ABC",
    wifi_password: "123",
}

export const WebUSBTest: React.FunctionComponent<any> = () => {
    const [r, setR] = useState(0);
    const [g, setG] = useState(0);
    const [b, setB] = useState(0);
    const [port, setPort] = useState<Port | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const connect = async (pIn: Port | null) => {
        let p = pIn;
        if (!p) {
            p = await Serial.requestPort();
            setPort(p);
        }
        // if we still don't have port defined
        if (!p) {
            return;
        }
        try {
            await p.connect();
        } catch (e) {
            console.log(e);
            setErrorMessage(JSON.stringify(e));
        }
    }

    const disconnect = async () => {
        if (!port) {
            return;
        }

        try {
            await port.disconnect();
        } catch (e) {
            console.log(e);
        }
        setPort(null);
    }

    const send = async () => {
        if (!port) {
            return;
        }

        const view = new Uint8Array([r, g, b]).buffer;
        try {
            await port.send(view);
            const read = await port.readLoop();
            console.log(read);
        } catch (e) {
            console.log(e);
            setPort(null);
        }
    }

    useEffect(() => {
        const checkIfAlreadyConnected = async () => {
            const devices = await Serial.getPorts();
            if (devices.length > 0) {
                setPort(devices[0] as Port);
                await connect(devices[0] as Port);
            }
        }

        void checkIfAlreadyConnected();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        void send();
    }, [r, g, b]); // eslint-disable-line react-hooks/exhaustive-deps

    const regitsterDevice = async () => {
        if (!port) {
            return;
        }

        // let view = new Uint8Array([r, g, b]).buffer;
        // let view = new Uint8Array([r, g, b]).buffer;
        const enc = new TextEncoder();
        const view = enc.encode(JSON.stringify(payload));
        // let view = enc.encode("Hello World!");
        // console.log("Thing: " + JSON.stringify(payload));
        try {
            await port.send(view);
            const read = await port.readLoop();
            console.log(read);
        } catch (e) {
            console.log(e);
            setPort(null);
        }
    }

    return (
        <div className="App">
            <p>
                {port ? (
                    <button onClick={() => void disconnect()}>Disconnect</button>
                ) : (
                    <button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void connect(port)}>Connect</button>
                )}
            </p>
            {/* <p>
                {errorMessage}
            </p> */}
            {/* <div>
                <input disabled={!port} type="range" min="0" max="255" value={r} onChange={(e) => setR(parseInt(e.target.value))} id="red" />
                <input disabled={!port} type="range" min="0" max="255" value={g} onChange={(e) => setG(parseInt(e.target.value))} id="green" />
                <input disabled={!port} type="range" min="0" max="255" value={b} onChange={(e) => setB(parseInt(e.target.value))} id="blue" />
            </div> */}
            <button className="" onClick={() => void regitsterDevice()} >Send Data</button>
        </div>
    );
}