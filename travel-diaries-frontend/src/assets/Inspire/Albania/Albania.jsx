import React, { useState } from "react";
import Navbar from "../../LandingPage/Parts/Navbar";
import Footer from "../../LandingPage/Parts/Footer";

const TravelPage = () => {
  // State to track the current chapter
  const [currentChapter, setCurrentChapter] = useState(1);

  // Simulated chapter data (you can move this to separate files later)
  const chapters = {
    1: {
      title: "Verzamelen op Schiphol",
      date: "APRIL 15, 2024",
      location: "SCHIPHOL AIRPORT",
      content: [
        "Maandag 15 april is het zover en gaan we samen een prachtige persreis maken naar Tirana, Albanië. Om 15.00 uur verzamelen we op Schiphol bij de Seafood & Winebar Bubbels.",
        "Vanaf dit voorjaar vliegt Transavia op Tirana in Albanië. Een nieuwe bestemming in het netwerk die ontzettend veel te bieden heeft...",
        "We zijn met een mooi gezelschap van reismedia en reisorganisaties. Al kletsend met elkaar komen we erachter dat geen van ons al eerder in Albanië is geweest...",
        "Marcel de Nooijer, CEO van Transavia en onze gastheer op deze reis, brengt een toast uit. We proosten met de zojuist ingeschonken champagne en vertrekken naar onze gate. Op naar Albanië!"
      ],
      images: [
        "https://res-console.cloudinary.com/dsddldquo/thumbnails/v1/image/upload/v1740114957/ZTFjZ2N1eGVuZ3hibmd0djVsbG8=/drilldown",
        "https://cdn.traveldiariesapp.com/diaries/6154188d-ff65-4cba-bd38-811feed65e90/32cf8ee9-9a48-4b9a-833d-2ea6cd740be7.jpg",
        "https://cdn.traveldiariesapp.com/diaries/6154188d-ff65-4cba-bd38-811feed65e90/16f940ac-1f56-447d-b872-94bbd7bb4247.jpg"
      ]
    },
    2: {
      title: "Feestelijke ontvangst",
      date: "APRIL 15, 2024",
      location: "TIRANA, ALBANIA",
      content: [
        "Na een soepele vlucht landen we in Tirana, de bruisende hoofdstad van Albanië. We worden warm verwelkomd door lokale gidsen.",
        "Een korte rit brengt ons naar een prachtig plein waar een welkomstdiner op ons wacht. De sfeer is feestelijk en de lokale gerechten zijn overheerlijk.",
        "We maken kennis met de Albanese cultuur door muziek en dans, terwijl de zon ondergaat achter de bergen."
      ],
      images: [
        "https://res-console.cloudinary.com/dsddldquo/thumbnails/v1/image/upload/v1740115583/cGdrYWJwZ3pxOW5vNW44d3Iyam8=/drilldown",
        "https://cdn.traveldiariesapp.com/diaries/sample/tirana-welcome.jpg",
        "https://cdn.traveldiariesapp.com/diaries/sample/albanian-culture.jpg"
      ]
    }
    // Add more chapters as needed
  };

  // Function to handle "Next Chapter" click
  const handleNextChapter = () => {
    if (currentChapter < Object.keys(chapters).length) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  // Current chapter data
  const chapterData = chapters[currentChapter];

  return (
    <div className="w-full">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-screen w-full bg-cover bg-center flex items-center text-white px-6 md:px-16"
        style={{ backgroundImage: `url('${chapters[1].images[0]}')` }} // Static for now, can be dynamic if needed
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Dark overlay */}

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold">Persreis naar Albanië</h1>
          <p className="mt-4 text-lg md:text-xl">
            Maandag 15 april is het zover en gaan we samen een prachtige persreis maken naar Tirana, Albanië.
            Om 15.00 uur verzamelen we op Schiphol bij de Seafood & Winebar Bubbels...
          </p>

          {/* Info Section */}
          <div className="mt-6 flex items-center space-x-6">
            {/* Profile Section */}
            <div className="flex items-center bg-yellow-600 text-black rounded-full px-4 py-2 space-x-3">
              <span className="bg-[#FAA41F] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
                D
              </span>
              <div>
                <p className="font-semibold">Dev Patel</p>
                <p className="text-sm">7 chapters</p>
              </div>
            </div>

            {/* Date & Location */}
            <div className="flex items-center space-x-3">
              <p className="text-sm md:text-base">16 May 2024</p>
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">Albania</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-6 md:px-16 py-16 flex flex-col md:flex-row gap-8">
        {/* Article Content */}
        <div className="w-full md:w-2/3">
          <h2 className="text-4xl font-bold">{chapterData.title}</h2>
          <p className="text-gray-500 text-sm mt-2">{chapterData.date} | {chapterData.location}</p>

          {chapterData.content.map((paragraph, index) => (
            <p key={index} className="mt-4 text-lg">
              {paragraph}
            </p>
          ))}

          {/* Image Section */}
          <div className="mt-8 flex flex-col space-y-6">
            {chapterData.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`${chapterData.title} - Image ${index + 1}`}
                className="rounded-lg shadow-lg w-full"
              />
            ))}
          </div>

          {/* "Next Chapter" Button Below Last Image */}
          {currentChapter < Object.keys(chapters).length && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNextChapter}
                className="bg-[#FAA41F] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#FDC700] transition"
              >
                Next Chapter →
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar (Sticky) */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="sticky top-20">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-xl font-bold mb-4">Reisroute</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li className="font-semibold">Verzamelen op Schiphol</li>
                <li>Feestelijke ontvangst</li>
                <li>Bezoek aan de residentie</li>
                <li>De hoofdstad van Albanië: Tirana</li>
                <li>Beautiful Berat</li>
                <li>De kleurrijke stad Vlorë</li>
                <li>Durres</li>
              </ol>
            </div>

            <div className="bg-[#FAA41F] text-black p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Share your travel adventures like this!</h3>
              <ul className="space-y-2 text-sm">
                <li>✔ Create your own travel blog in one step</li>
                <li>✔ Share with friends and family to follow your journey</li>
                <li>✔ Easy set up, no technical knowledge needed and unlimited storage!</li>
              </ul>
              <button className="mt-4 bg-white text-black font-bold px-4 py-2 rounded-lg shadow">
                Try it now!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TravelPage;