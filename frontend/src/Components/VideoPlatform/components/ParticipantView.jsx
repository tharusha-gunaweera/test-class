import { Popover, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useParticipant } from "@videosdk.live/react-sdk";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import MicOffSmallIcon from "../icons/MicOffSmallIcon";
import NetworkIcon from "../icons/NetworkIcon";
import SpeakerIcon from "../icons/SpeakerIcon";
import { getQualityScore, nameTructed } from "../utils/common";
import * as ReactDOM from "react-dom";
import { useMeetingAppContext } from "../MeetingAppContextDef";

export const CornerDisplayName = ({
  participantId,
  isPresenting,
  displayName,
  isLocal,
  micOn,
  mouseOver,
  isActiveSpeaker,
}) => {
  const [statsBoxHeightRef, setStatsBoxHeightRef] = useState(null);
  const [statsBoxWidthRef, setStatsBoxWidthRef] = useState(null);
  const [coords, setCoords] = useState({});

  const statsBoxHeight = useMemo(
    () => statsBoxHeightRef?.offsetHeight,
    [statsBoxHeightRef]
  );

  const statsBoxWidth = useMemo(
    () => statsBoxWidthRef?.offsetWidth,
    [statsBoxWidthRef]
  );

  const analyzerSize = 32; // Fixed size for desktop

  const show = useMemo(() => mouseOver, [mouseOver]);

  const {
    webcamStream,
    micStream,
    screenShareStream,
    getVideoStats,
    getAudioStats,
    getShareStats,
    getShareAudioStats
  } = useParticipant(participantId);

  const statsIntervalIdRef = useRef();
  const [score, setScore] = useState({});
  const [audioStats, setAudioStats] = useState({});
  const [videoStats, setVideoStats] = useState({});

  const updateStats = async () => {
    let stats = [];
    let audioStats = [];
    let videoStats = [];
    if (isPresenting) {
      stats = await getShareStats();
    } else if (webcamStream) {
      stats = await getVideoStats();
    } else if (micStream) {
      stats = await getAudioStats();
    }

    if (webcamStream || micStream || isPresenting) {
      videoStats = isPresenting ? await getShareStats() : await getVideoStats();
      audioStats = isPresenting ? await getShareAudioStats() : await getAudioStats();
    }

    let score = stats
      ? stats.length > 0
        ? getQualityScore(stats[0])
        : 100
      : 100;

    setScore(score);
    setAudioStats(audioStats);
    setVideoStats(videoStats);
  };

  const qualityStateArray = [
    { label: "", audio: "Audio", video: "Video" },
    {
      label: "Latency",
      audio: audioStats && audioStats[0]?.rtt ? `${audioStats[0]?.rtt} ms` : "-",
      video: videoStats && videoStats[0]?.rtt ? `${videoStats[0]?.rtt} ms` : "-",
    },
    // ... rest of the quality state array items remain the same
  ];

  useEffect(() => {
    if (webcamStream || micStream || screenShareStream) {
      updateStats();
      if (statsIntervalIdRef.current) {
        clearInterval(statsIntervalIdRef.current);
      }
      statsIntervalIdRef.current = setInterval(updateStats, 500);
    } else {
      if (statsIntervalIdRef.current) {
        clearInterval(statsIntervalIdRef.current);
        statsIntervalIdRef.current = null;
      }
    }

    return () => {
      if (statsIntervalIdRef.current) clearInterval(statsIntervalIdRef.current);
    };
  }, [webcamStream, micStream, screenShareStream]);

  return (
    <>
      <div
        className="absolute bottom-2 left-2 rounded-md flex items-center justify-center p-2"
        style={{
          backgroundColor: "#00000066",
          transition: "all 200ms",
          transitionTimingFunction: "linear",
          transform: `scale(${show ? 1 : 0})`,
        }}
      >
        {!micOn && !isPresenting ? (
          <MicOffSmallIcon fillcolor="white" />
        ) : micOn && isActiveSpeaker ? (
          <SpeakerIcon />
        ) : null}
        <p className="text-sm text-white ml-0.5">
          {isPresenting
            ? isLocal
              ? `You are presenting`
              : `${nameTructed(displayName, 15)} is presenting`
            : isLocal
            ? "You"
            : nameTructed(displayName, 26)}
        </p>
      </div>

      {(webcamStream || micStream || screenShareStream) && (
        <div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="absolute top-2 right-2 rounded-md p-2 cursor-pointer"
          >
            <Popover className="relative">
              {({ close }) => (
                <>
                  <Popover.Button
                    className={`absolute right-0 top-0 rounded-md flex items-center justify-center p-1.5 cursor-pointer`}
                    style={{
                      backgroundColor:
                        score > 7
                          ? "#3BA55D"
                          : score > 4
                          ? "#faa713"
                          : "#FF5D5D",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.target.getBoundingClientRect();
                      setCoords({
                        left: Math.round(rect.x + rect.width / 2),
                        top: Math.round(rect.y + window.scrollY),
                      });
                    }}
                  >
                    <div>
                      <NetworkIcon
                        color1={"#ffffff"}
                        color2={"#ffffff"}
                        color3={"#ffffff"}
                        color4={"#ffffff"}
                        style={{
                          height: analyzerSize * 0.6,
                          width: analyzerSize * 0.6,
                        }}
                      />
                    </div>
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel style={{ zIndex: 999 }} className="absolute">
                      {ReactDOM.createPortal(
                        <div
                          ref={setStatsBoxWidthRef}
                          style={{
                            top: coords?.top,
                            left: coords?.left - statsBoxWidth,
                          }}
                          className={`absolute`}
                        >
                          <div
                            ref={setStatsBoxHeightRef}
                            className="bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                          >
                            {/* Stats popover content remains the same */}
                          </div>
                        </div>,
                        document.body
                      )}
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        </div>
      )}
    </>
  );
};

export function ParticipantView({ participantId }) {
  const {
    displayName,
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    mode,
    isActiveSpeaker,
  } = useParticipant(participantId);

  const { selectedSpeaker } = useMeetingAppContext();
  const micRef = useRef(null);
  const [mouseOver, setMouseOver] = useState(false);

  useEffect(() => {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (micRef.current) {
      try {
        if (!isFirefox) {
          micRef.current.setSinkId(selectedSpeaker.id);
        }
      } catch(err) {
        console.log("Setting speaker device failed", err);
      }
    } 
  }, [selectedSpeaker]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) => console.error("micRef.current.play() failed", error));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn, micRef]);

  const webcamMediaStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  return mode === "CONFERENCE" ? (
    <div
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      className="h-full w-full bg-gray-750 relative overflow-hidden rounded-lg video-cover"
    >
      <audio ref={micRef} autoPlay muted={isLocal} />
      {webcamOn ? (
        <ReactPlayer
          playsinline
          playIcon={<></>}
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={webcamMediaStream}
          height="100%"
          width="100%"
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="z-10 flex items-center justify-center rounded-full bg-gray-800 h-[92px] w-[92px]">
            <p className="text-2xl text-white">
              {String(displayName).charAt(0).toUpperCase()}
            </p>
          </div>
        </div>
      )}
      <CornerDisplayName
        {...{
          isLocal,
          displayName,
          micOn,
          webcamOn,
          isPresenting: false,
          participantId,
          mouseOver,
          isActiveSpeaker,
        }}
      />
    </div>
  ) : null;
}