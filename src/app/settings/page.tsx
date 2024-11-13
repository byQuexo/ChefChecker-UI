"use client"
import React from "react";
import Settings from "@/app/settings/Settings";
import globalStore from "@/app/utils/stores/globalStore";
import {useRouter} from "next/navigation";

export default function Authentication(){
    const router = useRouter();
    const userId = globalStore.userId;

    if (userId) {
        return(
            <div>
                <Settings userId={userId}/>
            </div>
        )
    }

    router.push("/")
}