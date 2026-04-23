import { useParams } from "react-router-dom";
import Messages from "./Messages";

const MessagesWrapper = () => {
  const { conversationId } = useParams();
 console.log("coversationid",conversationId);
 
  return <Messages conversationId={conversationId} />;
  console.log("Conversation ID:", conversationId);
};

export default MessagesWrapper;