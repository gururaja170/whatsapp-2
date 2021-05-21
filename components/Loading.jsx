import React from "react";
import { FadingCircle } from "better-react-spinkit";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src="https://cdn2.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-whatsapp-circle-512.png"
          alt=""
          style={{ marginBottom: "20px" }}
          height={200}
        />
        <FadingCircle color="green" size={40} />
      </div>
    </center>
  );
}

export default Loading;
