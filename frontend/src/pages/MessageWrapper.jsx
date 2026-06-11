import { useParams, useLocation } from "react-router-dom";
import Messages from "./Messages";

const MessagesWrapper = () => {
  const { conversationId } = useParams();
  const location = useLocation();

  return (
    <Messages
      conversationId={conversationId}
      chatUser={location.state}
    />
  );
};

export default MessagesWrapper;