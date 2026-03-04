import { useCallback, useEffect, useState } from "react";
import { collectionId, databases, client, dbId } from "./lib/appwrite";
// import Truck from "./components/Truck";
import "./App.css";
import TruckList from "./components/TruckList";
import cn from "./lib/cn";

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
    // const [filterTrucks, setFilterTrucks] = useState([]);
    // const [isEditting, setIsEditting] = useState(false);

    // const handleFilter = (state) => {
    //     if (state === "All") {
    //         return setFilterTrucks(trucks);
    //     }
    //     return setFilterTrucks(trucks.filter((t) => t.condition === state));
    // };

    const updateCondition = useCallback(async (id, newState) => {
        setTrucks((preTrucks) => {
            const updatedTrucks = [...preTrucks];
            const updateTruckIndex = updatedTrucks.findIndex(
                (t) => t.$id === id
            );
            console.log(updatedTrucks);
            updatedTrucks[updateTruckIndex].condition = newState.condition;
            updatedTrucks[updateTruckIndex].truck = newState.truck;
            return updatedTrucks;
        });
        return await databases.updateDocument(dbId, collectionId, id, newState);
    }, []);

    useEffect(() => {
        const getData = async () => {
            const data = await databases.listDocuments(dbId, collectionId);
            console.log(data.documents);
            setTrucks(data.documents);
            // setFilterTrucks(data.documents);
        };
        getData();

        const unsubscribe = client.subscribe(
            `databases.${dbId}.collections.${collectionId}.documents`,
            (response) => {
                if (
                    response.events.includes(
                        "databases.*.collections.*.documents.*.update"
                    )
                ) {
                    setTrucks((prev) =>
                        prev.map((t) =>
                            t.$id === response.payload.$id
                                ? response.payload
                                : t
                        )
                    );
                }
            }
        );

        return () => unsubscribe();
    }, []);

    const handleReset = async () => {
        if (!confirm("Are u sure to Reset?")) {
            return;
        }
        setLoading(true);
        const data = await databases.listDocuments(dbId, collectionId);
        const allPromises = data.documents.map((truck) => {
            databases.updateDocument(dbId, collectionId, truck.$id, {
                condition: "Free",
                truck: null
            });
        });
        await Promise.all(allPromises);
        setTrucks((preTrucks) => {
            const updatedTrucks = [...preTrucks];
            updatedTrucks.map((t) => {
                (t.condition = "Free"), (t.truck = null);
            });
            return updatedTrucks;
        });
        setLoading(false);
    };

    // const handleEdit = () => {
    //     setIsEditting((preState) => !preState);
    // };

    const stateChangeCls = cn("p-2 rounded-md");

    return (
        <>
            <div>
                <header className="flex items-center justify-between py-3 px-1 bg-emerald-800 text-white mb-5">
                    <h1 className="text-lg font-bold">Loading Condition</h1>

                    <div>
                        <button
                            onClick={handleReset}
                            className="bg-red-600 p-2 rounded-md text-white">
                            Reset
                        </button>
                    </div>
                </header>
                <div className="flex gap-2 items-center justify-between">
                    {/* <p className=" font-bold mx-3">{getShift()}</p> */}
                    <p className=" font-bold mx-3">{nowDate}</p>
                </div>
                <ul className="flex gap-3 items-center justify-center my-3 text-white">
                    <li>
                        <button
                            onClick={() => setState("All")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "All"
                                    ? "bg-stone-600 border-3 border-stone-100"
                                    : "bg-stone-600/75")
                            }>
                            All : {trucks.length}
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setState("Free")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "Free"
                                    ? "bg-emerald-600 border-3 border-stone-100"
                                    : "bg-emerald-600/75")
                            }>
                            Free :{" "}
                            {trucks.filter((t) => t.condition == "Free").length}
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setState("Almost")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "Almost"
                                    ? "bg-yellow-600 border-3 border-stone-100"
                                    : "bg-yellow-600/75")
                            }>
                            Almost :{" "}
                            {
                                trucks.filter((t) => t.condition == "Almost")
                                    .length
                            }
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setState("Loading")}
                            className={
                                stateChangeCls +
                                " " +
                                (state === "Loading"
                                    ? "bg-red-600 border-3 border-stone-100"
                                    : "bg-red-600/75")
                            }>
                            Loading :{" "}
                            {
                                trucks.filter((t) => t.condition == "Loading")
                                    .length
                            }
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
