import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useState } from "react";
import { formatAMPM, json_verify, nameTructed } from "../../utils/helper";
import Notification from "../Notification";

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


const QuizMessages = ({ senderId, senderName, message, timestamp }) => {
  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;


  
  return (
    <>
    <Notification 
        senderId={senderId}
        senderName={senderName}
        text={message}
        timestamp={timestamp}
      />
    </>
  );
};


const ChatInput = ({ inputHeight }) => {
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const { publish: publishChat } = usePubSub("CHAT");
  const { publish: publishQuiz } = usePubSub("QUIZ");
  
  const input = useRef();

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const sendMessage = () => {
    if (isQuizMode) {
      if (question.trim().length > 0 && answers.every(a => a.trim().length > 0)) {
        const quiz = {
          question: question.trim(),
          answers: answers.map(a => a.trim()),
          correctAnswer,
          type: "quiz"
        };
        publishQuiz(quiz, { persist: true });
        
        // Reset form
        setQuestion("");
        setAnswers(["", "", "", ""]);
        setCorrectAnswer(0);
        setIsQuizMode(false);
      }
    } else {
      const messageText = message.trim();
      if (messageText.length > 0) {
        publishChat(messageText, { persist: true });
        setMessage("");
      }
    }
    input.current?.focus();
  };

  return (
    <div
      className="w-full flex flex-col px-2"
      style={{ height: inputHeight }}
    >
      {isQuizMode ? (
        <div className="mb-2">
          <input
            type="text"
            className="w-full p-2 mb-2 text-white border-gray-400 border bg-gray-750 rounded"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center mb-1">
              <input
                type="radio"
                checked={correctAnswer === index}
                onChange={() => setCorrectAnswer(index)}
                className="mr-2"
              />
              <input
                type="text"
                className="w-full p-2 text-white border-gray-400 border bg-gray-750 rounded"
                placeholder={`Answer ${index + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}
          <div className="flex justify-between mt-2">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm"
              onClick={() => setIsQuizMode(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
              onClick={sendMessage}
              disabled={!question.trim() || answers.some(a => !a.trim())}
            >
              Send Question
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full mb-2">
          <input
            type="text"
            className="py-4 text-base text-white border-gray-400 border bg-gray-750 rounded pr-10 pl-2 focus:outline-none w-full"
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
          <span className="absolute inset-y-0 right-0 flex mr-2 rotate-90">
            <button
              disabled={message.length < 2}
              type="submit"
              className="p-1 focus:outline-none focus:shadow-outline"
              onClick={sendMessage}
            >
              <PaperAirplaneIcon
                className={`w-6 h-6 ${
                  message.length < 2 ? "text-gray-500" : "text-white"
                }`}
              />
            </button>
          </span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm w-full mt-2"
            onClick={() => setIsQuizMode(true)}
          >
            Create Quiz Question
          </button>
        </div>
      )}
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

  return allMessages.length > 0 ? (
    <div ref={listRef} style={{ overflowY: "scroll", height: listHeight }}>
      <div className="p-4">
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
  ) : (
    <p>No messages</p>
  );
};


export const QuizMessage = ({ listHeight }) => {
  const listRef = useRef();
  const { messages: quizMessages } = usePubSub("QUIZ");

  const scrollToBottom = (data) => {
    if (!data) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    } else {
      const { text } = data;

      if (json_verify(text)) {
        const { type } = JSON.parse(text);
        if ( type === "QUIZ") {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
          }
        }
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [quizMessages]);

  const allMessages = [ ...(quizMessages || [])].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  return allMessages.length > 0 ? (
    <div ref={listRef} style={{ overflowY: "scroll", height: listHeight }}>
      <div className="p-4">
        {allMessages.map((msg, i) => {
          const { senderId, senderName, message, timestamp } = msg;
          return (
            <QuizMessages
              key={`chat_item_${i}`}
              {...{ senderId, senderName, message, timestamp }}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <p>No messages</p>
  );
};

export function ChatPanel({ panelHeight }) {
  const inputHeight = 600;
  const listHeight = panelHeight - inputHeight;

  return (
    <div>
      <ChatMessages listHeight={listHeight} />
      <ChatInput inputHeight={inputHeight} />
    </div>
  );
}