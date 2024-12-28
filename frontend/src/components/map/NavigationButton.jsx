import { MapIcon } from "@heroicons/react/24/outline";

export default function NavigationButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            <MapIcon className="h-5 w-5 mr-2" />
            Get Directions
        </button>
    );
}