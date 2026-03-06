import { useState } from "react";
import cn from "../lib/cn";
import Modal from "./Modal";

const Truck = ({ id, loadingBay, truckNo, condition, updateCondition }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleUpdateState = async (state) => {
        if (state) {
            if (state === "Free") {
                await updateCondition(id, { truck_no: null });
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
                loadingBay={loadingBay}
                id={id}
                isOpen={isOpen}
                onClose={onClose}
                cb={handleUpdateState}
                truckNo={truckNo}
            />
            <li className={liCls} onClick={onOpen}>
                <h2 className="text-xl font-bold">{loadingBay}</h2>
                <p className="text-center my-2 font-bold">
                    {truckNo ? String(truckNo).toUpperCase() : "-"}
                </p>
            </li>
        </>
    );
};

export default Truck;
