"use client";
import { useEffect, useState, useRef } from "react";
import { sql } from "../modules/database";
import { GetUserData, toTitleCase } from "../modules/misc";
import { sendEmail } from "../modules/email";

export function CreateChat(rideID)
{
    return sql`INSERT INTO chats (rideid) VALUES (${rideID}) RETURNING *`;
}

export default function Chatbox({ rideID }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(undefined);
  const [subscribers, setSubscribers] = useState(undefined);
  const [chat, setChat] = useState(undefined);
  const [canSend, setCanSend] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  const [autoScroll, setAutoScroll] = useState(true);

  const chatContainerRef = useRef(null); // Ref for the chat container

  useEffect(() => {
    GetUserData(setUserData);

    let canGetChat = true;
    const interval = setInterval(() => {
      if (canGetChat && rideID) {
        canGetChat = false;
        sql`SELECT * FROM chats WHERE rideid=${rideID}`.then((res) => {
          setChat(res[0].messages ?? []);
          setSubscribers(res[0].subscribers ?? []);
          canGetChat = true;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [rideID]);

  useEffect(() => {
    if (firstLoad && chat && chatContainerRef.current) {
      // Scroll to the bottom
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setFirstLoad(false);

      chatContainerRef.current.addEventListener("scroll", () => {
        if (Math.abs((chatContainerRef.current.scrollHeight - chatContainerRef.current.offsetHeight) - chatContainerRef.current.scrollTop) <= 35)
            setAutoScroll(true);
        else
            setAutoScroll(false);
      })
    }

    if (chatContainerRef.current && autoScroll)
    {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
  }, [chat, firstLoad]);

  const handleSubscription = () => {
    if (subscribers.includes(userData.email)) {
      // Handle unsubscribing
      sql(
        `UPDATE chats
         SET subscribers = (
           SELECT jsonb_agg(element)
           FROM jsonb_array_elements(subscribers) AS element
           WHERE element != $1::jsonb
         )
         WHERE rideid = $2`,
        [JSON.stringify(userData.email), rideID]
      );
    } else {
      // Handle subscribing
      sql(
        `UPDATE chats 
         SET subscribers = COALESCE(subscribers, '[]'::jsonb) || $1::jsonb
         WHERE rideid = $2`,
        [JSON.stringify(userData.email), rideID]
      );
    }
  };
  

  if (userData == undefined) return <></>;

  return (
    <div>
      {/* Chatbox Toggle Button */}
      {(!isOpen || (window.innerWidth > 768 && isOpen)) && (
        <button
          className="fixed bottom-4 right-4 z-50 bg-gray-800 text-gray-200 p-2 rounded-full shadow-lg focus:outline-none hover:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            // Close Icon (X)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Message Icon (Chat bubble)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>      
      )}

      {/* Shield */}
      {
        window.innerWidth < 768 && isOpen && 
        <div className="fixed z-39 w-screen h-screen top-0 left-0"></div>
      }

      {/* Chatbox */}
      {isOpen && (
        <div
          className={`fixed z-40 bg-gray-900 text-gray-200 shadow-lg rounded-lg border border-gray-700 flex flex-col 
            ${window.innerWidth < 768 ? "top-0 left-0 w-full h-full" : "bottom-16 right-4 w-96 h-[80vh]"}`}
        >
          {/* Chatbox Header */}
          <div className="bg-gray-800 text-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Chat{userData["role"] === "Driver" ? "ting with Student" : "ting with Driver"}
            </h2>
            <div className="flex gap-4 items-center">
              {/* Subscribe Button */}
              <button
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-500 focus:outline-none transition-all"
                onClick={handleSubscription}
              >
                {subscribers.includes(userData.email) ? "Unsubscribe" : "Subscribe"}
              </button>
              {/* Close Button */}
              <button
                className="text-gray-400 hover:text-gray-200 focus:outline-none"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>
          </div>


          {/* Chat Messages */}
          <div
            className="flex-grow overflow-y-auto p-4 space-y-4"
            ref={chatContainerRef} // Attach ref here
          >
            <div className="flex flex-col space-y-2">
              {chat ? (
                Object.values(chat).map((message, index) => {
                    // Convert the ISO timestamp to local time
                    const timestamp = new Date(message.timestamp);
                  
                    // Get the hours and minutes, and determine AM/PM
                    let hours = timestamp.getHours();
                    const minutes = timestamp.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                  
                    // Convert to 12-hour format
                    hours = hours % 12;
                    hours = hours ? hours : 12; // 0 becomes 12 for 12 AM
                  
                    // Format the time as dd/MM/YY hh:mm AM/PM
                    const formattedTime = `${timestamp.getDate().toString().padStart(2, '0')}/${
                      (timestamp.getMonth() + 1).toString().padStart(2, '0')
                    }/${timestamp.getFullYear().toString().slice(-2)} ${hours.toString().padStart(2, '0')}:${minutes
                      .toString()
                      .padStart(2, '0')} ${ampm}`;
                  
                    return (
                      <div
                        key={index}
                        className={`${
                          message.userID == userData.id
                            ? "self-end bg-gray-800 text-gray-200"
                            : "self-start bg-gray-700 text-gray-300"
                        } max-w-[70%] min-w-[50%] p-2 rounded-lg`}
                      >
                        {/* Display Username */}
                        <p
                          className={`text-xs font-bold ${
                            message.userID == userData.id ? "text-right" : "text-left"
                          }`}
                        >
                          {message.username || "Unknown User"}
                        </p>

                        {/* Display Email */}
                        <p
                          className={`text-xs text-gray-400 ${
                            message.userID == userData.id ? "text-right" : "text-left"
                          }`}
                        >
                          {message.email || ""}
                        </p>
                  
                        {/* Display Message */}
                        <p
                          className={`text-sm min-w-24 ${
                            message.userID == userData.id ? "text-right" : "text-left"
                          }`}
                        >
                          {message.message}
                        </p>
                  
                        {/* Display Timestamp */}
                        <p
                          className={`text-xs text-gray-500 ${
                            message.userID == userData.id ? "text-left" : "text-right"
                          }`}
                        >
                          {formattedTime}
                        </p>
                      </div>
                    );
                  })                                                      
              ) : (
                <div className="self-center bg-gray-700 text-gray-200 max-w-[75%] p-2 rounded-lg">
                  <p className="text-sm text-center w-full">Loading Chat...</p>
                </div>
              )}
            </div>
          </div>

          {/* Chatbox Input */}
          <div className="p-4 bg-gray-800">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!canSend) return;

                const data = new FormData(e.target);
                const msg = data.get("msg").trim();

                if (msg.length === 0) return;

                setCanSend(false);
                sql(
                  `UPDATE chats 
                   SET messages = COALESCE(messages, '[]'::jsonb) || $1::jsonb 
                   WHERE rideid = $2`,
                  [JSON.stringify({ userID: userData.id, message: msg, username: userData.name, email: userData.email, timestamp: new Date().toISOString() }), rideID]
                ).then(() => {
                  e.target.reset();
                  setCanSend(true);

                  subscribers.forEach(subscriber => {
                    if (subscriber != userData.email)
                    {
                      sendEmail(
                        subscriber,
                        `Ride #${rideID}: ${userData.name} (${toTitleCase(userData.role)}) sent a message!`,
                        `
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
                          <h2 style="color: #2c3e50; margin-bottom: 10px;">Ride #${rideID} Chat</h2>
                          <p style="font-size: 16px; margin: 10px 0;">
                            <strong>${userData.name}</strong> (<span style="color: #27ae60;">${toTitleCase(userData.role)}</span>) sent you a message:
                          </p>
                          <div style="padding: 15px; background-color: #fff; border: 1px solid #ddd; border-radius: 5px; font-size: 15px; line-height: 1.6;">
                            ${msg}
                          </div>
                          <p style="font-size: 14px; margin-top: 20px; color: #555;">
                            Log in to view more details.
                          </p>
                          <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                            &copy; ${new Date().getFullYear()} Stuber. All rights reserved.
                          </footer>
                        </div>
                        `
                      );                      
                    }
                  });

                  // Scroll to the bottom after sending a message
                  if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop =
                      chatContainerRef.current.scrollHeight;
                  }
                });
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-grow p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-l-lg focus:outline-none focus:ring focus:ring-gray-500"
                name="msg"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gray-600 text-gray-200 hover:bg-green-700 rounded-r-lg"
              >
                {canSend ? "Send" : "Sending..."}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
