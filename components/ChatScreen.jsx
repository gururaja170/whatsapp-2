import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import firebase from "firebase";
import Message from "./Message";
import getReceiverEmail from "../utils/getReceiverEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const endOfMessageRef = useRef();
  const [input, setInput] = useState("");
  const router = useRouter();
  const [messageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [receiverSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getReceiverEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const ScrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    ScrollToBottom();
  };
  const receiverEmail = getReceiverEmail(chat.users, user);
  const receiver = receiverSnapshot?.docs?.[0]?.data();
  return (
    <Container>
      <Header>
        {receiver ? (
          <Avatar src={receiver.photoURL} />
        ) : (
          <Avatar>{receiverEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{receiverEmail}</h3>
          {receiverSnapshot ? (
            <p>
              Last active:{" "}
              {receiver?.lastSeen?.toDate() ? (
                <TimeAgo datetime={receiver?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last Active....</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessagesContainer>
        {/* messages list */}
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessagesContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden onClick={sendMessage} disabled={!input} type="submit">
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  background-color: white;
  top: 0;
  z-index: 100;
  padding: 11px;
  display: flex;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: -10px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const HeaderIcons = styled.div``;
const MessagesContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px;
  bottom: 0;
  position: sticky;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  outline-width: 0;
  background-color: whitesmoke;
  padding: 20px;
  border: none;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 15px;
`;
