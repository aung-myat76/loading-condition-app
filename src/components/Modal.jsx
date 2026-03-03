import ReactDom from "react-dom";
import cn from "../lib/cn";

const Modal = ({ bill, isOpen, onClose, cb }) => {
    if (!isOpen) return null;

    const handleSelect = async (state) => {
        await cb(state);
        onClose();
    };

    return ReactDom.createPortal(
        <div
            className="fixed flex items-center justify-center inset-0 bg-stone-100/50 size-screen z-50"
            onClick={() => {
                onClose();
            }}>
            <div
                className="bg-stone-900 w-50 rounded-md p-5 text-white"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-xl ">{bill}</h1>
                    <button className=" bg-red-600 px-3 py-1 text-white rounded-sm">
                        x
                    </button>
                </div>
                <ul>
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
