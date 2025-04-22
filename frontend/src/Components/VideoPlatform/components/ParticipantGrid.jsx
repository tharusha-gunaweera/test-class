import React from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import { ParticipantView } from "./ParticipantView";

const MemoizedParticipant = React.memo(ParticipantView);

function ParticipantGrid({ participantIds }) {
  const { sideBarMode } = useMeetingAppContext();
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // Define grid columns dynamically
  const gridCols = isMobile
    ? "grid-cols-1"
    : participantIds.length <= 4
    ? "grid-cols-2"
    : participantIds.length <= 9
    ? "grid-cols-3"
    : "grid-cols-4";

  return (
    <div className="flex flex-grow m-3 items-center justify-center">
      <div className={`grid ${gridCols} gap-2 w-full h-full justify-center`}>
        {participantIds.map((participantId) => (
          <div
            key={participantId}
            className="flex items-center justify-center p-1"
          >
            <MemoizedParticipant participantId={participantId} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const MemoizedParticipantGrid = React.memo(
  ParticipantGrid,
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.participantIds) ===
      JSON.stringify(nextProps.participantIds)
);
