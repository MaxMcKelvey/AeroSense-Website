import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSidebar } from "./DashboardSidebar";

type Props = {
    children: JSX.Element,
}

export const DashboardLayout: React.FC<Props> = ({ children }) => {
    
    return (
        <div className="w-full h-[100vh] grid grid-cols-[200px_auto] grid-rows-[50px_auto] static"> 
            <div className="col-span-2"><DashboardNavbar /></div>
            <DashboardSidebar />
            {children}
        </div>
    );
}