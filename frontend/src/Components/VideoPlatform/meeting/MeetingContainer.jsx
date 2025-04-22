import React, { useState, useEffect, useRef, createRef, memo } from "react";
import { useMeeting,usePubSub } from "@videosdk.live/react-sdk";
import { BottomBar } from "./components/BottomBar";
import { SidebarConatiner } from "../components/sidebar/SidebarContainer";
import MemorizedParticipantView from "./components/ParticipantView";
import { PresenterView } from "../components/PresenterView";
import WaitingToJoinScreen from "../components/screens/WaitingToJoinScreen";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import { ChatMessages } from "../components/sidebar/ChatPanel";

export function MeetingContainer({ onMeetingLeave, setIsMeetingLeft }) {
  const { setSelectedMic, setSelectedWebcam, setSelectedSpeaker } = useMeetingAppContext();
  const [participantsData, setParticipantsData] = useState([]);
  const [isHost, setIsHost] = useState(false);

  const mMeetingRef = useRef();
  const containerRef = createRef();

  const mMeeting = useMeeting({
    onMeetingJoined: () => console.log("onMeetingJoined"),
    onMeetingLeft: () => {
      setSelectedMic({ id: null, label: null });
      setSelectedWebcam({ id: null, label: null });
      setSelectedSpeaker({ id: null, label: null });
      onMeetingLeave();
    },
    onError: (data) => console.log("meetingErr", data.code, data.message),
  });

  useEffect(() => {
  if (mMeeting?.localParticipant) {
    console.log("Host checker", mMeeting.localParticipant.role);
    if (mMeeting.localParticipant.role === "HOST") {
      setIsHost(true);
      console.log("You are the Host!");
    } else {
      setIsHost(false);
      console.log("You are a Participant!");
    }
  }
}, [mMeeting.localParticipant]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setParticipantsData(Array.from(mMeeting.participants.keys()));
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [mMeeting.participants]);

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  return (
    <div className="fixed inset-0">
      {/* <Notification />   */}
      <div ref={containerRef} className="h-full flex flex-col bg-gray-800">
        {mMeeting.isMeetingJoined ? (
          <>
            <div className={` flex flex-1 flex-row bg-gray-800 `}>
              <div className={`flex flex-1 `}>
                {mMeeting.presenterId ? <PresenterView /> : <MemorizedParticipantView />}
              </div>
              <SidebarConatiner />
            </div>
            <ChatMessages listHeight={20} />
            <BottomBar setIsMeetingLeft={setIsMeetingLeft} />
          </>
        ) : (
          <WaitingToJoinScreen />
        )}
      </div>
    </div>
  );
}
