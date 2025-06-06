import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Apply";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ToastContainer
      toastClassName={() =>
        "relative flex py-4 px-3 rounded overflow-hidden cursor-pointer bg-[#050a0e] shadow-lg"
      }
      bodyClassName={() => "text-black text-base font-normal"}
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeButton={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="light"
    />
    <App/>
  </>
);
