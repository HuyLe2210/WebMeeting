// meeting/MeetingRoom.js
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Hàm lấy tham số từ URL
const getQueryParam = (search, key) => {
  const params = new URLSearchParams(search);
  return params.get(key);
};

const MeetingRoom = () => {
  const location = useLocation();
  const roomID = getQueryParam(location.search, "roomID") || (Math.floor(Math.random() * 10000).toString());
  const userID = getQueryParam(location.search, "userID") || (Math.floor(Math.random() * 10000).toString());
  const userName = getQueryParam(location.search, "userName") || "Guest";
  let joined = false;

  useEffect(() => {
    const loadZegoAndJoin = () => {
      if (joined) return; // 🔒 Ngăn gọi lại
      joined = true;
      const appID = 253308787;
      const serverSecret = "490296479352f42ea789f339bbc7c2d5";

      // ✅ Tạo kitToken trực tiếp không cần backend
      const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName
      );

      const zp = window.ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: document.querySelector("#zego-container"),
        sharedLinks: [
          {
            name: "Link phòng họp",
            url: `${window.location.origin}/meeting/room?roomID=${roomID}&userID=${userID}&userName=${encodeURIComponent(userName)}`
          }
        ],
        scenario: {
          mode: window.ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        layout: "Auto",
        showLayoutButton: false,
      });
    };

    if (!window.ZegoUIKitPrebuilt) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js";
      script.async = true;
      script.onload = loadZegoAndJoin;
      script.onerror = () => console.error("❌ Không tải được SDK Zego");
      document.body.appendChild(script);
    } else {
      loadZegoAndJoin();
    }
  }, [roomID, userID, userName]);

  return <div id="zego-container" style={{ width: "100%", height: "100vh" }} />;
};

export default MeetingRoom;
