import { useCallback, useEffect, useState } from "react";
import { collectionId, databases, client, dbId } from "./lib/appwrite";
import "./App.css";
import TruckList from "./components/TruckList";
import cn from "./lib/cn";
import ConfirmModal from "./components/ConfirmModal";
import { supabase } from "./superbaseClient";
import Packaging from "./pages/Packaging";
import MainLayout from "./layout/MainLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Loading from "./pages/Loading";

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
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(false);

    // const [isOpen, setIsOpen] = useState(false);

    // const onOpen = () => setIsOpen(true);
    // const onClose = () => setIsOpen(false);

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
            updatedTrucks[updateTruckIndex]["wh_or_sale"] =
                newState["wh_or_sale"];
            updatedTrucks[updateTruckIndex]["distributor"] =
                newState["distributor"];

            return updatedTrucks;
        });
        // return await databases.updateDocument(dbId, collectionId, id, newState);
        return await supabase.from("trucks").update(newState).eq("id", id);
    }, []);

    const updateLine = useCallback(async (id, newState) => {
        setLines((preLines) => {
            const updatedLine = [...preLines];
            const updateLineIndex = updatedLine.findIndex((l) => l.id === id);
            updatedLine[updateLineIndex].item = newState.item;
            updatedLine[updateLineIndex].status = newState.status;
            updatedLine[updateLineIndex].remark = newState.remark;

            return updatedLine;
        });
        // return await databases.updateDocument(dbId, collectionId, id, newState);
        return await supabase.from("packaging").update(newState).eq("id", id);
    }, []);

    const getLastUpdatedTime = () => {
        const TTimes = trucks.map((t) => new Date(t.updated_at).getTime());
        const LTimes = lines.map((l) => new Date(l.updated_at).getTime());
        const lastTime = Math.max(...TTimes, ...LTimes);

        const date = new Date(lastTime);
        console.log(date, lastTime);
        const dateString = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",

            hour12: false
        });

        return dateString;
    };

    // useEffect(() => {
    //     const getData = async () => {
    //         // const data = await databases.listDocuments(dbId, collectionId);
    //         const { data } = await supabase
    //             .from("trucks")
    //             .select("*")
    //             .order("id", { ascending: true });
    //         // console.log(data);
    //         setTrucks(data);
    //         // setFilterTrucks(data.documents);
    //     };
    //     getData();

    //     // const unsubscribe = client.subscribe(
    //     //     `databases.${dbId}.collections.${collectionId}.documents`,
    //     //     (response) => {
    //     //         if (
    //     //             response.events.includes(
    //     //                 "databases.*.collections.*.documents.*.update"
    //     //             )
    //     //         ) {
    //     //             setTrucks((prev) =>
    //     //                 prev.map((t) =>
    //     //                     t.$id === response.payload.$id
    //     //                         ? response.payload
    //     //                         : t
    //     //                 )
    //     //             );
    //     //         }
    //     //     }
    //     // );
    //     const unsubscribe = supabase
    //         .channel("loading-channel")
    //         .on(
    //             "postgres_changes",
    //             {
    //                 event: "*",
    //                 schema: "public",
    //                 table: "trucks"
    //             },
    //             (payload) => {
    //                 if (payload.eventType === "UPDATE") {
    //                     setTrucks((currentTrucks) =>
    //                         currentTrucks.map((t) =>
    //                             t.id === payload.new.id ? payload.new : t
    //                         )
    //                     );
    //                 }
    //             }
    //         )
    //         .subscribe();

    //     return () => supabase.removeChannel(unsubscribe);
    // }, []);
    useEffect(() => {
        const getData = async () => {
            // const data = await databases.listDocuments(dbId, collectionId);

            const [truckRes, PackagingRes] = await Promise.all([
                supabase
                    .from("trucks")
                    .select("*")
                    .order("id", { ascending: true }),
                supabase
                    .from("packaging")
                    .select("*")
                    .order("id", { ascending: true })
            ]);
            if (truckRes.data) setTrucks(truckRes.data);
            if (PackagingRes.data) setLines(PackagingRes.data);
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
            .channel("all-channel")
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
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "packaging" },
                (payload) => {
                    if (payload.eventType === "UPDATE") {
                        setLines((current) =>
                            current.map((p) =>
                                p.id === payload.new.id ? payload.new : p
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
                wh_or_sale: null,
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
                    (t.wh_or_sale = null),
                    (t.distributor = null);
            });
            console.log(updatedTrucks);
            return updatedTrucks;
        });
        setLoading(false);
    };

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <MainLayout
                        handleReset={handleReset}
                        getLastUpdatedTime={getLastUpdatedTime}
                    />
                }>
                <Route
                    index
                    element={
                        <Loading
                            trucks={trucks}
                            loading={loading}
                            updateCondition={updateCondition}
                        />
                    }
                />
                <Route
                    path="/packaging"
                    element={
                        <Packaging lines={lines} updateLine={updateLine} />
                    }
                />
                <Route
                    path="*"
                    element={
                        <Loading
                            trucks={trucks}
                            loading={loading}
                            updateCondition={updateCondition}
                        />
                    }
                />
                {/* {trucks.length > 0 && <Packaging />} */}
            </Route>
        </Routes>
    );
};

export default App;
