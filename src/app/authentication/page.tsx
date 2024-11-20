"use client"
import React from "react";
import LoginRegister from "../utils/components/LoginRegister";
import NavBar from "../utils/components/index/Header/Navbar";
import rootStore from "../utils/stores/globalStore";

export default function Authentication(){
  
    return(
      <div className={`min-h-screen flex flex-col ${rootStore.darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
          <LoginRegister  />
        </div>
    )
}
