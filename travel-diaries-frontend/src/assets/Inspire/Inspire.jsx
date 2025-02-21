import { Select, MenuItem } from "@mui/material";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const diaries = [
  {
    title: "Persreis naar Albanië",
    date: "15 t/m 17 april 2024",
    location: "Albania",
    chapters: 7,
    image: "https://images.pexels.com/photos/7084090/pexels-photo-7084090.jpeg?auto=compress&cs=tinysrgb&w=600",
    path: "/inspire/albania",
  },
  {
    title: "Gma's & Gpa's Great Adventures",
    date: "2024",
    location: "New Zealand",
    chapters: 43,
    image: "https://source.unsplash.com/600x400/?newzealand,adventure",
    path: "/inspire/newzealand",
  },
  {
    title: "Sabbatical Journey",
    date: "April 12, 2023 - June 10, 2023",
    location: "Egypt",
    chapters: 33,
    image: "https://source.unsplash.com/600x400/?egypt,desert",
    path: "/inspire/egypt",
  },
  {
    title: "Great Adventure",
    location: "Italy",
    chapters: 13,
    image: "https://source.unsplash.com/600x400/?italy,mountains",
    path: "/inspire/italy",
  },
  {
    title: "EUROPE 2017",
    location: "Portugal",
    chapters: 11,
    image: "https://source.unsplash.com/600x400/?portugal,landscape",
    path: "/inspire/portugal",
  },
  {
    title: "Erin & Matt in the UK",
    location: "United Kingdom",
    chapters: 15,
    image: "https://source.unsplash.com/600x400/?uk,travel",
    path: "/inspire/uk",
  },
];

const TravelPage = () => {
  const navigate = useNavigate();

  const handleDiaryClick = (path) => {
    navigate(path);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center bg-[#FAA41F] text-black min-h-screen">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 p-10 lg:p-20">
          <h1 className="text-7xl font-bold mb-6">Travelers community</h1>
          <p className="text-lg mb-6">
            Join a vibrant community of travelers sharing their adventures! Seek
            inspiration and connect with fellow explorers. Whether you're a
            seasoned traveler, a weekend adventurer, or planning your next trip,
            our community is here to inspire you!
          </p>
          <div className="relative">
            <Select
              displayEmpty
              className="w-full lg:w-80 border border-black rounded-full bg-white px-4 py-2"
              defaultValue=""
            >
              <MenuItem value="">Search by country</MenuItem>
              <MenuItem value="USA">India</MenuItem>
              <MenuItem value="Canada">Canada</MenuItem>
              <MenuItem value="France">France</MenuItem>
            </Select>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1625690987114-86f5af994b49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2xkJTIwY291cGxlfGVufDB8fDB8fHww"
            alt="Travelers"
            className="w-200 h-185 object-cover"
          />
        </div>
      </section>

      {/* Latest Diaries Section */}
      <section className="p-10">
        <h2 className="text-4xl font-bold text-center mb-10">
          Check out the latest diaries
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diaries.map((diary, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => handleDiaryClick(diary.path)}
            >
              {/* Background Image */}
              <img
                src={diary.image}
                alt={diary.title}
                className="w-full h-56 object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 p-4 flex flex-col justify-end text-white">
                <h3 className="text-lg font-semibold">{diary.title}</h3>

                <div className="flex items-center gap-2 mt-2 text-sm">
                  {diary.date && (
                    <span className="flex items-center gap-1">
                      <FaRegCalendarAlt />
                      {diary.date}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MdLocationOn />
                    {diary.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <IoBookOutline />
                    {diary.chapters} chapters
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TravelPage;
