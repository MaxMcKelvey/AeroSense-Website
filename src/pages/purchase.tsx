import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { DashboardNavbar } from "~/components/DashboardNavbar";

const Purchase: NextPage = () => {
    const CAN_PURCHASE = false;

    // jsx column element for each type of purchase // lg:w-[25rem]
    const TypeCol: React.FC<{ type: string, Benefits: React.FC }> = ({ type, Benefits }) => {
        return (
            <div className="flex flex-col items-center justify-center w-[20rem]">
                <h2 className="text-3xl">{type}</h2>
                <div className="p-3"></div>
                <div className="text-md shadow-xl rounded-3xl p-10 h-full bg-neutral2 flex flex-col relative">
                    <Benefits />
                    <div className="p-5 m-auto"></div>
                    {CAN_PURCHASE ? 
                        <Link href="/purchase" className="absolute bottom-2 right-2">
                            <div className="text-xl text-right rounded-2xl p-2 px-4 bg-primary text-white">Purchase</div>
                        </Link>
                    :
                        <button className="absolute bottom-2 right-2 text-xl text-right rounded-2xl p-2 px-4 bg-gray-400 text-white">Purchase</button>
                    }
                </div>
            </div>
        )
    }

    const list_classname = "flex flex-col list-disc gap-4 px-2" // flex flex-col items-center justify-center gap-4 list-disc

    // jsx list of the benefits for a standard purchase
    const StandardBenefits: React.FC = () =>
        <ul className={list_classname}>
            <li>Up to 50 sensor connections</li>
            <li>Real-time monitoring and data visualization</li>
            <li>Customizable alerts and notifications</li>
            <li>Basic data analytics and reporting</li>
            <li>User-friendly web-based dashboard</li>
            <li>24/7 customer support</li>
            <li>Affordable pricing</li>
        </ul>

    // jsx list of the benefits for a premium purchase
    const PremiumBenefits: React.FC = () =>
        // items-center justify-center gap-4
        <ul className={list_classname}>
            <li>Up to 500 sensor connections</li>
            <li>Real-time monitoring and data visualization with more advanced features such as heat maps and trend analysis</li>
            <li>Customizable alerts and notifications with more granular controls</li>
            <li>Advanced data analytics and reporting with machine learning capabilities</li>
            <li>Customizable dashboards with multi-user access and role-based permissions</li>
            <li>Advanced security features such as end-to-end encryption and secure APIs</li>
            <li>Integration with other IoT platforms and third-party applications</li>
            <li>Dedicated account manager and priority support</li>
            <li>Scalability for larger organizations and complex deployments</li>
            <li>Additional professional services such as installation, training, and consultation.</li>
        </ul>

            return (
            <>
                <Head>
                    <title>Purchase - AeroSense</title>
                    <meta name="description" content="AeroSense: Your Industrial IoT Proider" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                {/* two columns detailing two different options for purchasing aerosense: "standard", and "premium", with different features */}
                {/* <main className="flex place-content-center place-items-center gap-40"> */}
                <main>
                    <DashboardNavbar />
                    <div className="p-5"></div>
                    <h1 className="text-5xl text-center font-bold text-primary">AeroSense Purchasing Plans</h1>
                    <div className="p-5"></div>
                    <div className="flex place-content-center gap-10 md:gap-20 md:flex-row flex-col place-items-center md:place-items-stretch">
                        <TypeCol type="Standard" Benefits={StandardBenefits}/>
                        <TypeCol type="Premium" Benefits={PremiumBenefits}/>
                    </div>
                    <div className="p-10"></div>
                </main>
                {/* <div className="flex flex-col items-center justify-center min-h-screen py-2"> */}

            </>
            );
};

export default Purchase;
