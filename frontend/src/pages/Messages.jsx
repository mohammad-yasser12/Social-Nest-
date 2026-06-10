// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { getMessages, sendMessage } from "../api/messageApi";

// const Messages = ({ conversationId }) => {
//   const token = localStorage.getItem("token");
//   const user = useSelector((state) => state.auth.user);

//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   // ✅ Fetch messages
//   const fetchMessages = async () => {
//     try {
//       const res = await getMessages(conversationId, token);
//       setMessages(res.data.messages);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     if (conversationId) {
//       fetchMessages();
//     }
//   }, [conversationId]);

//   // ✅ Send message
//   const handleSend = async () => {
//     if (!text.trim()) return;

//     try {
//       const res = await sendMessage(conversationId, text, token);

//       setMessages((prev) => [...prev, res.data.message]);
//       setText("");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="flex flex-col h-[80vh] max-w-xl mx-auto border">

//       {/* 💬 Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((msg) => (
//           <div
//             key={msg._id}
//             className={`p-2 rounded max-w-xs ${
//               msg.sender === user._id
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-gray-300 text-black"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       {/* ✍️ Input */}
//       <div className="flex p-2 border-t">
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="flex-1 border p-2 rounded"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={handleSend}
//           className="ml-2 bg-blue-500 text-white px-4 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Messages;

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa";
import { getMessages, sendMessage,deleteForEveryone,deleteForMe } from "../api/messageApi";
import { motion, AnimatePresence } from "framer-motion";
const Messages = ({ conversationId }) => {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
console.log("typing:", text);
  const bottomRef = useRef(null);

const dropdownRef = useRef(null);

  // 🔹 Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await getMessages(conversationId, token);
      setMessages(res.data.messages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpenMenuId(null); // close dropdown
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  // 🔹 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await sendMessage(conversationId, text, token);

      setMessages((prev) => [...prev, res.data.message]);
      setText("");
    } catch (err) {
      console.log(err);
    }
  };
  const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // prevent new line
    handleSend();
  }
};

  const handleDeleteForMe = async (messageId) => {
  try {
    await deleteForMe(messageId, token);

    setMessages((prev) =>
      prev.filter((m) => m._id !== messageId)
    );
  } catch (err) {
    console.log(err);
  }
};

const handleDeleteForEveryone = async (messageId) => {
  try {
    const res = await deleteForEveryone(messageId, token);

    setMessages((prev) =>
      prev.map((m) =>
        m._id === messageId ? res.data.updated : m
      )
    );
  } catch (err) {
    console.log(err);
  }
};

  // 🔹 Enter key send
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!conversationId) {
    return <div className="text-center mt-10">No conversation selected</div>;
  }

  return (
    <div className="flex flex-col h-[80vh] max-w-xl mx-auto border rounded shadow">

      {/* 💬 Messages */}
     <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
  {messages
  .filter((msg) => !msg.deletedFor?.includes(user?._id))
  .map((msg) => {

    const isSender =
      String(msg.sender?._id || msg.sender) === String(user?._id);

    return (
      <motion.div
        key={msg._id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className={`p-2 rounded max-w-xs ${
          msg.sender?._id === user?._id
            ? "bg-blue-500 text-white ml-auto"
            : "bg-gray-300 text-black"
        }`}
      >
        <div className="flex justify-between items-center gap-2">

          {/* ✅ TEXT */}
          <div className="break-words">
            {msg.isDeleted ? (
              <span className="italic text-gray-400">
                This message was deleted
              </span>
            ) : (
              msg.text
            )}
          </div>

          {/* ✅ DROPDOWN ICON */}
          {!msg.isDeleted && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() =>
                  setOpenMenuId(openMenuId === msg._id ? null : msg._id)
                }
              >
                <FaChevronDown />
              </button>

              {openMenuId === msg._id && (
                <div className="absolute right-0 mt-1 bg-white text-black shadow rounded text-sm z-50">

                  {/* Delete for me */}
                  <div
                    onClick={() => {
                      handleDeleteForMe(msg._id);
                      setOpenMenuId(null);
                    }}
                    className="px-4 py-2 hover:bg-red-100 cursor-pointer whitespace-nowrap border-b border-gray-300"
                  >
                    Delete for me
                  </div>

                  {/* Delete for everyone (ONLY sender) */}
                  {isSender && (
                    <div
                      onClick={() => {
                        handleDeleteForEveryone(msg._id);
                        setOpenMenuId(null);
                      }}
                      className="px-4 py-2 hover:bg-red-100 cursor-pointer whitespace-nowrap"
                    >
                      Delete for everyone
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    );
  })}
  <div ref={bottomRef}></div>
</div>

      {/* ✍️ Input Box */}
     <div className="flex p-3 border-t bg-white relative z-20">
  <input
    type="text"
    value={text}
    onChange={(e) => setText(e.target.value)}
     onKeyDown={handleKeyDown}
    placeholder="Type a message..."
    className="flex-1 border p-2 rounded outline-none"
  />

  <button
    onClick={handleSend}
    className="ml-2 bg-blue-500 text-white px-4 rounded"
  >
    Send
  </button>
</div>
    </div>
  );
};

export default Messages;