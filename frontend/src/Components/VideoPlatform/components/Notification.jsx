import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Notification.css";
import { usePubSub } from "@videosdk.live/react-sdk";

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

const Notification = () => {
  const { messages: quizMessages } = usePubSub("QUIZ");

  useEffect(() => {
    if (quizMessages && quizMessages.length > 0) {
      const latestQuiz = quizMessages[quizMessages.length - 1];
      if (latestQuiz && typeof latestQuiz.message === 'object' && latestQuiz.message.type === 'quiz') {
        const { question, answers, correctAnswer } = latestQuiz.message;
        const { senderName } = latestQuiz;
        
        toast(
          <QuizToast 
            question={question}
            answers={answers}
            correctAnswer={correctAnswer}
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
    }
  }, [quizMessages]);

  return null; 
};

export default Notification;