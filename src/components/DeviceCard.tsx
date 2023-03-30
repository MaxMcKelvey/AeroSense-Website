import { DeviceType } from "@prisma/client";
import Image from "next/image";

const b_trans = "scale-0 transition ease-in-out group-hover:scale-100 duration-200"
const b_pos_size = "absolute bottom-[-16px] right-[-16px] w-16 h-8 rounded-full"

export const DeviceCard: React.FC<{name: string, type: DeviceType, edit: () => void}> = ({ name, type, edit }) => {
    let typeImage;
    switch(type) {
        case DeviceType.MOUNTEDv1: {
            typeImage = "bg-primary";
            break;
        }
        case DeviceType.PERSONALv1: {
            typeImage = "bg-secondary2";
            break;
        }
    }

    return (
        <div className="group w-40 h-48 text-sm text-center rounded-lg bg-neutral2 relative flex flex-col justify-start place-items-center" onClick={() => edit()} >
            <div className="p-4"></div>
            {/* <div className={`${typeImage} w-20 h-20 rounded-md`}></div> */}
            <Image src="/MOUNTEDv1.png" alt="MOUNTEDv1" width={80} height={80} />
            <div className="p-4"></div>
            {name}
            <button className={`invisible group-hover:visible bg-secondary2 ${b_pos_size} ${b_trans}`} onClick={() => edit()} >Edit</button>
        </div>
    );
}