import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useSearchParams } from 'react-router-dom';
import { useEffect } from "react";
import { useState } from "react";
import { MeetingAppProvider } from "./Components/VideoPlatform/MeetingAppContextDef";
import { MeetingContainer } from "./Components/VideoPlatform/meeting/MeetingContainer";
import { LeaveScreen } from "./Components/VideoPlatform/components/screens/LeaveScreen";
import { JoiningScreen } from "./Components/VideoPlatform/components/screens/JoiningScreen"

function App() {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [customAudioStream, setCustomAudioStream] = useState(null);
  const [customVideoStream, setCustomVideoStream] = useState(null)
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [UserName, setUserName] = useState("");
  const [classId, setClassId] = useState("");
  const [isMeetingCreater, setisMeetingCreater] = useState(false);

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const userName = searchParams.get("userName");
    const isMeetingCreater = searchParams.get("isMeetingCreater");
    const classID = searchParams.get("meetingId");

    

    console.log("The value is:",typeof isMeetingCreater);
    if (isMeetingCreater) {
      setisMeetingCreater(isMeetingCreater);
    }
    setUserName(userName);
    setClassId(classID);
  }, [searchParams]);

  // Add effect to handle persisted meeting state
  useEffect(() => {
    try {

      
      const savedMeetingState = sessionStorage.getItem('meetingState');
      if (savedMeetingState) {
        const { meetingId: savedMeetingId, participantName: savedName, token: savedToken, isJoined } = JSON.parse(savedMeetingState);
        if (isJoined && savedMeetingId && savedToken) {
          // Restore meeting state
          setMeetingId(savedMeetingId);
          setToken(savedToken);
          setParticipantName(savedName || "TestUser");
          setMeetingStarted(true);
        }
      }
    } catch (error) {
      console.error("Error restoring meeting state:", error);
      // Clear potentiallay corrupted satate
      sessionStorage.removeItem('meetingState');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  // Save meeeting state when it changes
  useEffect(() => {
    if (isMeetingStarted && meetingId && token) {
      sessionStorage.setItem('meetingState', JSON.stringify({
        meetingId,
        participantName,
        token,
        isJoined: true
      }));
    }
  }, [isMeetingStarted, meetingId, token, participantName]);

  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  return (
    <MeetingAppProvider>
      {isMeetingStarted ? (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: micOn,
            webcamEnabled: webcamOn,
            name: participantName || "TestUser",
            multiStream: true,
            customCameraVideoTrack: customVideoStream,
            customMicrophoneAudioTrack: customAudioStream
          }}
          token={token}
          reinitialiseMeetingOnConfigChange={true}
          joinWithoutUserInteraction={true}
        >
          <MeetingContainer
            classId={classId}
            isCreater = {isMeetingCreater}
            onMeetingLeave={() => {
              setToken("");
              setMeetingId("");
              setParticipantName("");
              setWebcamOn(false);
              setMicOn(false);
              setMeetingStarted(false);
              // Clear meetng state when leaving
              sessionStorage.removeItem('meetingState');
            }}
            setIsMeetingLeft={setIsMeetingLeft}
          />
        </MeetingProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
      ) : (
        <JoiningScreen
          participantName={participantName}
          setParticipantName={setParticipantName}
          setMeetingId={setMeetingId}
          setToken={setToken}
          micOn={micOn}
          setMicOn={setMicOn}
          webcamOn={webcamOn}
          UserName={UserName}
          classId={classId}
          isCreateMeeting={isMeetingCreater}
          setWebcamOn={setWebcamOn}
          customAudioStream={customAudioStream}
          setCustomAudioStream={setCustomAudioStream}
          customVideoStream={customVideoStream}
          setCustomVideoStream={setCustomVideoStream}
          onClickStartMeeting={() => {
            setMeetingStarted(true);
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft}
        />
      )}
    </MeetingAppProvider>
  );
}

export default App;
