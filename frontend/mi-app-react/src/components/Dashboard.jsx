import { useState } from "react";
import {listFingerprints} from "../services/api";
import { Aside } from "./Aside";

const Dashboard = () => {
  const [statusMessage, setStatusMessage] = useState("");

  const handleList = async () => {
    try {
      const data = await listFingerprints();
      setStatusMessage(`${data.templates}`);
    } catch (error) {
      setStatusMessage(`${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex">
      <Aside name="Dashboard" />
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-semibold">List of enrrols</h2>

        <div className="mt-6">
          <button
            onClick={handleList}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            List
          </button>
          
          {statusMessage && <h4 className="py-3">Numero de huellas enroladas</h4>}
          <div className="mt-4 grid grid-cols-4 gap-4">
            {statusMessage && statusMessage.split(",").map((num, index) => (
              <div
                key={index}
                className="bg-blue-100 p-2 rounded text-center text-gray-700"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
