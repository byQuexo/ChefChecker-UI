'use client'

import * as React from 'react';

function Footer() {
    return (
        <>
            <div className="bg-gray-200 text-center p-4 absolute bottom-0 w-full">
                <div>
                    <p>&copy; {new Date().getFullYear()} ChefChecker.
                        \n All rights reserved.
                        \n Tim Guehnemann
                        \n David Werner
                        \n Manita Tamang
                        \n Hannah-Ann Nana-Hackman
                    </p>
                </div>
            </div>
        </>
    );
};

export default Footer;