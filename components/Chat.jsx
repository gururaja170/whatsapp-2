import { Avatar } from "@material-ui/core";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import getReceiverEmail from "../utils/getReceiverEmail";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const receiverEmail = getReceiverEmail(users, user);
  const [receiverSnapshot] = useCollection(
    db.collection("users").where("email", "==", receiverEmail)
  );
  const receiver = receiverSnapshot?.docs?.[0]?.data();

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  return (
    <Container onClick={enterChat}>
      {receiver ? (
        <UserAvatar src={receiver?.photoURL} />
      ) : (
        <UserAvatar>{receiverEmail[0]}</UserAvatar>
      )}
      <p>{receiverEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  word-break: break-word;
  padding: 15px;

  :hover {
    background-color: #e9eaeb;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
