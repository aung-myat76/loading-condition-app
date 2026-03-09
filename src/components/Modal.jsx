import ReactDom from "react-dom";
import { useRef } from "react";
import { collectionId, databases, dbId } from "../lib/appwrite";
import { supabase } from "../superbaseClient";

const Modal = ({ id, truckNo, type, loadingBay, isOpen, onClose, cb }) => {
    const truckRef = useRef(null);
    const typeRef = useRef(null);
    if (!isOpen) return null;

    const handleSelect = async (state) => {
        await cb(state);
        onClose();
    };

    const handleUpdateTruck = async () => {
        // await databases.updateDocument(dbId, collectionId, id, {
        //     truck_no: truckRef.current.value || '-'
        // });
        await supabase
            .from("trucks")
            .update({
                truck_no: truckRef.current.value || null,
                type: typeRef.current.value || null
            })
            .eq("id", id);
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
                    <h1 className="font-bold text-xl ">{loadingBay}</h1>
                    <button
                        onClick={onClose}
                        className=" bg-stone-600 px-3 py-1 text-lg text-white rounded-sm">
                        &#10006;
                    </button>
                </div>
                <ul className="my-2">
                    <li className="flex justify-between my-5">
                        <input
                            ref={truckRef}
                            defaultValue={truckNo}
                            placeholder={
                                !truckNo ? "Truck no" : truckNo.toUpperCase()
                            }
                            className="p-1 w-full text-center text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none"
                        />
                        <select
                            name="types"
                            ref={typeRef}
                            defaultValue={type}
                            placeholder={!type ? "Type" : type}
                            className="p-1 mx-2 text-center text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none">
                            <option value={""}>Type</option>
                            <option value={"6"}>6</option>
                            <option value={"12"}>12</option>
                            <option value={"22"}>22</option>
                        </select>
                        <button
                            className="p-1 font-bold bg-blue-600  rounded-sm"
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
