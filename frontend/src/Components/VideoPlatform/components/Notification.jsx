import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Notification.css";
import { usePubSub } from "@videosdk.live/react-sdk";
import axios from 'axios';

const QuizToast = ({ closeToast, question, answers, correctAnswer, senderName }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const updateProgress = async (isCorrect) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('User data from localStorage:', userData);
      
      if (!userData) {
        console.error('User data not found in localStorage');
        return;
      }

      const requestData = {
        userId: userData._id,
        userName: userData.username || 'Unknown User',
        isCorrect,
        hasAnswered: true
      };
      
      console.log('Sending request data:', requestData);
      
      // First check if user exists
      try {
        const checkResponse = await axios.get(`http://localhost:5000/ProgressRouter/user/${userData._id}`);
        console.log('Check user response:', checkResponse.data);
        const userExists = checkResponse.data && checkResponse.data.userId === userData._id;
        
        // Use PUT if user exists, POST if new user
        if (userExists) {
          console.log('User exists, using PUT');
          const putResponse = await axios.put('http://localhost:5000/ProgressRouter/quiz', {
            userId: userData._id,
            isCorrect,
            hasAnswered: true
          });
          console.log('PUT response:', putResponse.data);
        } else {
          console.log('User does not exist, using POST');
          const postResponse = await axios.post('http://localhost:5000/ProgressRouter/quiz', requestData);
          console.log('POST response:', postResponse.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // User not found, create new entry
          console.log('User not found, creating new entry');
          const postResponse = await axios.post('http://localhost:5000/ProgressRouter/quiz', requestData);
          console.log('POST response:', postResponse.data);
        } else {
          console.error('Error checking/updating user:', error);
        }
      }
    } catch (error) {
      console.error('Error in updateProgress:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleAnswerSelect = (answer) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answer);
    setHasAnswered(true);

    setTimeout(() => {
      const isCorrect = answer === answers[correctAnswer];
      
      // Update progress based on answer
      updateProgress(isCorrect);

      if (isCorrect) {
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

  // Set timeout for unanswered questions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!hasAnswered) {
        try {
          const userData = JSON.parse(localStorage.getItem('user'));
          console.log('User data for unanswered question:', userData);
          
          if (userData) {
            const requestData = {
              userId: userData._id,
              userName: userData.username || 'Unknown User',
              isCorrect: false,
              hasAnswered: false
            };
            
            console.log('Sending unanswered request data:', requestData);
            
            try {
              const checkResponse = await axios.get(`http://localhost:5000/ProgressRouter/user/${userData._id}`);
              console.log('Check user response for unanswered:', checkResponse.data);
              const userExists = checkResponse.data && checkResponse.data.userId === userData._id;
              
              if (userExists) {
                console.log('User exists for unanswered, using PUT');
                const putResponse = await axios.put('http://localhost:5000/ProgressRouter/quiz', {
                  userId: userData._id,
                  isCorrect: false,
                  hasAnswered: false
                });
                console.log('PUT response for unanswered:', putResponse.data);
              } else {
                console.log('User does not exist for unanswered, using POST');
                const postResponse = await axios.post('http://localhost:5000/ProgressRouter/quiz', requestData);
                console.log('POST response for unanswered:', postResponse.data);
              }
            } catch (error) {
              if (error.response && error.response.status === 404) {
                console.log('User not found for unanswered, creating new entry');
                const postResponse = await axios.post('http://localhost:5000/ProgressRouter/quiz', requestData);
                console.log('POST response for unanswered:', postResponse.data);
              } else {
                console.error('Error checking/updating user for unanswered:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error in unanswered question handler:', error);
          if (error.response) {
            console.error('Error response:', error.response.data);
          }
        }
        closeToast();
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [hasAnswered, closeToast]);

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

const Notification = ({isCreater}) => {
  const { messages: quizMessages } = usePubSub("QUIZ");

  useEffect(() => {
    console.log("is creator is",isCreater)
    // Convert string to boolean if needed
    const isCreator = isCreater === false || isCreater === "false";
    if (isCreator && quizMessages && quizMessages.length > 0) {
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