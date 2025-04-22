import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Notification.css";

const QuizToast = ({ closeToast, question, answers, correctAnswer, senderName }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswerSelect = (answer) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answer);
    setHasAnswered(true);

    setTimeout(() => {
      if (answer === answers[correctAnswer]) {
        toast.success(
          <span className="text-green-400 font-bold">
            ✅ Correct! The answer is {answers[correctAnswer]}
          </span>,
          { autoClose: 3000 }
        );
      } else {
        toast.error(
          <span className="text-red-400 font-bold">
            ❌ Wrong! The correct answer is {answers[correctAnswer]}
          </span>,
          { autoClose: 3000 }
        );
      }
      closeToast();
    }, 1000);
  };

  return (
    <div className="quiz-toast">
      <p className="toast-sender">Quiz from: {senderName}</p>
      <p className="toast-question"><strong>{question}</strong></p>
      <div className="toast-answers">
        {answers.map((option, index) => (
          <div
            key={index}
            className={`toast-answer ${
              selectedAnswer === option ? "selected" : ""
            } ${
              hasAnswered && index === correctAnswer ? "correct" : ""
            }`}
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

const Notification = ({ senderId, senderName, text, timestamp }) => {
  useEffect(() => {
    // Check if the received message is a quiz
    if (text && typeof text === 'object' && text.type === 'quiz') {
      console.log("Received quiz:", text);
      
      toast(
        <QuizToast 
          question={text.question}
          answers={text.answers}
          correctAnswer={text.correctAnswer}
          senderName={senderName}
        />,
        {
          position: "bottom-right",
          theme: "dark",
          autoClose: 5000,
          closeOnClick: false,
          hideProgressBar: false,
          draggable: false,
          closeButton: false,
        }
      );
    }
  }, [text, senderName, senderId, timestamp]);

  return null; 
};

export default Notification;