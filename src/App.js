import React, { useState, useEffect } from "react";
import TrafficLight1 from "./TrafficLight";
import TrafficLight2 from "./TrafficLight2";
import TrafficLight3 from "./TrafficLight3";
import TrafficLight4 from "./TrafficLight4";

import "./App.css";

export default function App() {
  const initialTrafficState = (time) => ({
    red: { backgroundColor: "red", duration: 4000, next: "green" },
    yellow: { backgroundColor: "yellow", duration: 1500, next: "red" },
    green: { backgroundColor: "green", duration: time, next: "yellow" },
  });

  const [trafficStates1, setTrafficStates1] = useState(initialTrafficState(2500));
  const [trafficStates2, setTrafficStates2] = useState(initialTrafficState(2500));
  const [trafficStates3, setTrafficStates3] = useState(initialTrafficState(2500));
  const [trafficStates4, setTrafficStates4] = useState(initialTrafficState(2500));

  const [lane1, setLane1] = useState(0);
  const [lane2, setLane2] = useState(0);
  const [lane3, setLane3] = useState(0);
  const [lane4, setLane4] = useState(0);

  const [remVehicles, setRemVehicles] = useState([0, 0, 0, 0]);

  const [trafficActive, setTrafficActive] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const lane1Vehicles = parseInt(formData.get("lane1"));
    const lane2Vehicles = parseInt(formData.get("lane2"));
    const lane3Vehicles = parseInt(formData.get("lane3"));
    const lane4Vehicles = parseInt(formData.get("lane4"));
    
    setLane1(lane1Vehicles);
    setLane2(lane2Vehicles);
    setLane3(lane3Vehicles);
    setLane4(lane4Vehicles);
    setRemVehicles([lane1Vehicles, lane2Vehicles, lane3Vehicles, lane4Vehicles]);
    setTrafficActive(true);
  };

  useEffect(() => {
    if (!trafficActive) return;

    const total_time = 60000;
    const total_vehicle = lane1 + lane2 + lane3 + lane4;
    const burst_time = {
      lane1: (lane1 * total_time) / total_vehicle,
      lane2: (lane2 * total_time) / total_vehicle,
      lane3: (lane3 * total_time) / total_vehicle,
      lane4: (lane4 * total_time) / total_vehicle,
    };

    let rem_time = [burst_time.lane1, burst_time.lane2, burst_time.lane3, burst_time.lane4];
    const time_quantum = 6000;

    const updateTrafficLights = (activeLanes, remTimes) => {
      const duration1 = activeLanes.includes(1) || activeLanes.includes(4) ? Math.min(time_quantum, remTimes[0], remTimes[3]) : 0;
      const duration2 = activeLanes.includes(2) || activeLanes.includes(3) ? Math.min(time_quantum, remTimes[1], remTimes[2]) : 0;

      setTrafficStates1((prev) => ({
        ...prev,
        green: { ...prev.green, duration: duration1 },
        red: { ...prev.red, duration: duration1 > 0 ? 0 : time_quantum },
      }));

      setTrafficStates2((prev) => ({
        ...prev,
        green: { ...prev.green, duration: duration2 },
        red: { ...prev.red, duration: duration2 > 0 ? 0 : time_quantum },
      }));

      setTrafficStates3((prev) => ({
        ...prev,
        green: { ...prev.green, duration: duration2 },
        red: { ...prev.red, duration: duration2 > 0 ? 0 : time_quantum },
      }));

      setTrafficStates4((prev) => ({
        ...prev,
        green: { ...prev.green, duration: duration1 },
        red: { ...prev.red, duration: duration1 > 0 ? 0 : time_quantum },
      }));
    };

    const manageTraffic = () => {
      const maxLane = rem_time.indexOf(Math.max(...rem_time));
      if (rem_time[maxLane] <= 0) {
        setTrafficActive(false);
        return;
      }

      // Ensure that a pair can only become green if the other pair is red
      if ((trafficStates1.red && trafficStates4.red) || (trafficStates2.red && trafficStates3.red)) {
        switch (maxLane) {
          case 0:
          case 3:
            updateTrafficLights([1, 4], rem_time);
            rem_time[0] -= Math.min(time_quantum, rem_time[0]);
            rem_time[3] -= Math.min(time_quantum, rem_time[3]);
            setRemVehicles((prev) => [
              Math.max(0, prev[0] - 1),
              prev[1],
              prev[2],
              Math.max(0, prev[3] - 1),
            ]);
            break;
          case 1:
          case 2:
            updateTrafficLights([2, 3], rem_time);
            rem_time[1] -= Math.min(time_quantum, rem_time[1]);
            rem_time[2] -= Math.min(time_quantum, rem_time[2]);
            setRemVehicles((prev) => [
              prev[0],
              Math.max(0, prev[1] - 1),
              Math.max(0, prev[2] - 1),
              prev[3],
            ]);
            break;
          default:
            break;
        }
      }
    };

    const intervalId = setInterval(manageTraffic, time_quantum);

    return () => clearInterval(intervalId);
  }, [lane1, lane2, lane3, lane4, trafficActive]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Density in Lane 1:
          <input type="number" name="lane1" min="0" required />
        </label>
        <label>
          Density in Lane 2:
          <input type="number" name="lane2" min="0" required />
        </label>
        <label>
          Density in Lane 3:
          <input type="number" name="lane3" min="0" required />
        </label>
        <label>
          Density in Lane 4:
          <input type="number" name="lane4" min="0" required />
        </label>
        <button type="submit">Submit</button>
      </form>

      {trafficActive && (
        <>
          <TrafficLight1 className="light1" trafficStates={trafficStates1} activeColor="red" />
          <TrafficLight2 className="light2" trafficStates={trafficStates2} activeColor="red" />
          <TrafficLight3 className="light3" trafficStates={trafficStates3} activeColor="red" />
          <TrafficLight4 className="light4" trafficStates={trafficStates4} activeColor="red" />

          {/* <div>
            <p>Remaining vehicles in Lane 1: {remVehicles[0]}</p>
            <p>Remaining vehicles in Lane 2: {remVehicles[1]}</p>
            <p>Remaining vehicles in Lane 3: {remVehicles[2]}</p>
            <p>Remaining vehicles in Lane 4: {remVehicles[3]}</p>
          </div> */}
        </>
      )}
    </div>
  );
}
