import React, { useState, useEffect } from "react";
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
import axios from 'axios';

const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Classes');
        console.log('Raw class data:', response.data);

        const transformedEvents = response.data.map((cls, index) => {
          console.log('Processing class:', cls);
          
          // Parse the schedule string (format: "Tue, Apr 29 04:00 PM")
          const scheduleParts = cls.schedule.split(' ');
          const month = scheduleParts[1]; // Apr
          const day = scheduleParts[2]; // 29
          const time = scheduleParts[3]; // 04:00
          const period = scheduleParts[4]; // PM
          
          // Convert month name to number (0-11)
          const monthMap = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
          };
          
          // Parse time
          let [hours, minutes] = time.split(':').map(num => parseInt(num));
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          
          // Create start time (using current year since it's not in the schedule string)
          const currentYear = new Date().getFullYear();
          const startTime = new Date(currentYear, monthMap[month], parseInt(day), hours, minutes);
          console.log('Start time:', startTime);
          
          // Create end time by adding duration
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + parseInt(cls.duration));
          console.log('End time:', endTime);

          const event = {
            Id: index + 1,
            Subject: `${cls.className} - ${cls.subject}`,
            StartTime: startTime,
            EndTime: endTime,
            Description: cls.description || '',
            Location: cls.room || 'Online',
            Teacher: cls.teacherName,
            IsAllDay: false,
            RecurrenceRule: '',
            RecurrenceID: null,
            RecurrenceException: null,
            StartTimezone: '',
            EndTimezone: ''
          };

          console.log('Transformed event:', event);
          return event;
        });

        console.log('All transformed events:', transformedEvents);
        setEvents(transformedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('Failed to load classes');
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (isLoading) {
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Navbar />
        <div>Loading classes...</div>
      </div>
    );
  }

  if (error) {
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Navbar />
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

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
        eventSettings={{ 
          dataSource: events,
          fields: {
            id: 'Id',
            subject: { name: 'Subject' },
            startTime: { name: 'StartTime' },
            endTime: { name: 'EndTime' },
            description: { name: 'Description' },
            location: { name: 'Location' },
            isAllDay: { name: 'IsAllDay' },
            recurrenceRule: { name: 'RecurrenceRule' },
            recurrenceID: { name: 'RecurrenceID' },
            recurrenceException: { name: 'RecurrenceException' },
            startTimezone: { name: 'StartTimezone' },
            endTimezone: { name: 'EndTimezone' }
          }
        }}
        readonly={true}
        currentView="Week"
        showWeekend={true}
        workDays={[0, 1, 2, 3, 4, 5, 6]}
        workHours={{
          highlight: true,
          start: '00:00',
          end: '24:00'
        }}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </div>
  );
};

export default Scheduler;
