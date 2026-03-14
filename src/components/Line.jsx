import React, { useState } from "react";
import cn from "../lib/cn";
import PackagingModal from "./PackagingModal";

const Line = ({ id, name, item, status, remark, updateLine }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => setIsOpen(false);
    const onOpen = () => setIsOpen(true);

    const liCls = cn(
        "flex flex-col   p-2 text-white rounded-md w-40 min-h-35 cursor-pointer",
        status === "Running"
            ? "bg-emerald-600"
            : status === "No Production"
              ? "bg-red-600"
              : "bg-stone-600"
    );

    const handleUpdateState = async (state) => {
        if (state) {
            if (
                state.status === "No Production" ||
                state.status === "Unknown"
            ) {
                await updateLine(id, {
                    item: null,
                    remark: null,
                    status: state.status
                });
            } else {
                await updateLine(id, state);
            }
        }
    };
    console.log(item);
    return (
        <>
            <PackagingModal
                id={id}
                name={name}
                item={item}
                remark={remark}
                cb={handleUpdateState}
                isOpen={isOpen}
                onClose={onClose}
            />
            <li className={liCls} onClick={onOpen}>
                <h2 className="text-xl font-bold">{name}</h2>
                <div className="flex flex-col text-[10px] text-white  font-bold  ">
                    <p className=" my-1  flex    ">
                        <span className="">Item - {!item ? "" : item}</span>
                    </p>
                    <div>Status - {!status ? "Unknown" : status}</div>
                    <div>{remark}</div>
                </div>
            </li>
        </>
    );
};

export default Line;
