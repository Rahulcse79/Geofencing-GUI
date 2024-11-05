import React from "react";
import Map from "./Helper/Map";
import Sidebar from "./Sidebar/Sidebar";

export default function Geofencing() {

  return (
    <>
      <Sidebar />
      <Map locations/>
    </>
  );
}
