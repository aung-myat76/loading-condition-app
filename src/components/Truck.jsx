import { useState } from "react";
import cn from "../lib/cn";
import Modal from "./Modal";

const Truck = ({
    id,
    loadingBay,
    truckNo,
    type,
    condition,
    updateCondition
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleUpdateState = async (state) => {
        if (state) {
            if (state === "Free" || state === "Blocked") {
                await updateCondition(id, { truck_no: null, type: null });
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
        "flex flex-col   px-1 text-white rounded-md w-27 min-h-23 it",
        condition === "Free"
            ? "bg-emerald-600"
            : condition === "Start"
              ? "bg-yellow-300"
              : condition === "Half"
                ? "bg-orange-500"
                : condition === "Loaded"
                  ? "bg-red-600"
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
                type={type}
            />
            <li className={liCls} onClick={onOpen}>
                <h2 className="text-xl font-bold">{loadingBay}</h2>
                <p className=" my-1 font-bold flex text-[12px] text-stone-900 items-center justify-center">
                    <span className="">
                        {truckNo ? String(truckNo).toUpperCase() : "-"}
                    </span>
                    {type && <span className=""> {` - ${type}W`}</span>}
                </p>
            </li>
        </>
    );
};

export default Truck;
