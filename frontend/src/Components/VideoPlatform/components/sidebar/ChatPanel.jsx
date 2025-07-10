import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useState } from "react";
import { formatAMPM, json_verify, nameTructed } from "../../utils/helper";
import Notification from "../Notification";
import axios from "axios";



const ChatMessage = ({ senderId, senderName, message, timestamp }) => {
  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const localSender = localParticipantId === senderId;

 
  // Check if message is a quiz object
  const isQuiz = typeof message === 'object' && message.hasOwnProperty('question');
  
  return (
    <>
    
    <div
      className={`flex ${localSender ? "justify-end" : "justify-start"} mt-4`}
      style={{
        maxWidth: "100%",
      }}
    >
      <div
        className={`flex ${
          localSender ? "items-end" : "items-start"
        } flex-col py-1 px-2 rounded-md bg-gray-700`}
      >
        <p style={{ color: "#ffffff80" }}>
          {localSender ? "You" : nameTructed(senderName, 15)}
        </p>
        <div>
          {isQuiz ? (
            <div className="text-white">
              <p className="font-bold mb-2">{message.question}</p>
              <ul className="list-disc pl-5">
                {message.answers.map((answer, index) => (
                  <li 
                    key={index} 
                    className={index === message.correctAnswer ? "text-green-400" : ""}
                  >
                    {answer}
                    {index === message.correctAnswer && "(Correct)"}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="inline-block whitespace-pre-wrap break-words text-right text-white">
              {message}
            </p>
          )}
        </div>
        <div className="mt-1">
          <p className="text-xs italic" style={{ color: "#ffffff80" }}>
            {formatAMPM(new Date(timestamp))}
          </p>
        </div>
      </div>
    </div>
    </>
  );
};



const ChatInput = ({ classId,isCreater }) => {
  console.log("ChatInput received classId:", classId);
  console.log("ChatInput received creater:", typeof isCreater);
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const { publish: publishChat } = usePubSub("CHAT");
  const { publish: publishQuiz } = usePubSub("QUIZ");
  
  const input = useRef();

  // console.log("Iscreater in chat pannel",isCreater);
  // console.log("Iscreater in chat pannel type",typeof isCreater);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const fetchRandomMCQ = async () => {
    if (!classId) {
      console.error("No classId provided");
      return;
    }

    try {
      console.log("Fetching MCQs for classId:", classId);
      const response = await axios.get(`http://localhost:5000/Classes/${classId}`);
      console.log("Full API Response:", response);
      
      if (!response.data) {
        console.error("No data received from API");
        return;
      }
      
      const classData = response.data;
      console.log("Class data structure:", {
        hasMcqs: !!classData.mcqs,
        mcqsLength: classData.mcqs?.length,
        classData: classData
      });
      
      if (classData.mcqs && classData.mcqs.length > 0) {
        // Get a random MCQ from the class
        const randomIndex = Math.floor(Math.random() * classData.mcqs.length);
        const randomMCQ = classData.mcqs[randomIndex];
        console.log("Selected random MCQ:", randomMCQ);
        
        // Create and publish the quiz directly
        const quizMessages = {
          question: randomMCQ.question,
          answers: randomMCQ.options,
          correctAnswer: randomMCQ.correctAnswer,
          type: "quiz"
        };
        publishQuiz(quizMessages, { persist: true });
      } else {
        console.log("No MCQs found in class data. Full class data:", classData);
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        fullError: error
      });
    }
  };

  const sendMessage = () => {
    const messageText = message.trim();
    if (messageText.length > 0) {
      publishChat(messageText, { persist: true });
      setMessage("");
    }
    input.current?.focus();
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="relative">
          <input
            type="text"
            className="py-4 text-base text-white border-gray-400 border bg-gray-750 rounded pr-12 pl-2 focus:outline-none w-full"
            placeholder="Write your message"
            autoComplete="off"
            ref={input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            disabled={message.length < 2}
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 focus:outline-none focus:shadow-outline"
            onClick={sendMessage}
          >
            <PaperAirplaneIcon
              className={`w-6 h-6 ${
                message.length < 2 ? "text-gray-500" : "text-white"
              }`}
            />
          </button>
        </div>
        {isCreater === "true" && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm w-full mt-2"
              onClick={fetchRandomMCQ}
            >
              Create Quiz Question
            </button>
        )}
      </div>
    </div>
  );
};

export const ChatMessages = ({ listHeight }) => {
  const listRef = useRef();
  const { messages: chatMessages } = usePubSub("CHAT");

  const scrollToBottom = (data) => {
    if (!data) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    } else {
      const { text } = data;

      if (json_verify(text)) {
        const { type } = JSON.parse(text);
        if (type === "CHAT" ) {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
          }
        }
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const allMessages = [...(chatMessages || [])].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  return  (
    <div ref={listRef} style={{ overflowY: "scroll", height: listHeight }}>
      <div className="p-4 h-[550px] w-[300px]">
        {allMessages.map((msg, i) => {
          const { senderId, senderName, message, timestamp } = msg;
          return (
            <ChatMessage
              key={`chat_item_${i}`}
              {...{ senderId, senderName, message, timestamp }}
            />
          );
        })}
      </div>
    </div>
  )
};


export const QuizMessage = ({ listHeight,isCreater }) => {
  const listRef = useRef();
  const { messages: quizMessages } = usePubSub("QUIZ");

  console.log("Quiz messages are: ",quizMessages);

  return  (
    <>
    <Notification 
        isCreater={isCreater}
        senderId={quizMessages.senderId}
        senderName={quizMessages.senderName}
        text={quizMessages.message}
        timestamp={quizMessages.timestamp}
      />
    </>
  ) 
};

export function ChatPanel({ panelHeight, classId ,isCreater}) {
  console.log("ChatPanel received classId:", classId);
  
  const inputHeight = 600;
  const listHeight = panelHeight - inputHeight;



  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages listHeight={listHeight} />
      </div>
      <div className="sticky bottom-0 bg-gray-800 p-2">
        <ChatInput classId={classId} isCreater={isCreater}/>
      </div>
    </div>
  );
}