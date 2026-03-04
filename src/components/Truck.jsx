import { useRef, useState } from "react";
import cn from "../lib/cn";
import Modal from "./Modal";

const Truck = ({ id, loadingBill, truck, condition, updateCondition }) => {
    const conditionRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [editTruck, setEditTruck] = useState(false);

    const handleUpdateState = async (state) => {
        // const state = conditionRef.current.value;
        if (state) {
            if (state === "Free") {
                await updateCondition(id, { truck: null });
            }
            await updateCondition(id, { condition: state });
        }
    };

    const onClose = () => {
        setIsOpen(false);
    };

    const onOpen = () => {
        setIsOpen(true);
    };

    const liCls = cn(
        "flex flex-col   px-3 text-white rounded-md w-27 min-h-23 it",
        condition === "Free"
            ? "bg-emerald-600"
            : condition === "Almost"
              ? "bg-yellow-600"
              : condition === "Blocked"
                ? "bg-stone-600"
                : "bg-red-600"
    );

    return (
        <>
            <Modal
                bill={loadingBill}
                id={id}
                isOpen={isOpen}
                onClose={onClose}
                cb={handleUpdateState}
                truck={truck}
            />
            <li className={liCls} onClick={onOpen}>
                <h2 className="text-xl font-bold">{loadingBill}</h2>
                {editTruck && (
                    <div>
                        <input /> <button>Update</button>
                    </div>
                )}
                {!editTruck && (
                    <p className="text-center py-2 font-bold">
                        {condition === "Free"
                            ? "-"
                            : (truck + "").toUpperCase()}{" "}
                    </p>
                )}
                {/* <p className="my-1 font-bold">{condition}</p> */}

                {/* {!isEditting && <p className="my-2 font-bold">{condition}</p>}
                {isEditting && (
                    <>
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
                                value="Loading">
                                Loading
                            </option>
                            <option
                                className="bg-stone-800 text-white hover:bg-stone-500"
                                value="Block">
                                Block
                            </option>
                        </select>
                        <button
                            className=" p-1 bg-stone-800 rounded-md"
                            onClick={handleUpdateState}>
                            Update
                        </button>
                    </>
                )} */}
            </li>
        </>
    );
};

export default Truck;
