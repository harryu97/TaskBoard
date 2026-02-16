import Cursor from "./Cursor.jsx"
import { useState, useEffect } from "react"

export function Cursors({ subscribe }) {
  const [cursors, setCursors] = useState({});
  useEffect(() => {

    function handleMessage(data) {
      if (data.type === "cursor-update") {
        setCursors((prev) => ({
          ...prev,
          [data.userId]: {
            userId: data.userId,
            fullName: data.fullName,
            x: data.x,
            y: data.y
          },
        }));
      } else if (data.type === "user-left") {
        setCursors((prev) => {
          const next = { ...prev };
          delete next[data.userId];
          return next;
        });
      }
    }
    return subscribe(handleMessage);

  }, [subscribe]);
  return (
    <>
      {Object.values(cursors).map((connection) => (
        <Cursor key={connection.userId} connection={connection} />
      ))}
    </>
  );
}
