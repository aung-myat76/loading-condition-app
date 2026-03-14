import { useState } from "react";
import cn from "../lib/cn";
import Modal from "./Modal";

const Truck = ({
    id,
    loadingBay,
    truckNo,
    type,
    distributor,
    condition,
    updateCondition
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleUpdateState = async (state) => {
        if (state) {
            if (state === "Free" || state === "Blocked") {
                await updateCondition(id, {
                    truck_no: null,
                    type: null,
                    distributor: null
                });
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
        "flex flex-col   px-1 rounded-md w-27 min-h-23 cursor-pointer",
        condition === "Free"
            ? "free"
            : condition === "Start"
              ? "start"
              : condition === "Half"
                ? "half"
                : condition === "Loaded"
                  ? "loaded"
                  : condition === "Blocked"
                    ? "blocked"
                    : ""
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
                distributor={distributor}
            />
            <li className={liCls} onClick={onOpen}>
                <h2 className="text-xl font-bold">{loadingBay}</h2>
                <div className="flex flex-col   font-bold items-center justify-center ">
                    <p className=" my-1  flex text-[10px]   items-center justify-center">
                        <span className="">
                            {truckNo ? String(truckNo).toUpperCase() : "-"}
                        </span>
                        {type && <span className="ml-1">{`- ${type}W`}</span>}
                    </p>
                    <div>{distributor}</div>
                </div>
            </li>
        </>
    );
};

export default Truck;
