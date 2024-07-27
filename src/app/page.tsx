"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "./globals.css"

import { projects } from "./projects";
import banner from "@/statics/representation-dark.svg"

import Navbar from "@/components/ui/navbar"
import { Bigtilt } from "@/components/ui/bigtilt";
import { WavyBackground } from "@/components/ui/wavy-background";  

import { HoverEffect } from "../components/ui/card-hover-effect";
import { HeadBoard } from "@/components/ui/headboard";

const World = dynamic(() => import("../components/ui/globe").then((m) => m.World), {
  ssr: false,
});

export default function Home() {

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: -15.432563,
      startLng: 28.315853,
      endLat: 1.094136,
      endLng: -63.34546,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 37.5665,
      startLng: 126.978,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: -8.833221,
      startLng: 13.264837,
      endLat: -33.936138,
      endLng: 18.436529,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 41.9028,
      startLng: 12.4964,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 14,
      startLat: -33.936138,
      startLng: 18.436529,
      endLat: 21.395643,
      endLng: 39.883798,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
  ];

  return (
    <div className="bg-black flex justify-center align-center flex-col scroll-smooth">
      <script defer data-domain="zetarya.com" src="https://plausible.io/js/script.js"></script>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <div className="mx-auto z-10">
        <Navbar />
      </div>

      <div className="landing flex w-[90vw] max-w-[1280px] mx-auto pt-[2rem] lg:pt-[6.5rem] justify-center align-center lg:flex-row flex-col">
        <div className="main">
        <div className="moving-text-container lg:text-[4rem] text-[2rem] text-white lg:leading-[5rem] font-extrabold">
          <h1 className="gradient-text">Moving world's data</h1>
          <h1 className="gradient-text">with speed, security</h1>
          <h1 className="gradient-text">and accuracy</h1>
        </div>


          <h2 className="headingtwo text-[10px] lg:text-[16px] text-white pt-5">
            Peer to Peer high speed data transfer software designed for businesses
            <br /> to provide seamless integration with existing pipeline
          </h2>

          <a href="https://cal.com/rohit.singh-zetarya.com/15min" target="_blank" className="bg-[#BB2649] w-[200px] h-[48px] border border-[#BB2649] rounded-[10px] text-[16px] text-white mt-[22px] font-semibold flex items-center justify-center gap-3">
              SCHEDULE A DEMO
             <svg className="h-[100px] lg:h-[150px]" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.469668 8.4697C0.176777 8.7626 0.176777 9.2374 0.469668 9.5303C0.762558 9.8232 1.23744 9.8232 1.53033 9.5303L5.5303 5.53033C5.8207 5.23999 5.8236 4.77014 5.5368 4.47624L1.63419 0.476243C1.34492 0.179763 0.870088 0.173914 0.573608 0.463184C0.277128 0.752444 0.271278 1.22728 0.560538 1.52376L3.94583 4.99351L0.469668 8.4697Z" fill="white"/>
              </svg>
          </a>
        </div>
        <div className="canvas max-w-7xl mx-auto w-full lg:w-1/2 relative overflow-hidden h-full lg:h-[40rem] px-4">
          <div className="lg:w-full lg:-bottom-20 pt-7 lg:h-full h-[50vh] z-[-1]">
            <World data={sampleArcs} globeConfig={globeConfig} />;
          </div>
        </div>
      </div>
      <div className="mx-auto lg:pt-5">
        <HeadBoard />
      </div>
      
      <h1 className="text-white font-semibold size-10 w-[90vw] m-auto align-middle text-center text-[3rem] lg:text-[5rem] h-[20vh] mt-48 mb-10">Why Zetarya</h1>
      <div className="whyzetarya grid grid-cols-1 lg:grid-cols-3 gap-20 m-auto justify-center w-[70vw] lg:w-[90vw] max-w-[1280px]">
        <ul className="flex flex-col items-center lg:items-start">
         <svg className="h-[100px] lg:h-[150px]" width="150" height="150" viewBox="0 0 150 158" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 41.5C6.41015 41.5 3.5 44.4101 3.5 48C3.5 51.5899 6.41015 54.5 10 54.5V41.5ZM95.8974 52.5962C98.4358 50.0578 98.4358 45.9422 95.8974 43.4038L54.5316 2.03806C51.9932 -0.500347 47.8777 -0.500347 45.3393 2.03806C42.8008 4.57647 42.8008 8.69204 45.3393 11.2304L82.1088 48L45.3393 84.7696C42.8008 87.308 42.8008 91.4235 45.3393 93.9619C47.8777 96.5003 51.9932 96.5003 54.5316 93.9619L95.8974 52.5962ZM10 54.5H91.3012V41.5H10V54.5Z" fill="#434343"/>
            <path d="M139 103.5C142.59 103.5 145.5 106.41 145.5 110C145.5 113.59 142.59 116.5 139 116.5V103.5ZM53.1026 114.596C50.5642 112.058 50.5642 107.942 53.1026 105.404L94.4684 64.0381C97.0068 61.4997 101.122 61.4997 103.661 64.0381C106.199 66.5765 106.199 70.692 103.661 73.2304L66.8912 110L103.661 146.77C106.199 149.308 106.199 153.424 103.661 155.962C101.122 158.5 97.0068 158.5 94.4684 155.962L53.1026 114.596ZM139 116.5H57.6988V103.5H139V116.5Z" fill="#BB254A"/>
          </svg>
          <h1 className="text-white text-l lg:text-2xl font-semibold mt-5 mb-3">High Speed Data Transfer</h1>
          <h5 className="text-white text-xs text-center lg:text-base lg:text-left">Utilise full network speed of the available bandwidth and transfer data with high speed</h5>
        </ul>
        <ul className="flex flex-col items-center lg:items-start">
          
         <svg className="h-[100px] lg:h-[150px]" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30.5961 18.3745L30.5957 18.3742L22.4677 10.2869L30.5961 18.3745ZM30.5961 18.3745C30.6536 18.4318 30.7032 18.4953 30.744 18.5634M30.5961 18.3745L30.744 18.5634M30.744 18.5634H26.2548C24.0457 18.5634 22.2548 16.7725 22.2548 14.5634V10.1267C22.3325 10.17 22.4041 10.2237 22.4674 10.2866L30.744 18.5634ZM17.598 11V20.2236C17.598 21.8709 18.9481 23.2042 20.5906 23.2042H30.8822V49.2729C30.8822 49.8125 30.4472 50.2535 29.8896 50.2535H1.99264C1.43496 50.2535 1 49.8125 1 49.2729V10.9806C1 10.441 1.43496 10 1.99264 10H16.598C17.1502 10 17.598 10.4477 17.598 11Z" stroke="#BB2649" strokeWidth="2"/>
            <path d="M5.19336 28.5527H26.2888" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5.19336 34.0557H26.2888" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5.19336 40.0176H26.2888" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M30.5961 63.5083L30.5957 63.5079L22.4677 55.4207L30.5961 63.5083ZM30.5961 63.5083C30.6536 63.5655 30.7032 63.6291 30.744 63.6972M30.5961 63.5083L30.744 63.6972M30.744 63.6972H26.2548C24.0457 63.6972 22.2548 61.9063 22.2548 59.6972V55.2605C22.3325 55.3038 22.4041 55.3575 22.4674 55.4204L30.744 63.6972ZM17.598 56.1338V65.3574C17.598 67.0047 18.9481 68.338 20.5906 68.338H30.8822V94.4067C30.8822 94.9463 30.4472 95.3873 29.8896 95.3873H1.99264C1.43496 95.3873 1 94.9463 1 94.4067V56.1144C1 55.5748 1.43496 55.1338 1.99264 55.1338H16.598C17.1502 55.1338 17.598 55.5815 17.598 56.1338Z" stroke="#434343" strokeWidth="2"/>
            <path d="M5.19336 73.6875H26.2888" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5.19336 79.1904H26.2888" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5.19336 85.1514H26.2888" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M30.5961 108.644L30.5957 108.644L22.4677 100.556L30.5961 108.644ZM30.5961 108.644C30.6536 108.701 30.7032 108.765 30.744 108.833M30.5961 108.644L30.744 108.833M30.744 108.833H26.2548C24.0457 108.833 22.2548 107.042 22.2548 104.833V100.396C22.3325 100.44 22.4041 100.493 22.4674 100.556L30.744 108.833ZM17.598 101.27V110.493C17.598 112.14 18.9481 113.474 20.5906 113.474H30.8822V139.542C30.8822 140.082 30.4472 140.523 29.8896 140.523H1.99264C1.43496 140.523 1 140.082 1 139.542V101.25C1 100.711 1.43496 100.27 1.99264 100.27H16.598C17.1502 100.27 17.598 100.717 17.598 101.27Z" stroke="#BB2649" strokeWidth="2"/>
            <path d="M5.19336 118.822H26.2888" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5.19336 124.325H26.2888" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5.19336 130.287H26.2888" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M69.9686 18.3745L69.9682 18.3742L61.8403 10.2869L69.9686 18.3745ZM69.9686 18.3745C70.0262 18.4318 70.0757 18.4953 70.1166 18.5634M69.9686 18.3745L70.1166 18.5634M70.1166 18.5634H65.6274C63.4182 18.5634 61.6274 16.7725 61.6274 14.5634V10.1267C61.7051 10.17 61.7766 10.2237 61.8399 10.2866L70.1166 18.5634ZM56.9705 11V20.2236C56.9705 21.8709 58.3206 23.2042 59.9631 23.2042H70.2548V49.2729C70.2548 49.8125 69.8198 50.2535 69.2621 50.2535H41.3652C40.8075 50.2535 40.3726 49.8125 40.3726 49.2729V10.9806C40.3726 10.441 40.8075 10 41.3652 10H55.9705C56.5228 10 56.9705 10.4477 56.9705 11Z" stroke="#434343" strokeWidth="2"/>
            <path d="M44.5659 28.5527H65.6613" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44.5659 34.0557H65.6613" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44.5659 40.0176H65.6613" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M69.9686 63.5083L69.9682 63.5079L61.8403 55.4207L69.9686 63.5083ZM69.9686 63.5083C70.0262 63.5655 70.0757 63.6291 70.1166 63.6972M69.9686 63.5083L70.1166 63.6972M70.1166 63.6972H65.6274C63.4182 63.6972 61.6274 61.9063 61.6274 59.6972V55.2605C61.7051 55.3038 61.7766 55.3575 61.8399 55.4204L70.1166 63.6972ZM56.9705 56.1338V65.3574C56.9705 67.0047 58.3206 68.338 59.9631 68.338H70.2548V94.4067C70.2548 94.9463 69.8198 95.3873 69.2621 95.3873H41.3652C40.8075 95.3873 40.3726 94.9463 40.3726 94.4067V56.1144C40.3726 55.5748 40.8075 55.1338 41.3652 55.1338H55.9705C56.5228 55.1338 56.9705 55.5815 56.9705 56.1338Z" stroke="#BB2649" strokeWidth="2"/>
            <path d="M44.5659 73.6875H65.6613" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44.5659 79.1904H65.6613" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44.5659 85.1514H65.6613" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M69.9686 108.644L69.9682 108.644L61.8403 100.556L69.9686 108.644ZM69.9686 108.644C70.0262 108.701 70.0757 108.765 70.1166 108.833M69.9686 108.644L70.1166 108.833M70.1166 108.833H65.6274C63.4182 108.833 61.6274 107.042 61.6274 104.833V100.396C61.7051 100.44 61.7766 100.493 61.8399 100.556L70.1166 108.833ZM56.9705 101.27V110.493C56.9705 112.14 58.3206 113.474 59.9631 113.474H70.2548V139.542C70.2548 140.082 69.8198 140.523 69.2621 140.523H41.3652C40.8075 140.523 40.3726 140.082 40.3726 139.542V101.25C40.3726 100.711 40.8075 100.27 41.3652 100.27H55.9705C56.5228 100.27 56.9705 100.717 56.9705 101.27Z" stroke="#434343" strokeWidth="2"/>
            <path d="M44.5659 118.822H65.6613" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44.5659 124.325H65.6613" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44.5659 130.287H65.6613" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M109.341 18.3745L109.341 18.3742L101.213 10.2869L109.341 18.3745ZM109.341 18.3745C109.399 18.4318 109.448 18.4953 109.489 18.5634M109.341 18.3745L109.489 18.5634M109.489 18.5634H105C102.791 18.5634 101 16.7725 101 14.5634V10.1267C101.078 10.17 101.149 10.2237 101.213 10.2866L109.489 18.5634ZM96.3431 11V20.2236C96.3431 21.8709 97.6932 23.2042 99.3357 23.2042H109.627V49.2729C109.627 49.8125 109.192 50.2535 108.635 50.2535H80.7378C80.1801 50.2535 79.7451 49.8125 79.7451 49.2729V10.9806C79.7451 10.441 80.1801 10 80.7378 10H95.3431C95.8954 10 96.3431 10.4477 96.3431 11Z" stroke="#BB2649" strokeWidth="2"/>
            <path d="M83.939 28.5527H105.034" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M83.939 34.0557H105.034" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M83.939 40.0176H105.034" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M109.342 63.5083L109.341 63.5079L101.213 55.4207L109.342 63.5083ZM109.342 63.5083C109.399 63.5655 109.449 63.6291 109.49 63.6972M109.342 63.5083L109.49 63.6972M109.49 63.6972H105C102.791 63.6972 101 61.9063 101 59.6972V55.2605C101.078 55.3038 101.15 55.3575 101.213 55.4204L109.49 63.6972ZM96.3436 56.1338V65.3574C96.3436 67.0047 97.6937 68.338 99.3362 68.338H109.628V94.4067C109.628 94.9463 109.193 95.3873 108.635 95.3873H80.7382C80.1806 95.3873 79.7456 94.9463 79.7456 94.4067V56.1144C79.7456 55.5748 80.1806 55.1338 80.7382 55.1338H95.3436C95.8958 55.1338 96.3436 55.5815 96.3436 56.1338Z" stroke="#434343" strokeWidth="2"/>
            <path d="M83.939 73.6875H105.034" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M83.939 79.1904H105.034" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M83.939 85.1514H105.034" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M109.342 108.644L109.341 108.644L101.213 100.556L109.342 108.644ZM109.342 108.644C109.399 108.701 109.449 108.765 109.49 108.833M109.342 108.644L109.49 108.833M109.49 108.833H105C102.791 108.833 101 107.042 101 104.833V100.396C101.078 100.44 101.15 100.493 101.213 100.556L109.49 108.833ZM96.3436 101.27V110.493C96.3436 112.14 97.6937 113.474 99.3362 113.474H109.628V139.542C109.628 140.082 109.193 140.523 108.635 140.523H80.7382C80.1806 140.523 79.7456 140.082 79.7456 139.542V101.25C79.7456 100.711 80.1806 100.27 80.7382 100.27H95.3436C95.8958 100.27 96.3436 100.717 96.3436 101.27Z" stroke="#BB2649" strokeWidth="2"/>
            <path d="M83.939 118.822H105.034" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M83.939 124.325H105.034" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M83.939 130.287H105.034" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M148.714 18.3745L148.713 18.3742L140.585 10.2869L148.714 18.3745ZM148.714 18.3745C148.771 18.4318 148.821 18.4953 148.862 18.5634M148.714 18.3745L148.862 18.5634M148.862 18.5634H144.372C142.163 18.5634 140.372 16.7725 140.372 14.5634V10.1267C140.45 10.17 140.522 10.2237 140.585 10.2866L148.862 18.5634ZM135.716 11V20.2236C135.716 21.8709 137.066 23.2042 138.708 23.2042H149V49.2729C149 49.8125 148.565 50.2535 148.007 50.2535H120.11C119.553 50.2535 119.118 49.8125 119.118 49.2729V10.9806C119.118 10.441 119.553 10 120.11 10H134.716C135.268 10 135.716 10.4477 135.716 11Z" stroke="#434343" strokeWidth="2"/>
            <path d="M123.312 28.5527H144.407" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M123.312 34.0557H144.407" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M123.312 40.0176H144.407" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M148.714 63.5083L148.714 63.5079L140.586 55.4207L148.714 63.5083ZM148.714 63.5083C148.772 63.5655 148.821 63.6291 148.862 63.6972M148.714 63.5083L148.862 63.6972M148.862 63.6972H144.373C142.164 63.6972 140.373 61.9063 140.373 59.6972V55.2605C140.451 55.3038 140.522 55.3575 140.586 55.4204L148.862 63.6972ZM135.716 56.1338V65.3574C135.716 67.0047 137.066 68.338 138.709 68.338H149V94.4067C149 94.9463 148.565 95.3873 148.008 95.3873H120.111C119.553 95.3873 119.118 94.9463 119.118 94.4067V56.1144C119.118 55.5748 119.553 55.1338 120.111 55.1338H134.716C135.268 55.1338 135.716 55.5815 135.716 56.1338Z" stroke="#BB2649" strokeWidth="2"/>
            <path d="M123.312 73.6875H144.407" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M123.312 79.1904H144.407" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M123.312 85.1514H144.407" stroke="#BB2649" strokeWidth="2" strokeLinecap="round"/>
            <path d="M148.714 108.644L148.714 108.644L140.586 100.556L148.714 108.644ZM148.714 108.644C148.772 108.701 148.821 108.765 148.862 108.833M148.714 108.644L148.862 108.833M148.862 108.833H144.373C142.164 108.833 140.373 107.042 140.373 104.833V100.396C140.451 100.44 140.522 100.493 140.586 100.556L148.862 108.833ZM135.716 101.27V110.493C135.716 112.14 137.066 113.474 138.709 113.474H149V139.542C149 140.082 148.565 140.523 148.008 140.523H120.111C119.553 140.523 119.118 140.082 119.118 139.542V101.25C119.118 100.711 119.553 100.27 120.111 100.27H134.716C135.268 100.27 135.716 100.717 135.716 101.27Z" stroke="#434343" strokeWidth="2"/>
            <path d="M123.312 118.822H144.407" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M123.312 124.325H144.407" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
            <path d="M123.312 130.287H144.407" stroke="#434343" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h1 className="text-white text-2xl font-semibold mt-5 mb-3">Agile</h1>
          <h5 className="text-white text-xs text-center lg:text-base lg:text-left">Lots of small files doesn&apos;t affect the speed</h5>
        </ul>
        <ul className="flex flex-col items-center lg:items-start">
         <svg className="h-[100px] lg:h-[150px]" width="164" height="150" viewBox="0 0 164 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M113.416 54.3447L113.417 54.3452C113.726 54.6524 113.937 55.0364 114.035 55.4487H100.064C98.1307 55.4487 96.5637 53.8817 96.5637 51.9487V38.0954C96.9999 38.1913 97.3976 38.4066 97.7119 38.7191L113.416 54.3447ZM88.4304 38.5391V58.2243C88.4304 61.166 90.843 63.5511 93.7804 63.5511H114.097V114.351C114.097 115.635 113.061 116.678 111.747 116.678H57.8471C56.5334 116.678 55.4971 115.635 55.4971 114.351V40.3659C55.4971 39.0821 56.5334 38.0391 57.8471 38.0391H87.9304C88.2065 38.0391 88.4304 38.2629 88.4304 38.5391Z" stroke="#434343" strokeWidth="3"/>
            <path d="M64.0352 74.3125H104.794" stroke="#434343" strokeWidth="3" strokeLinecap="round"/>
            <path d="M64.0352 84.9502H104.794" stroke="#434343" strokeWidth="3" strokeLinecap="round"/>
            <path d="M64.0352 96.4619H104.794" stroke="#434343" strokeWidth="3" strokeLinecap="round"/>
            <path d="M10.5 72C10.5 72.8284 11.1716 73.5 12 73.5C12.8284 73.5 13.5 72.8284 13.5 72H10.5ZM150.939 73.0607C151.525 73.6464 152.475 73.6464 153.061 73.0607L162.607 63.5147C163.192 62.9289 163.192 61.9792 162.607 61.3934C162.021 60.8076 161.071 60.8076 160.485 61.3934L152 69.8787L143.515 61.3934C142.929 60.8076 141.979 60.8076 141.393 61.3934C140.808 61.9792 140.808 62.9289 141.393 63.5147L150.939 73.0607ZM13.5 72C13.5 49.0736 22.0824 31.9891 34.8715 20.6211C47.6882 9.22852 64.8196 3.50011 82 3.50018C99.1804 3.50025 116.312 9.22879 129.128 20.6214C141.918 31.9895 150.5 49.0739 150.5 72H153.5C153.5 48.2598 144.582 30.3444 131.122 18.3792C117.688 6.43849 99.8196 0.500254 82 0.500183C64.1804 0.500112 46.3118 6.4382 32.8785 18.3789C19.4176 30.3441 10.5 48.2596 10.5 72H13.5Z" fill="#BB254A"/>
            <path d="M153.5 77.5996C153.5 76.7712 152.828 76.0996 152 76.0996C151.172 76.0996 150.5 76.7712 150.5 77.5996H153.5ZM13.0607 76.5389C12.4749 75.9532 11.5251 75.9532 10.9393 76.5389L1.3934 86.0849C0.807612 86.6707 0.807612 87.6204 1.3934 88.2062C1.97918 88.792 2.92893 88.792 3.51472 88.2062L12 79.7209L20.4853 88.2062C21.0711 88.792 22.0208 88.792 22.6066 88.2062C23.1924 87.6204 23.1924 86.6707 22.6066 86.0849L13.0607 76.5389ZM150.5 77.5996C150.5 100.526 141.918 117.61 129.128 128.979C116.312 140.371 99.1804 146.099 82 146.099C64.8196 146.099 47.6883 140.371 34.8715 128.978C22.0824 117.61 13.5 100.526 13.5 77.5996H10.5C10.5 101.34 19.4176 119.255 32.8785 131.22C46.3117 143.161 64.1804 149.099 82 149.099C99.8196 149.099 117.688 143.161 131.122 131.221C144.582 119.256 153.5 101.34 153.5 77.5996H150.5Z" fill="#BB254A"/>
          </svg>

          <h1 className="text-white text-2xl font-semibold mt-5 mb-3">Transfer Managemnt</h1>
          <h5 className="text-white text-xs text-center lg:text-base lg:text-left">Automate, monitor and control data transfers and workflows.</h5>
        </ul>
        <ul className="flex flex-col items-center lg:items-start">
         <svg className="h-[100px] lg:h-[150px]" width="225" height="150" viewBox="0 0 187 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M184.43 23.6225L184.429 23.6219L163.269 2.56777L184.43 23.6225ZM184.43 23.6225C185.073 24.2617 185.448 25.1127 185.495 26M184.43 23.6225L185.495 26M185.495 26H164.333C162.4 26 160.833 24.433 160.833 22.5V1.50429C161.759 1.54816 162.624 1.92659 163.268 2.56723L185.495 26ZM150.917 2V29.2187C150.917 32.8916 153.931 35.875 157.604 35.875H185.5V104.844C185.5 106.864 183.867 108.5 181.812 108.5H109.188C107.133 108.5 105.5 106.864 105.5 104.844V5.15625C105.5 3.13579 107.133 1.5 109.188 1.5H150.417C150.693 1.5 150.917 1.72386 150.917 2Z" stroke="#434343" strokeWidth="3"/>
            <path d="M117.521 50.9033H172.439" stroke="#434343" strokeWidth="3" strokeLinecap="round"/>
            <path d="M117.521 65.2295H172.439" stroke="#434343" strokeWidth="3" strokeLinecap="round"/>
            <path d="M117.521 80.75H172.439" stroke="#434343" strokeWidth="3" strokeLinecap="round"/>
            <path d="M132.312 18.5H77.5625L59.3125 0.25H13.6875C6.12801 0.25 0 6.37801 0 13.9375V96.0625C0 103.622 6.12801 109.75 13.6875 109.75H132.312C139.872 109.75 146 103.622 146 96.0625V32.1875C146 24.628 139.872 18.5 132.312 18.5Z" fill="#BB254A"/>
          </svg>
          <h1 className="text-white text-2xl font-semibold mt-5 mb-3">Big data transfer</h1>
          <h5 className="text-white text-xs text-center lg:text-base lg:text-left">Transfer huge files and folders globally or over the VPN on same network</h5>
        </ul>
        <ul className="flex flex-col items-center lg:items-start">
         <svg className="h-[100px] lg:h-[150px]" width="202.63" height="150" viewBox="0 0 150 112" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_583_401)">
            <mask id="mask0_583_401" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="56" y="85" width="38" height="26">
            <path d="M56.2759 85.9062H93.7244V110.652C93.7244 110.759 93.6375 110.846 93.5302 110.846H56.4701C56.3628 110.846 56.2759 110.759 56.2759 110.652V85.9062Z" fill="#BB254A"/>
            </mask>
            <g mask="url(#mask0_583_401)">
            <g filter="url(#filter0_dii_583_401)">
            <path d="M93.7448 109.004H56.269V110.846H93.7448V109.004Z" fill="black"/>
            </g>
            <g filter="url(#filter1_di_583_401)">
            <path d="M93.7448 85.9814H56.269V109.003H93.7448V85.9814Z" fill="#434343"/>
            </g>
            </g>
            <g filter="url(#filter2_i_583_401)">
            <path d="M56.8203 110.846H61.432V110.961C61.432 111.004 61.3965 111.04 61.3533 111.04H56.899C56.8557 111.04 56.8203 111.004 56.8203 110.961V110.846Z" fill="#434343"/>
            </g>
            <g filter="url(#filter3_i_583_401)">
            <path d="M88.5195 110.846H93.1797V110.961C93.1797 111.004 93.1443 111.04 93.1011 111.04H88.5982C88.555 111.04 88.5195 111.004 88.5195 110.961V110.846Z" fill="#434343"/>
            </g>
            <g filter="url(#filter4_i_583_401)">
            <path d="M148.932 0.0488281H1.06776C0.504749 0.0488281 0.0483398 0.50452 0.0483398 1.06664V84.9154C0.0483398 85.4775 0.504749 85.9332 1.06776 85.9332H148.932C149.495 85.9332 149.951 85.4775 149.951 84.9154V1.06664C149.951 0.50452 149.495 0.0488281 148.932 0.0488281Z" fill="#434343"/>
            </g>
            <path d="M148.078 1.8418H1.9224C1.8795 1.8418 1.84473 1.87652 1.84473 1.91934V84.062C1.84473 84.1048 1.8795 84.1395 1.9224 84.1395H148.078C148.121 84.1395 148.155 84.1048 148.155 84.062V1.91934C148.155 1.87652 148.121 1.8418 148.078 1.8418Z" fill="black"/>
            <path d="M93.1421 36.1421C89.3914 39.8929 84.3043 42 79 42C73.6957 42 68.6086 39.8929 64.8579 36.1421L69.5719 31.4281C72.0724 33.9286 75.4638 35.3333 79 35.3333C82.5362 35.3333 85.9276 33.9286 88.4281 31.4281L93.1421 36.1421Z" fill="#BB2649"/>
            <path d="M93.1421 49.604C89.3914 45.8532 84.3043 43.7461 79 43.7461C73.6957 43.7461 68.6086 45.8532 64.8579 49.604L69.5719 54.318C72.0724 51.8175 75.4638 50.4128 79 50.4128C82.5362 50.4128 85.9276 51.8175 88.4281 54.318L93.1421 49.604Z" fill="#BB2649"/>
            </g>
            <defs>
            <filter id="filter0_dii_583_401" x="56.269" y="105.004" width="37.4756" height="7.8418" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.670833 0 0 0 0 0.670833 0 0 0 0 0.670833 0 0 0 0.2 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_583_401"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_583_401" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="-4"/>
            <feGaussianBlur stdDeviation="4.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow_583_401"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="1.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.870833 0 0 0 0 0.870833 0 0 0 0 0.870833 0 0 0 1 0"/>
            <feBlend mode="normal" in2="effect2_innerShadow_583_401" result="effect3_innerShadow_583_401"/>
            </filter>
            <filter id="filter1_di_583_401" x="29.269" y="43.9814" width="91.4756" height="77.0225" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="-15"/>
            <feGaussianBlur stdDeviation="13.5"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_583_401"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_583_401" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="7"/>
            <feGaussianBlur stdDeviation="5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.545833 0 0 0 0 0.545833 0 0 0 0 0.545833 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow_583_401"/>
            </filter>
            <filter id="filter2_i_583_401" x="56.8203" y="110.846" width="4.61182" height="0.194336" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_583_401"/>
            </filter>
            <filter id="filter3_i_583_401" x="88.5195" y="110.846" width="4.66016" height="0.194336" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_583_401"/>
            </filter>
            <filter id="filter4_i_583_401" x="0.0483398" y="0.0488281" width="149.903" height="85.8848" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.125 0 0 0 0 0.125 0 0 0 0 0.125 0 0 0 0.2 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_583_401"/>
            </filter>
            <clipPath id="clip0_583_401">
            <rect width="150" height="111.039" fill="white"/>
            </clipPath>
            </defs>
          </svg>

          <h1 className="text-white text-2xl font-semibold mt-5 mb-3">Secure by design</h1>
          <h5 className="text-white text-xs text-center lg:text-base lg:text-left">On-premises software runs behinds your firewall</h5>
        </ul>
        <ul className="flex flex-col items-center lg:items-start">
         <svg className="h-[100px] lg:h-[150px]" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M33.1271 116.884C35.6395 117.484 38.2131 117.787 40.7958 117.787C43.3731 117.784 45.9411 117.479 48.4475 116.879C49.1065 116.721 49.7005 116.363 50.1486 115.854C50.5969 115.346 50.8774 114.712 50.9522 114.038L51.5266 108.82C51.6237 107.887 52.0506 107.019 52.7306 106.372C53.4107 105.726 54.2992 105.343 55.236 105.294C55.8589 105.267 56.4799 105.383 57.0508 105.634L61.8206 107.725C62.2354 107.912 62.6845 108.01 63.1392 108.013C63.5939 108.016 64.0442 107.924 64.4612 107.742C64.8801 107.564 65.2564 107.298 65.5657 106.964C69.0729 103.184 71.6913 98.6678 73.2295 93.7458C73.4308 93.0928 73.4244 92.3935 73.2115 91.7442C72.9984 91.0951 72.589 90.5279 72.0398 90.1213L67.8021 86.9947C67.2972 86.6282 66.8864 86.1473 66.6031 85.5914C66.3198 85.0356 66.1722 84.4207 66.1722 83.7967C66.1722 83.1729 66.3198 82.5578 66.6031 82.002C66.8864 81.4461 67.2972 80.9654 67.8021 80.5987L72.0262 77.4789C72.5771 77.0718 72.9875 76.5032 73.2006 75.8522C73.4138 75.2012 73.4191 74.5001 73.2157 73.8459C71.6772 68.9234 69.0558 64.4078 65.5436 60.6309C65.0784 60.1335 64.4702 59.7929 63.8029 59.6559C63.1358 59.519 62.4427 59.5925 61.819 59.8663L57.0508 61.9665C56.5561 62.1895 56.0199 62.3052 55.4773 62.3064C54.4984 62.3048 53.5543 61.9419 52.8265 61.2872C52.0985 60.6323 51.6382 59.7318 51.5334 58.7584L50.9558 53.5587C50.8817 52.8762 50.5962 52.2339 50.1393 51.7217C49.6822 51.2096 49.0764 50.8531 48.4069 50.7022C45.9136 50.1456 43.369 49.85 40.8145 49.8203C38.242 49.85 35.6796 50.1462 33.1679 50.704C32.4991 50.854 31.8938 51.2093 31.4367 51.7202C30.9798 52.2311 30.694 52.8722 30.6191 53.5536L30.0396 58.7566C29.9312 59.7311 29.4671 60.6314 28.7363 61.2851C27.99 61.9191 27.0493 62.2788 26.0702 62.3047C25.5303 62.3043 24.9963 62.192 24.5018 61.975L19.7439 59.8748C19.1182 59.5985 18.422 59.524 17.752 59.6617C17.0822 59.7993 16.4717 60.1422 16.0056 60.6428C12.4979 64.4204 9.87896 68.9344 8.34033 73.8544C8.13715 74.5083 8.14249 75.2092 8.35562 75.8599C8.56878 76.5105 8.97913 77.0787 9.5298 77.4857L13.7592 80.6055C14.2599 80.9753 14.667 81.457 14.9479 82.0123C15.2288 82.5678 15.3757 83.1812 15.3769 83.8035C15.3775 84.427 15.2313 85.0417 14.9503 85.5981C14.6693 86.1546 14.2612 86.637 13.7592 87.0066L9.52812 90.1315C8.97813 90.5383 8.5682 91.1058 8.35508 91.7558C8.14198 92.4058 8.1362 93.106 8.33862 93.7594C9.87393 98.6841 12.4925 103.202 16.0022 106.983C16.3071 107.313 16.6775 107.576 17.0897 107.754C17.5056 107.937 17.9549 108.031 18.4091 108.031C18.8635 108.031 19.3128 107.937 19.7286 107.754L24.5188 105.652C25.0131 105.435 25.5471 105.322 26.0872 105.323H26.1008C27.076 105.324 28.0165 105.684 28.7434 106.334C29.4704 106.984 29.9329 107.878 30.043 108.847L30.6174 114.042C30.6925 114.716 30.9737 115.351 31.423 115.86C31.8721 116.368 32.4671 116.726 33.1271 116.884ZM40.7836 94.4238C34.9181 94.4238 30.1633 89.669 30.1633 83.8035C30.1633 77.938 34.9181 73.1832 40.7836 73.1832C46.649 73.1832 51.4039 77.938 51.4039 83.8035C51.4039 89.669 46.649 94.4238 40.7836 94.4238Z" fill="#BB254A"/>
            <g clipPath="url(#clip0_583_427)">
            <path d="M95.9042 31.504C96.4011 31.6644 96.8345 31.9779 97.1425 32.3995C97.4561 32.8217 97.6292 33.3316 97.6371 33.8575C97.6878 37.4653 96.9325 41.039 95.4262 44.3177C95.208 44.789 94.8492 45.1811 94.3991 45.4401C93.9488 45.699 93.4293 45.8119 92.9123 45.7635L89.3013 45.4142C88.9066 45.3741 88.508 45.4266 88.1372 45.5674C87.7687 45.7127 87.4398 45.9432 87.1776 46.2401C86.9138 46.5348 86.7239 46.888 86.623 47.2705C86.5222 47.6531 86.5136 48.0542 86.5979 48.4406L87.3473 52.004C87.4531 52.5113 87.3998 53.0387 87.1946 53.5145C86.9893 53.9904 86.6423 54.3911 86.2007 54.6624C83.1107 56.5624 79.6169 57.7092 76.0019 58.01C75.4884 58.0539 74.974 57.9371 74.5295 57.676C74.084 57.4155 73.7289 57.0245 73.5126 56.5557L72.0065 53.2479C71.7488 52.685 71.2931 52.2369 70.7259 51.9889C70.284 51.7989 69.7974 51.738 69.3223 51.8129C68.8472 51.8878 68.403 52.0957 68.041 52.4123L65.3382 54.8357C64.9517 55.1808 64.4679 55.3977 63.9532 55.4568C63.4385 55.516 62.9182 55.4144 62.4635 55.1659C59.3026 53.4161 56.5727 50.9819 54.4735 48.0415C54.1712 47.6158 54.0086 47.1069 54.0079 46.5847C54.0053 46.0605 54.1684 45.5488 54.474 45.1226L56.5834 42.15C56.8144 41.827 56.9662 41.4542 57.0263 41.0615C57.0864 40.6689 57.0531 40.2676 56.9293 39.8903C56.8054 39.513 56.5944 39.1702 56.3134 38.8896C56.0323 38.6089 55.6891 38.3984 55.3115 38.2752L51.8519 37.1341C51.3581 36.9746 50.927 36.6636 50.6195 36.2455C50.3088 35.826 50.1364 35.32 50.1264 34.7978C50.0752 31.188 50.832 27.6124 52.3411 24.3328C52.4865 24.0144 52.6983 23.7309 52.9624 23.5011C53.2198 23.2762 53.5198 23.1054 53.8446 22.9988C54.1694 22.8922 54.5123 22.852 54.8529 22.8806L58.4494 23.2346C58.844 23.2696 59.2413 23.2118 59.6096 23.0656C59.9778 22.9196 60.3066 22.6893 60.5698 22.3932C60.833 22.0972 61.0233 21.7436 61.1253 21.3608C61.2271 20.9781 61.2381 20.5767 61.1572 20.189L60.4137 16.6379C60.3032 16.1259 60.3578 15.5921 60.5695 15.1131C60.7808 14.6323 61.1369 14.2297 61.5882 13.9614C63.136 13.0455 64.7737 12.291 66.4756 11.7097C68.1806 11.1717 69.9367 10.8122 71.716 10.6371C72.2383 10.5856 72.7637 10.6993 73.2179 10.9622C73.6722 11.2251 74.0325 11.6238 74.2482 12.1022L75.7527 15.3999C75.9157 15.7602 76.1611 16.077 76.4693 16.3248C76.7774 16.5726 77.1394 16.7444 77.5262 16.8264C77.9131 16.9083 78.3137 16.8981 78.6958 16.7966C79.078 16.695 79.4307 16.5051 79.7258 16.2419L82.4135 13.8271C82.8018 13.4812 83.2878 13.264 83.8045 13.2052C84.3211 13.1463 84.8434 13.2488 85.2995 13.4986C88.4569 15.244 91.1835 17.6739 93.2798 20.61C93.5834 21.0358 93.7463 21.5457 93.7457 22.0686C93.7452 22.5916 93.5812 23.1011 93.2767 23.5262L91.1738 26.4913C90.9393 26.8144 90.785 27.1887 90.7239 27.5833C90.6334 28.1742 90.7559 28.7778 91.0698 29.2866C91.3836 29.7953 91.868 30.1759 92.4365 30.3602L95.9042 31.504ZM75.997 40.7712C79.5637 39.6005 81.5059 35.7601 80.3352 32.1935C79.1645 28.6267 75.3242 26.6845 71.7575 27.8552C68.1909 29.0259 66.2485 32.8662 67.4192 36.433C68.5899 39.9996 72.4304 41.9419 75.997 40.7712Z" fill="#434343"/>
            </g>
            <g clipPath="url(#clip1_583_427)">
            <path d="M77.0481 112.92C76.0244 112.301 74.9391 111.791 73.8096 111.397C72.6431 111.02 71.4684 110.772 70.2775 110.647C69.7579 110.592 69.2608 110.874 69.0403 111.349L67.9848 113.622C67.6825 114.273 67.0897 114.742 66.3876 114.886C65.6816 115.033 64.9521 114.834 64.4216 114.352L62.5779 112.673C62.1944 112.324 61.6324 112.256 61.1758 112.502C59.0505 113.651 57.2123 115.266 55.7995 117.228C55.4946 117.651 55.4908 118.221 55.79 118.648L57.2343 120.708C57.6467 121.295 57.7551 122.043 57.5268 122.723C57.2984 123.403 56.7606 123.934 56.0783 124.153L53.6817 124.926C53.1863 125.086 52.8458 125.542 52.8331 126.063C52.7741 128.482 53.2635 130.881 54.2646 133.081C54.4795 133.554 54.9686 133.839 55.485 133.792L57.9782 133.568C58.6886 133.505 59.3879 133.784 59.861 134.32C60.3341 134.856 60.5248 135.585 60.375 136.285L59.8437 138.732C59.734 139.237 59.953 139.757 60.3909 140.03C62.4493 141.315 64.7806 142.098 67.1971 142.315C67.7112 142.362 68.1993 142.079 68.4168 141.61L69.4713 139.335C69.7727 138.684 70.3649 138.216 71.0665 138.073C71.7681 137.93 72.4953 138.13 73.0253 138.611L74.8776 140.294C75.2613 140.643 75.823 140.711 76.2792 140.464C78.4038 139.315 80.2412 137.699 81.6537 135.738C81.9583 135.315 81.9623 134.745 81.6635 134.319L80.2197 132.257C79.8069 131.67 79.6986 130.922 79.9269 130.242C80.1553 129.561 80.6931 129.03 81.3753 128.811L83.7686 128.039C84.2642 127.879 84.6046 127.422 84.6169 126.901C84.6742 124.484 84.1834 122.087 83.1814 119.888C82.9662 119.416 82.4767 119.132 81.9602 119.179L79.4769 119.405C79.1658 119.434 78.8554 119.398 78.5626 119.299C77.4729 118.932 76.8344 117.803 77.0797 116.678L77.6102 114.226C77.7208 113.715 77.495 113.19 77.0481 112.92ZM67.038 131.513C64.2599 130.58 62.7638 127.572 63.6965 124.793C64.6292 122.015 67.6375 120.519 70.4156 121.452C73.1937 122.385 74.6898 125.393 73.7571 128.171C72.8244 130.949 69.8161 132.445 67.038 131.513Z" fill="#434343"/>
            </g>
            <defs>
            <clipPath id="clip0_583_427">
            <rect width="54.3758" height="54.3758" fill="white" transform="translate(39.5688 16.958) rotate(-18.1718)"/>
            </clipPath>
            <clipPath id="clip1_583_427">
            <rect width="37.1435" height="37.1435" fill="white" transform="translate(57.0317 102.966) rotate(18.558)"/>
            </clipPath>
            </defs>
          </svg>
          <h1 className="text-white text-2xl font-semibold mt-5 mb-3">Easy Integration</h1>
          <h5 className="text-white text-xs text-center lg:text-base lg:text-left">REST API to directly integrate into your application</h5>
        </ul>
      </div>
      <h1 className="text-white font-semibold size-5 w-[90vw] m-auto align-middle text-center text-[3rem] lg:text-[5rem] h-[20vh] mt-48 mb-2">Use Case</h1>
      <div className="max-w-5xl mx-auto px-8 my-50">
        <HoverEffect items={projects} />
      </div>
      <WavyBackground className="max-w-4xl mx-auto">
        <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
          Schedule A Demo
        </p>
        <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        A quick video meeting to understand zetarya and its perfect fit of data transfer to your organisation.
        </p>
      </WavyBackground>
      <footer className="bg-[#171515] text-[#F5F5F7] py-8">
        <div className="flex flex-row justify-between h-[200px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="">
            <h2 className="mb-4">CONTACT US</h2>
            <p className="text-base lg:text-5xl mb-4 font-semibold">info@zetarya.com</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
            <div>
              <a href="/docs" className="text-sm hover:underline">Docs</a>
            </div>
            <div>
              <a href="/terms-and-privacy" className="text-sm hover:underline">Term & Privacy</a>
            </div>
            <div>
              <a href="/blogs" className="text-sm hover:underline">Blogs</a>
            </div>
            <div>
              <a href="/pricing" className="text-sm hover:underline">Pricing</a>
            </div>
            <div>
              <a href="https://www.zero2.in" className="text-sm hover:underline">Company</a>
            </div>
            <div>
              <a href="/contact" className="text-sm hover:underline">Contact</a>
            </div>
          </div>
        </div>
      </footer>
      <p className="text-gray-700 bg-[#171515] w-full text-center pb-2">© zero2 All rights reserved</p>
    </div> 
  );
}
