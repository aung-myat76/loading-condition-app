import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../superbaseClient";
import LineList from "../components/LineList";

const Packaging = () => {
    const [lines, setLines] = useState([]);

    useEffect(() => {
        const getData = async () => {
            // const data = await databases.listDocuments(dbId, collectionId);
            const { data } = await supabase
                .from("packaging")
                .select("*")
                .order("id", { ascending: true });
            // console.log(data);
            setLines(data);
            // setFilterTrucks(data.documents);
        };
        getData();

        const unsubscribe = supabase
            .channel("custom-all-channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "packaging"
                },
                (payload) => {
                    if (payload.eventType === "UPDATE") {
                        setLines((currentTrucks) =>
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

    return (
        <div className="mt-5">
            <h2 className="text-center text-2xl font-bold">Packaging Line</h2>
            <LineList lines={lines} updateLine={updateLine} />
        </div>
    );
};

export default Packaging;
