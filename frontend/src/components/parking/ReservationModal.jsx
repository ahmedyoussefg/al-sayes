import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ParkingSpotGrid from "./ParkingSpotGrid";

export default function ReservationModal({ isOpen, onClose, parkingLot }) {
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [duration, setDuration] = useState(1);
    const spotTypes = {
        REGULAR: { color: "bg-blue-500", label: "Regular" },
        DISABLED: { color: "bg-yellow-500", label: "Disabled" },
        EV: { color: "bg-green-500", label: "EV Charging" },
    };

    const handleReserve = () => {
        // Handle reservation logic
        console.log("Reserving spot:", selectedSpot, "for", duration, "hours");
        onClose();
    };

    if (!parkingLot) return null;

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                                <div className="absolute right-0 top-0 pr-4 pt-4">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold leading-6 text-gray-900"
                                        >
                                            Reserve a Spot at {parkingLot.name}
                                        </Dialog.Title>
                                        <div className="mt-6">
                                            <ParkingSpotGrid
                                                spots={parkingLot.spots}
                                                onSpotSelect={setSelectedSpot}
                                            />
                                        </div>
                                        <div className="mt-6">
                                            <label
                                                htmlFor="duration"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Duration (hours)
                                            </label>
                                            <select
                                                id="duration"
                                                value={duration}
                                                onChange={(e) =>
                                                    setDuration(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(
                                                    (hours) => (
                                                        <option
                                                            key={hours}
                                                            value={hours}
                                                        >
                                                            {hours}{" "}
                                                            {hours === 1
                                                                ? "hour"
                                                                : "hours"}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                        {selectedSpot && (
                                            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                                <h4 className="font-medium text-gray-900">
                                                    Reservation Summary
                                                </h4>
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Spot #{selectedSpot.number}{" "}
                                                    (
                                                    {
                                                        spotTypes[
                                                            selectedSpot.type
                                                        ].label
                                                    }
                                                    )
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Duration: {duration}{" "}
                                                    {duration === 1
                                                        ? "hour"
                                                        : "hours"}
                                                </p>
                                                <p className="mt-2 text-lg font-semibold text-gray-900">
                                                    Total: $
                                                    {(
                                                        parkingLot.pricePerHour *
                                                        duration
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                        onClick={handleReserve}
                                        disabled={!selectedSpot}
                                    >
                                        Confirm Reservation
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
