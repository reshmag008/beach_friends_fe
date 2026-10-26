import React from "react";
import banner from '../assets/banner.jpeg'
import { Link, useNavigate } from 'react-router-dom';
import { Users, UserPlus, UserRound, Phone } from "lucide-react";

const HomePage = () => {
   const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
        <img
          src={banner}   // replace with your image path or URL
          alt="Poster"
          className="w-full h-auto object-cover"
        />


<div className="space-y-4 p-4">

  {/* Players & Register Buttons */}
  <div className="grid grid-cols-2 gap-3">

    <button
      type="button"
      onClick={() => navigate("/players")}
      className="
        flex items-center justify-center gap-2
        rounded-xl border border-blue-400/40
        bg-gradient-to-r from-blue-700 to-blue-500
        px-4 py-4
        text-sm font-black uppercase tracking-wider text-white
        shadow-lg shadow-blue-900/20
        transition-all duration-200
        hover:-translate-y-0.5 hover:from-blue-800 hover:to-blue-600
        active:scale-95
      "
    >
      <Users className="h-5 w-5" />
      Players
    </button>

    <button
      type="button"
      onClick={() => navigate("/register")}
      className="
        flex items-center justify-center gap-2
        rounded-xl border border-yellow-300/50
        bg-gradient-to-r from-yellow-500 to-amber-400
        px-4 py-4
        text-sm font-black uppercase tracking-wider text-blue-950
        shadow-lg shadow-yellow-900/10
        transition-all duration-200
        hover:-translate-y-0.5 hover:from-yellow-400 hover:to-amber-300
        active:scale-95
      "
    >
      <UserPlus className="h-5 w-5" />
      Register
    </button>

  </div>

  
{/* Compact Contact Information */}
{/* <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

  <h3 className="mb-2 text-center text-xs font-black uppercase tracking-widest text-blue-950">
    Contact Information
  </h3>

  <div className="grid grid-cols-2 gap-2">

    {[
      { name: "Saneej", phone: "9302 0909" },
      { name: "Najeem", phone: "9045 6786" },
      { name: "Irshad", phone: "9641 5605" },
    ].map((contact) => (
      <div
        key={contact.name}
        className="flex min-w-0 items-center gap-2 rounded-lg bg-slate-50 p-2"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800">
          <UserRound className="h-3.5 w-3.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-blue-950">
            {contact.name}
          </p>
          <p className="whitespace-nowrap text-[10px] text-slate-600">
            {contact.phone}
          </p>
        </div>

        <a
          href={`tel:${contact.phone.replace(/\s/g, "")}`}
          aria-label={`Call ${contact.name}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700"
        >
          <Phone className="h-3.5 w-3.5" />
        </a>
      </div>
    ))}

  </div>

  <p className="mt-2 text-center text-[10px] text-slate-500">
    Contact us for registration and payment assistance.
  </p>

</div> */}


</div>




        {/* <div className="p-4">
        <button
          onClick={() => navigate("/auction-live")}
          className="
            w-full
            flex items-center justify-center gap-3
            rounded-xl
            bg-gradient-to-r from-red-600 to-pink-600
            px-6 py-4
            text-lg font-black uppercase tracking-wider text-white
            shadow-lg
            hover:from-red-700 hover:to-pink-700
            hover:scale-[1.02]
            transition-all duration-200
          "
        >
          <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
          LIVE AUCTION
        </button>
      </div> */}


      </div>
    </div>
  );
};

export default HomePage;