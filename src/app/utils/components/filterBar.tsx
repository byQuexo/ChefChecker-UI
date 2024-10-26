'use client'
import React from "react";

function FilterBar() {
    return (
        <>
            <div>
                <div className="flex space-x-4">
                    {/* FOR EVERY CATEGORY WHICH IS IN THE DATA BASE CREATE A BUTTON */}
                    <button 
                    className="w-full px-4 py-1 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-grey-500">
                        All Recipies
                    </button>
                    <button
                    className="w-full px-4 py-1 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-grey-500">
                        Bread
                    </button>
                    <button
                    className="w-full px-4 py-1 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-grey-500">
                        Pizza
                    </button>
                    <button
                    className="w-full px-4 py-1 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-grey-500">
                        Noodle
                    </button>
                    <button
                    className="w-full px-4 py-1 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-grey-500">
                    
                    </button>
                </div>
            </div>
        </>
    )
}

export default FilterBar