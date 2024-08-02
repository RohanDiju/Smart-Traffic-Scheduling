import { useEffect, useState } from "react";

export default function TrafficLight4({ trafficStates, activeColor }) {
  const [currentColor, setCurrentColor] = useState(activeColor);

  useEffect(() => {
    const { duration, next } = trafficStates[currentColor];

    const timerId = setTimeout(() => {
      setCurrentColor(next);
    }, duration);

    return () => {
      clearTimeout(timerId);
    };
  }, [currentColor, trafficStates]);

  return (
    <div className="traffic-light-container4">
      {Object.keys(trafficStates).map((color) => (
        <div
          key={color}
          className="traffic-light4"
          style={{
            backgroundColor:
              color === currentColor ? trafficStates[color].backgroundColor : "#555"
          }}
        />
      ))}
    </div>
  );
}
