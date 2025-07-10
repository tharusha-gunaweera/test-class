import { RefreshIcon, CheckIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import axios from 'axios'; 
import { toast } from "react-toastify";

export function MeetingDetailsScreen({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  UserName,
  classId,
  isCreateMeeting,
  onClickStartMeeting,
}) {
  const [meetingId, setMeetingId] = useState(classId || "");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isMeetingCreated, setIsMeetingCreated] = useState(false);
  
  console.log("username: ",UserName);
  console.log("Is created",isCreateMeeting);
  console.log("isCreateMeeting type:", typeof isCreateMeeting);
  console.log("isCreateMeeting value:", isCreateMeeting);

  // Convert isCreateMeeting to boolean if it's a string
  const isCreateMeetingBool = isCreateMeeting === "true" || isCreateMeeting === true;

  return (
    <div
      className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}
    >
      {isCreateMeetingBool ? (
        <>
          <div className="border border-solid border-gray-400 rounded-xl px-4 py-3  flex items-center justify-center" onClick={async (e) => {
            setIsRegenerating(true);
          
            console.log("Starting meeting creation...");
            try {
              const result = await _handleOnCreateMeeting();
              console.log("Meeting creation result:", result);
              const { meetingId, err } = result;
              

              setMeetingId(meetingId);
              setIsMeetingCreated(true);
            
              try {
                // First get the current class data
                const classResponse = await axios.get(`http://localhost:5000/Classes/${classId}`);
                const currentClass = classResponse.data;
                console.log("Current class data:", currentClass);

                // Update the class with the new meeting ID while preserving other fields
               
                const response = await axios.put(`http://localhost:5000/Classes/${classId}`, {
                  teacherID: currentClass.teacherID,
                  teacherName: currentClass.teacherName,
                  className: currentClass.className,
                  subject: currentClass.subject, 
                  schedule: currentClass.schedule,
                  duration: currentClass.duration,
                  room: meetingId,
                  description: currentClass.description,
                  mcqs: currentClass.mcqs || []
                });
            
                console.log("Class updated successfully:", response.data);
              } catch (error) {
                console.error("Error updating class:", error);
                toast(
                  `Error updating class: ${error.response?.data?.message || error.message}`,
                  {
                    position: "bottom-left",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeButton: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  }
                );
              }
            } catch (error) {
              console.error("Error in meeting creation:", error);
              toast(
                `Error creating meeting: ${error.message}`,
                {
                  position: "bottom-left",
                  autoClose: 4000,
                  hideProgressBar: true,
                  closeButton: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                }
              );
            } finally {
              setIsRegenerating(false);
            }
          }}>
            <p className="text-white text-base">
              {isMeetingCreated ? "Meeting is created" : "Click to generate meeting"}
            </p>
            
            <button
              className="ml-2"
            >
              {isMeetingCreated ? (
                <CheckIcon className="h-5 w-5 text-green-500" />
              ) : (
                <RefreshIcon className={`h-5 w-5 text-white ${isRegenerating ? 'animate-spin' : ''}`} />
              )}
            </button>
          </div>

          {meetingIdError && (
            <p className="text-xs text-red-600">{`Please enter valid meetingId`}</p>
          )}
        </>
      ) : (
        <>
          <input
            value={meetingId}
            readOnly
            onChange={(e) => {
              setMeetingId(e.target.value);
              setMeetingIdError(false);
            }}
            className="hidden px-4 py-3 bg-gray-650 rounded-xl text-white w-full text-center"
          />
          {meetingIdError && (
            <p className="text-xs text-red-600">{`Please enter valid meetingId`}</p>
          )}
        </>
      )}

      <input
        value={UserName}
        readOnly
        onChange={(e) => setParticipantName(e.target.value)}
        placeholder="Enter your name"
        className="px-4 py-3 mt-5 bg-gray-650 rounded-xl text-white w-full text-center"
      />

      <button
        disabled={isRegenerating}
        className={`w-full ${participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
          }  text-white px-2 py-3 rounded-xl mt-5`}
        onClick={(e) => {
          if (isCreateMeetingBool) {
            onClickStartMeeting();
          } else {
            if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
              onClickJoin(meetingId);
            } else setMeetingIdError(true);
          }
        }}
      >  
        {isCreateMeetingBool ? "Start a meeting" : "Join a meeting"}
      </button>
    </div>
  );
}
