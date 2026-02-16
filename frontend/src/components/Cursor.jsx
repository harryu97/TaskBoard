import ColorHash from "color-hash";
import { forwardRef } from "react"

const hash = new ColorHash({ lightness: 0.3 })
function Arrow({ color }) {


  return (<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M0 0L16 6L8 8L6 16L0 0Z" fill={color} />
  </svg>);
}
export function Cursor({ connection }) {
  const color = hash.hex(connection.userId);
  return (
    <div
      className="fixed pointer-events-none flex gap-1 text-xs"
      style={{
        left: `${connection.x}vw`,
        top: `${connection.y}vh`,
      }}
    >
      <Arrow color={color} />
      <span
        className="relative -left-1.5 top-4 rounded-sm px-1.5 py-0.5 text-white whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {connection.fullName}
      </span>
    </div>
  );
}
export default Cursor
