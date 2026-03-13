import { useCallback, useEffect, useState } from "react";
import { collectionId, databases, client, dbId } from "./lib/appwrite";
import "./App.css";
import TruckList from "./components/TruckList";
import cn from "./lib/cn";
import ConfirmModal from "./components/ConfirmModal";
import { supabase } from "./superbaseClient";

const now = new Date();
const nowDate = now.toLocaleDateString("en-GB");

// const getShift = () => {
//     const time = now.getHours();

//     if (time >= 6 && time <= 18) {
//         return "Morning Shift";
//     } else {
//         return "Night Shift";
//     }
// };

const App = () => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState("All");
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    const updateCondition = useCallback(async (id, newState) => {
        setTrucks((preTrucks) => {
            const updatedTrucks = [...preTrucks];
            const updateTruckIndex = updatedTrucks.findIndex(
                (t) => t.id === id
            );
            console.log(updatedTrucks);
            updatedTrucks[updateTruckIndex].condition = newState.condition;
            updatedTrucks[updateTruckIndex]["truck_no"] = newState["truck_no"];
            updatedTrucks[updateTruckIndex]["type"] = newState["type"];
            updatedTrucks[updateTruckIndex]["distributor"] =
                newState["distributor"];

            return updatedTrucks;
        });
        // return await databases.updateDocument(dbId, collectionId, id, newState);
        return await supabase.from("trucks").update(newState).eq("id", id);
    }, []);

    const getLastUpdatedTime = () => {
        const times = trucks.map((t) => new Date(t.updated_at).getTime());
        const lastTime = Math.max(...times);

        const date = new Date(lastTime);
        console.log(date, lastTime);
        const dateString = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",

            hour12: false
        });

        return dateString;
    };

    useEffect(() => {
        const getData = async () => {
            // const data = await databases.listDocuments(dbId, collectionId);
            const { data } = await supabase
                .from("trucks")
                .select("*")
                .order("id", { ascending: true });
            // console.log(data);
            setTrucks(data);
            // setFilterTrucks(data.documents);
        };
        getData();

        // const unsubscribe = client.subscribe(
        //     `databases.${dbId}.collections.${collectionId}.documents`,
        //     (response) => {
        //         if (
        //             response.events.includes(
        //                 "databases.*.collections.*.documents.*.update"
        //             )
        //         ) {
        //             setTrucks((prev) =>
        //                 prev.map((t) =>
        //                     t.$id === response.payload.$id
        //                         ? response.payload
        //                         : t
        //                 )
        //             );
        //         }
        //     }
        // );
        const unsubscribe = supabase
            .channel("custom-all-channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "trucks"
                },
                (payload) => {
                    if (payload.eventType === "UPDATE") {
                        setTrucks((currentTrucks) =>
                            currentTrucks.map((t) =>
                                t.id === payload.new.id ? payload.new : t
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(unsubscribe);
    }, []);

    const handleReset = async () => {
        setLoading(true);
        // const data = await databases.listDocuments(dbId, collectionId);
        // const allPromises = data.documents.map((truck) => {
        //     databases.updateDocument(dbId, collectionId, truck.$id, {
        //         condition: "Free",
        //         truck_no: '-'
        //     });
        // });
        const { data } = await supabase
            .from("trucks")
            .update({
                condition: "Free",
                truck_no: null,
                type: null,
                distributor: null
            })
            .not("id", "is", null);
        // await Promise.all(allPromises);
        setTrucks((preTrucks) => {
            const updatedTrucks = [...preTrucks];
            updatedTrucks.map((t) => {
                (t.condition = "Free"),
                    (t.truck_no = "-"),
                    (t.type = null),
                    (t.distributor = null);
            });
            console.log(updatedTrucks);
            return updatedTrucks;
        });
        setLoading(false);
    };

    const stateChangeCls = cn("p-2 rounded-md text-[10px] font-bold");

    return (
        <>
            <ConfirmModal isOpen={isOpen} onClose={onClose} cb={handleReset} />
            <div>
                <header className="flex items-center justify-between py-3 px-1 bg-emerald-800 text-white mb-5">
                    <h1 className="text-md font-bold">CWH ( YARD Management System )</h1>

                    <div>
                        <button
                            onClick={onOpen}
                            className="bg-red-600 p-2 rounded-md text-white">
                            Reset
                        </button>
                    </div>
                </header>
                <div className="flex gap-2 items-center justify-around">
                    {/* <p className=" font-bold mx-3">{getShift()}</p> */}
                    <p className=" font-bold">{nowDate}</p>
                    <p className="">
                        last updated at -{" "}
                        <span className="font-boldzx">
                            {getLastUpdatedTime()}
                        </span>
                    </p>
                    {/* <div className="flex flex-col justify-center items-center text-center bg-red-200 p-2 rounded-md">
                        <h2 className="font-bold">Warning</h2>
                        <p>
                            Please don't use the app now. <br />
                            we're currently upgrading our app.
                        </p>
                    </div> */}
                </div>
                <ul className="flex gap-1 justify-center my-3 text-white ">
                    <li>
                        <button
                            onClick={() => setState("All")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "All"
                                    ? "bg-blue-600 "
                                    : "bg-blue-600/50")
                            }>
                            Total Loading [{trucks.length}]
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setState("Free")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "Free"
                                    ? "bg-emerald-600 "
                                    : "bg-emerald-600/50")
                            }>
                            Free Loading [
                            {trucks.filter((t) => t.condition == "Free").length}
                            ]
                        </button>
                    </li>
                    {/* <li>
                        <button
                            onClick={() => setState("Almost")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "Almost"
                                    ? "bg-yellow-600 "
                                    : "bg-yellow-600/50")
                            }>
                            Almost [
                            {
                                trucks.filter((t) => t.condition == "Almost")
                                    .length
                            }
                            ]
                        </button>
                    </li> */}
                    <li>
                        <button
                            onClick={() => setState("Start")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "Start"
                                    ? "bg-yellow-300 "
                                    : "bg-yellow-300/50")
                            }>
                            Start Loading [
                            {
                                trucks.filter((t) => t.condition == "Start")
                                    .length
                            }
                            ]
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setState("Half")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "Half"
                                    ? "bg-orange-400 "
                                    : "bg-orange-400/50")
                            }>
                            Half Loaded [
                            {trucks.filter((t) => t.condition == "Half").length}
                            ]
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setState("Loaded")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "Loaded"
                                    ? "bg-red-800 "
                                    : "bg-red-800/50")
                            }>
                            Fully Loaded [
                            {
                                trucks.filter((t) => t.condition == "Loaded")
                                    .length
                            }
                            ]
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setState("Blocked")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "Blocked"
                                    ? "bg-stone-600 "
                                    : "bg-stone-600/50")
                            }>
                            Blocked Loading [
                            {
                                trucks.filter((t) => t.condition == "Blocked")
                                    .length
                            }
                            ]
                        </button>
                    </li>
                </ul>

                {loading && (
                    <p className="text-xl text-center my-10 font-bold">
                        Loading...
                    </p>
                )}
                {!loading && trucks.length > 0 && (
                    <TruckList
                        trucks={trucks}
                        state={state}
                        updateCondition={updateCondition}
                    />
                )}
            </div>
        </>
    );
};

export default App;
