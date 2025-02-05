import React from 'react';
import metro from "../Images/metro.svg";
import emerce from "../Images/emerce.svg";
import volksrant from "../Images/volksrant.svg";  

const Section3 = () => {
  return (
    <div className="py-10 w-[1500px]">
      <div className="text-center mb-6">
        <h1 className="font-bold text-xl">As seen on</h1>
      </div>
      <div className="flex flex-nowrap justify-center gap-8 w-[1500px] overflow-x-auto">
        <img src={metro} alt="Metro" className="h-20" />
        <img src={emerce} alt="Emerce" className="h-20" />
        <img src={volksrant} alt="de Volkskrant" className="h-20" />
      </div>
    </div>
  );
};

export default Section3;
