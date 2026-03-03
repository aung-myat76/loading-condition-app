import { useCallback, useEffect, useState } from "react";
import { collectionId, databases, client, dbId } from "./lib/appwrite";
import Truck from "./components/Truck";
import "./App.css";

const App = () => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [isEditting, setIsEditting] = useState(false);

    const updateCondition = useCallback(async (id, newState) => {
        setTrucks((preTrucks) => {
            const updatedTrucks = [...preTrucks];
            const updateTruckIndex = updatedTrucks.findIndex(
                (t) => t.$id === id
            );
            console.log(updatedTrucks);
            updatedTrucks[updateTruckIndex].condition = newState.condition;
            return updatedTrucks;
        });
        return await databases.updateDocument(dbId, collectionId, id, newState);
    }, []);

    useEffect(() => {
        const getData = async () => {
            const data = await databases.listDocuments(dbId, collectionId);
            console.log(data.documents);
            setTrucks(data.documents);
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
                condition: "Free"
            });
        });
        await Promise.all(allPromises);
        setTrucks((preTrucks) => {
            const updatedTrucks = [...preTrucks];
            updatedTrucks.map((t) => (t.condition = "Free"));
            return updatedTrucks;
        });
        setLoading(false);
    };

    // const handleEdit = () => {
    //     setIsEditting((preState) => !preState);
    // };

    return (
        <>
            <div>
                <header className="flex items-center justify-between py-3 px-1 bg-emerald-800 text-white mb-5">
                    <h1 className="text-xl font-bold">Loading Condition</h1>
                    <div>
                        {/* <button
                            onClick={handleEdit}
                            className="bg-blue-600 mx-2 p-2 rounded-md text-white">
                            {isEditting ? "Done" : "Edit"}
                        </button> */}
                        <button
                            onClick={handleReset}
                            className="bg-red-600 p-2 rounded-md text-white">
                            Reset
                        </button>
                    </div>
                </header>
                {loading && (
                    <p className="text-xl text-center my-10 font-bold">
                        Loading...
                    </p>
                )}
                {!loading && (
                    <ul className="flex items-center justify-center gap-3 flex-wrap md:w-2/4 mx-auto">
                        {trucks.length > 0 &&
                            trucks.map((truck) => {
                                return (
                                    <Truck
                                        key={truck.$id}
                                        id={truck.$id}
                                        loadingBill={truck["loading-bill"]}
                                        condition={truck["condition"]}
                                        updateCondition={updateCondition}
                                        // isEditting={isEditting}
                                    />
                                );
                            })}
                    </ul>
                )}
            </div>
        </>
    );
};

export default App;
