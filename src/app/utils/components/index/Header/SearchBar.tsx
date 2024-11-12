"use client"

import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import rootStore from "@/app/utils/stores/globalStore";

interface Props {
    onSearch: (value: string) => void;
}

const SearchBar: React.FC<Props> = observer(function SearchBar({onSearch}: Props) {
    const [inputValue, setInputValue] = useState('');

    const darkMode = rootStore.darkMode;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(inputValue);
        }
    };
    return (
        <div className="relative flex-grow max-w-xl mx-4">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    placeholder='e.g. "Pizza" or "Noodle"'
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border 
                                ${darkMode
                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500'}
                                       focus:outline-none`
                                }
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
});

export default SearchBar;
