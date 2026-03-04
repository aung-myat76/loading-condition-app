import ReactDom from "react-dom";
import cn from "../lib/cn";
import { useRef } from "react";
import { collectionId, databases, dbId } from "../lib/appwrite";

const Modal = ({ id, truck, bill, isOpen, onClose, cb }) => {
    if (!isOpen) return null;

    const truckRef = useRef(null);

    const handleSelect = async (state) => {
        await cb(state);
        onClose();
    };

    const handleUpdateTruck = async () => {
        await databases.updateDocument(dbId, collectionId, id, {
            truck: truckRef.current.value || "-"
        });
        onClose();
    };

    return ReactDom.createPortal(
        <div
            className="fixed flex items-center justify-center inset-0 bg-stone-100/50 size-screen z-50"
            onClick={() => {
                onClose();
            }}>
            <div
                className="bg-stone-900 w-75 rounded-md p-5 text-white"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-xl ">{bill}</h1>
                    <button
                        onClick={onClose}
                        className=" bg-red-600 px-3 py-1 text-lg text-white rounded-sm">
                        x
                    </button>
                </div>
                <ul className="my-2">
                    <li className="flex justify-between my-5">
                        <input
                            ref={truckRef}
                            placeholder="Truck no"
                            className="w-45 p-2 text-center mr-2 border-b-2 text-lg font-bold border-white focus:outline-none"
                        />
                        <button
                            className="p-2 font-bold bg-blue-600 rounded-sm"
                            onClick={handleUpdateTruck}>
                            Update
                        </button>
                    </li>
                    <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-emerald-600"
                            onClick={() => handleSelect("Free")}>
                            Free
                        </button>
                    </li>
                    <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-yellow-600"
                            onClick={() => handleSelect("Almost")}>
                            Almost
                        </button>
                    </li>
                    <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-red-600"
                            onClick={() => handleSelect("Loading")}>
                            Loading
                        </button>
                    </li>
                    <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-stone-600"
                            onClick={() => handleSelect("Blocked")}>
                            Blocked
                        </button>
                    </li>
                </ul>
            </div>
        </div>,
        document.querySelector("#modal-root")
    );
};

export default Modal;
