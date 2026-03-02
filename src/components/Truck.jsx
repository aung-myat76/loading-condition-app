import { useRef } from "react";
import cn from "../lib/cn";

const Truck = ({ id, loadingBill, condition, updataCondition }) => {
    const conditionRef = useRef(null);

    const handleUpdateState = async () => {
        const state = conditionRef.current.value;
        if (state) {
            await updataCondition(id, { condition: state });
        }
    };

    const liCls = cn(
        "flex flex-col p-3 text-white rounded-md w-27 text-center",
        condition === "Free"
            ? "bg-emerald-600"
            : condition === "Almost"
              ? "bg-yellow-600"
              : "bg-red-600"
    );

    return (
        <li className={liCls}>
            <h2 className="text-xl font-bold">{loadingBill}</h2>
            {/* <p className="my-1 font-bold">{condition}</p> */}

            <select
                ref={conditionRef}
                name="state"
                id="state"
                className="border-1 my-2 border-stone-800 py-1 rounded-md"
                defaultValue={condition}>
                <option
                    className="bg-stone-800 text-white hover:bg-stone-500"
                    value="Free">
                    Free
                </option>
                <option
                    className="bg-stone-800 text-white hover:bg-stone-500"
                    value="Almost">
                    Almost
                </option>
                <option
                    className="bg-stone-800 text-white hover:bg-stone-500"
                    value="Parked">
                    Parked
                </option>
            </select>
            <button
                className=" p-1 bg-stone-800 rounded-md"
                onClick={handleUpdateState}>
                Update
            </button>
        </li>
    );
};

export default Truck;
