import Sidebar from "@/app/Components/Admin/Sidebar";
export default function Settings() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col w-full">

                <div className="flex justify-center items-center flex-grow">
                    <h1>Settings to updating</h1>
                </div>
            </div>
        </div>

    );
}