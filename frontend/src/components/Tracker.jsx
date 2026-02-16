import { useEffect } from "react";
export function Tracker({ send }) {


  useEffect(() => {


    function handleMove(event) {
      //check if this is mobile or desktop 
      const source = 'touches' in event ? event.touches[0] : event
      const x = (source.clientX / window.innerWidth) * 100;
      const y = (source.clientY / window.innerHeight) * 100;
      send({ type: "cursor-move", x, y });

    }
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {

      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    }


  }, [send])
  return null;
}
