import React from "react";
import Navbar from './Navbar'
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from "@syncfusion/ej2-react-schedule";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";

const Scheduler = () => {

const events = [
    {
    Id: 1,
    Subject: "Math Lecture",
    StartTime: new Date(2025, 2, 20, 10, 0),
    EndTime: new Date(2025, 2, 20, 11, 30),
    },
    {   
    Id: 2,
    Subject: "Physics Class",
    StartTime: new Date(2025, 2, 21, 14, 0),
    EndTime: new Date(2025, 2, 21, 15, 30),
    },
    {
    Id: 3,
    Subject: "Computer Science",
    StartTime: new Date(2025, 2, 22, 13, 0),
    EndTime: new Date(2025, 2, 22, 14, 30),
    },
];

return (
    <div style={{
        position: "absolute", 
        right: "0",
        top: "0", 
        width: "auto",
        marginLeft:"300px",
        marginRight:"50px",
        marginTop:"100px",
        height: "83vh",
        overflow: "hidden", 
    }}>
        <Navbar />
    <ScheduleComponent
        width="100%"
        height="100vh" 
        eventSettings={{ dataSource: events }}
        readonly={true}
        
    >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>
    </div>
);
};

export default Scheduler;
