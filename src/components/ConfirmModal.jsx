import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import cn from "../lib/cn";

const ConfirmModal = ({ isOpen, onClose, cb }) => {
    const [isTouched, setIsTouched] = useState(false);
    const [text, setText] = useState("");
    const [isFirstTime, setIsFirstTime] = useState(true);

    const validForm = isTouched && text.trim().toLowerCase() === "yes";

    useEffect(() => {
        if (!isOpen) {
            setText("");
            setIsFirstTime(true);
            setIsTouched(false);
        }
    }, [isOpen]);
    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!validForm && !isFirstTime) {
            return;
        } else {
            await cb();
            onClose();
            setText("");
            setIsFirstTime(true);
            setIsTouched(false);
        }
    };

    const inputCls = cn(
        "p-2 rounded-sm w-full my-3 bg-stone-100 text-stone-900 focus:outline-none",
        validForm || isFirstTime ? null : "border-2 border-red-600"
    );

    return ReactDom.createPortal(
        <div
            className="fixed flex items-center justify-center inset-0 bg-stone-100/50 size-screen z-50"
            onClick={() => {
                onClose();
            }}>
            <div
                className="bg-stone-900 w-75 rounded-md p-5 text-white"
                onClick={(e) => e.stopPropagation()}>
                <div className="">
                    <h1 className="font-bold text-xl text-center ">
                        Reset Confirmation
                    </h1>
                </div>
                <div className="my-5">
                    <label htmlFor="confirmInput">
                        Please type <strong>yes</strong> to reset.
                    </label>
                    <input
                        className={inputCls}
                        onChange={(e) => {
                            setText(e.target.value);
                            setIsTouched(true);
                            setIsFirstTime(false);
                        }}
                        value={text}
                        // ref={confirmInputRef}
                        id="confirmInput"
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            className="p-2 rounded-sm bg-stone-600"
                            onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="p-2 rounded-sm bg-red-600"
                            onClick={handleConfirm}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.querySelector("#modal-root")
    );
};

export default ConfirmModal;
