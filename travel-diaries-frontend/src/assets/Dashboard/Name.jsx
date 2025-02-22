import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import axios from "axios";

const DiaryDashboard = () => {
  const [diaries, setDiaries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await axios.get("https://travel-diaries-t6c5.onrender.com/api/journals");
        setDiaries(response.data);
      } catch (error) {
        console.error("Error fetching diaries:", error);
      }
    };

    fetchDiaries();
  }, []);

  return (
    <div className="flex flex-wrap gap-6 p-6">
      <div
        className="w-40 h-60 flex flex-col items-center justify-center border rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
        onClick={() => navigate("/dashboard/create-diary")}
      >
        <FiPlus size={30} className="text-orange-500" />
        <span className="mt-2 text-sm font-medium">Start a new diary</span>
      </div>

      {diaries.map((diary) => (
        <div key={diary.journalId} className="w-40 h-60 bg-white border rounded-lg shadow-md p-2">
          <img src={diary.images?.[0] || "default-image.jpg"} alt={diary.journalTitle} className="w-full h-40 object-cover rounded" />
          <p className="text-center font-semibold mt-2">{diary.journalTitle}</p>
        </div>
      ))}
    </div>
  );
};

export default DiaryDashboard;