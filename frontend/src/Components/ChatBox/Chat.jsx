import React, { useState, useEffect } from "react";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(`messages_${room}`);
      if (savedMessages) {
        setMessageList(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
    }
  }, [room]);

  const sendMessage = async () => {
    if (!username || username.trim() === "") {
      alert("Invalid username. Please rejoin the chat.");
      return;
    }

    if (currentMessage.trim() === "") return;

    const messageData = {
      room,
      author: username.trim(),
      message: currentMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    await socket?.emit("send_message", messageData);

    setMessageList((prevMessages) => {
      const updatedMessages = [...prevMessages, messageData];
      localStorage.setItem(`messages_${room}`, JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    setCurrentMessage("");
  };

  useEffect(() => {
    if (!socket) return;

    const messageListener = (data) => {
      if (!data.author || data.author.trim() === "") return; // Validate author before adding

      setMessageList((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        localStorage.setItem(`messages_${room}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    };

    socket.on("receive_message", messageListener);

    return () => {
      socket.off("receive_message", messageListener);
    };
  }, [socket, room]);

  const leaveChat = () => {
    ["username", "room", "showChat", `messages_${room}`].forEach((key) =>
      localStorage.removeItem(key)
    );
    window.location.reload();
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
        <button onClick={leaveChat}>Leave Chat</button>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent, index) => (
          messageContent.author && ( 
            <div
              key={index}
              className="message"
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p>{messageContent.author}</p>
                  <p>{messageContent.time}</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
