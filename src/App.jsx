import { useCallback, useEffect, useState } from "react";
import { collectionId, databases, dbId } from "./lib/appwrite";
import Truck from "./components/Truck";
import "./App.css";

const App = () => {
    const [trucks, setTrucks] = useState([]);

    const updataCondition = useCallback(async (id, newState) => {
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
    }, []);

    return (
        <>
            <header className="py-3 px-1 bg-emerald-800 text-white mb-3">
                <h1>Truck Condition</h1>
            </header>
            <ul className="flex items-center justify-center gap-3 flex-wrap">
                {trucks.length > 0 &&
                    trucks.map((truck) => {
                        return (
                            <Truck
                                key={truck.$id}
                                id={truck.$id}
                                loadingBill={truck["loading-bill"]}
                                condition={truck["condition"]}
                                updataCondition={updataCondition}
                            />
                        );
                    })}
            </ul>
        </>
    );
};

export default App;
