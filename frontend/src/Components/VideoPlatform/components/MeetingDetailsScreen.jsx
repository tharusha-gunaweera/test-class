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
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isMeetingCreated, setIsMeetingCreated] = useState(false);
  
  

  console.log("username: ",UserName);
  console.log("Is created",isCreateMeeting)

  return (
    <div
      className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}
    >
      {isCreateMeeting ? (
        <>
          <div className="border border-solid border-gray-400 rounded-xl px-4 py-3  flex items-center justify-center" onClick={async (e) => {
            if (isMeetingCreated) return;
            setIsRegenerating(true);
            const { meetingId, err } = await _handleOnCreateMeeting();
          
            if (meetingId) {
              setMeetingId(meetingId);
              setIsMeetingCreated(true);
            } else {
              toast(
                `${err}`,
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
            setIsRegenerating(false);
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
            defaultValue={meetingId}
            onChange={(e) => {
              setMeetingId(e.target.value);
            }}
            placeholder={"Enter meeting Id"}
            className="px-4 py-3 bg-gray-650 rounded-xl text-white w-full text-center"
          />
          {meetingIdError && (
            <p className="text-xs text-red-600">{`Please enter valid meetingId`}</p>
          )}
        </>
      ) }

      {(isCreateMeeting || !isCreateMeeting) && (
        <>
          <input
            value={UserName}
            readOnly
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 bg-gray-650 rounded-xl text-white w-full text-center"
          />

          <button
            disabled={participantName.length < 3 || !isMeetingCreated}
            className={`w-full ${participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
              }  text-white px-2 py-3 rounded-xl mt-5`}
            onClick={(e) => {
              if (isCreateMeeting) {
                onClickStartMeeting();
              } else {
                if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                  onClickJoin(meetingId);
                } else setMeetingIdError(true);
              }
            }}
          >
            {isCreateMeeting ? "Start a meeting" : "Join a meeting"}
          </button>
        </>
      )}
    </div>
  );
}
