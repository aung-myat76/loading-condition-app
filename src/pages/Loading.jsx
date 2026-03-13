import React, { useState } from "react";
import TruckList from "../components/TruckList";
import cn from "../lib/cn";

const Loading = ({ trucks, loading, updateCondition }) => {
    const [state, setState] = useState("All");
    console.log(trucks);
    const stateChangeCls = cn("p-2 rounded-md text-[10px] font-bold");

    return (
        <div>
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
                        {trucks.filter((t) => t.condition == "Free").length}]
                    </button>
                </li>
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
                        {trucks.filter((t) => t.condition == "Start").length}]
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
                        {trucks.filter((t) => t.condition == "Half").length}]
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
                        {trucks.filter((t) => t.condition == "Loaded").length}]
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
                        {trucks.filter((t) => t.condition == "Blocked").length}]
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
    );
};

export default Loading;
