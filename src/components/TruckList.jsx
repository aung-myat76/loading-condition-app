import React, { useEffect, useState } from "react";
import Truck from "./Truck";

const TruckList = ({ trucks, state, updateCondition }) => {
    const [filterTrucks, setFilterTrucks] = useState(trucks);

    useEffect(() => {
        setFilterTrucks((preTrucks) => {
            const updatedTrucks = [...trucks];
            if (state === "All") {
                return updatedTrucks;
            } else {
                return updatedTrucks.filter((t) => t.condition === state);
            }
        });
    }, [state]);
    return (
        <ul className="flex items-center justify-center gap-3 flex-wrap md:w-2/4 mx-auto">
            {filterTrucks.length > 0 &&
                filterTrucks.map((truck) => {
                    return (
                        <Truck
                            key={truck.$id}
                            id={truck.$id}
                            loadingBill={truck["loading-bill"]}
                            condition={truck["condition"]}
                            truck={truck["truck"]}
                            updateCondition={updateCondition}
                            // isEditting={isEditting}
                        />
                    );
                })}
        </ul>
    );
};

export default TruckList;
