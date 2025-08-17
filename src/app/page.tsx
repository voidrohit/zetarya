"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "./globals.css"

import { projects } from "./projects";
import banner from "@/statics/img.png"
import bannerMobile from "@/statics/img.png"


import Navbar from "@/components/ui/navbar"
import { WavyBackground } from "@/components/ui/wavy-background";
import { Cover } from "@/components/ui/cover";
import { HoverEffect } from "@/components/ui/card-hover-effect";
const maskStyle: React.CSSProperties = {
  maskType: 'alpha',
};

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
    <div className="bg-white flex justify-center align-center flex-col scroll-smooth overflow-hidden">
      <script defer src="https://cloud.umami.is/script.js" data-website-id="520e5182-eaf4-4ed3-9907-598c58f7ba2c"></script>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      {/*<div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-0">*/}
      {/*  <div className="h-[50vh] w-[50vh] lg:h-[40rem] lg:w-[40rem]">*/}
      {/*    <World data={sampleArcs} globeConfig={globeConfig} />*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="mx-auto z-1">
        <Navbar />
      </div>
      <div className="relative overflow-hidden">
        <div className="flex max-w-[1280px] w-[90vw] mx-auto pt-[2rem] lg:pt-[3rem] justify-center items-center flex-col relative z-10">
          <div className="main">
            <div className="lg:text-[3rem] text-2xl text-black lg:leading-[3.5rem] font-medium text-center">
              <h1>Direct data transfer</h1>
              <h1>cross border upto <Cover>1 Gbps</Cover></h1>
            </div>
            <h2 className="text-[10px] lg:text-lg text-black pt-5 text-center">
              Zetarya is peer to peer high speed data transfer system utilizing full<br />
              bandwidth of your internet speed encrypted with AES-256 & TLS 1.3.
            </h2>
            <div className="flex mt-5 justify-center">
              <a
                  href="https://cal.com/rohit.singh-zetarya.com/15min"
                  target="_blank"
                  className="bg-[#801336] hover:bg-[#BB2649] w-[200px] hover:scale-105 h-[48px] border border-[#801336] rounded-[10px] text-[16px] text-white mt-[22px] font-semibold flex items-center justify-center gap-3"
              >
                SCHEDULE A DEMO
                <svg className="h-[100px] lg:h-[150px]" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.469668 8.4697C0.176777 8.7626 0.176777 9.2374 0.469668 9.5303C0.762558 9.8232 1.23744 9.8232 1.53033 9.5303L5.5303 5.53033C5.8207 5.23999 5.8236 4.77014 5.5368 4.47624L1.63419 0.476243C1.34492 0.179763 0.870088 0.173914 0.573608 0.463184C0.277128 0.752444 0.271278 1.22728 0.560538 1.52376L3.94583 4.99351L0.469668 8.4697Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center align-center max-w-[1280px] w-[90vw] mx-auto pt-32 lg:pt-[10rem]">
        <Image src={banner} alt="Banner Image" width={0} height={0} style={{width:'auto', height:'auto'}} className="hidden md:block" />
        <Image src={bannerMobile} alt="Banner Mobile Image" width={0} height={0} style={{width:'auto', height:'auto'}} className="md:hidden" />
      </div>
      <div className="flex max-w-[1280px] lg:w-[50vw] w-[90vw] mx-auto flex-col space-y-8 lg:pt-[10rem] pt-32">
        <div className="space-y-1">
          <h1 className="font-medium text-[1.5rem]">Files are shared straight from your device</h1>
          <p>
            The traditional cloud sharing process is inefficient by design — you're forced to upload
            everything to servers first, then wait through another full download. This redundant approach
            doubles your transfer time unnecessarily.
          </p>
          <p>
            Zetarya offers direct peer-to-peer file sharing, eliminating the tedious process of uploading
            to servers and then downloading again. By connecting devices directly, your transfers are
            faster and more secure.
          </p>
        </div>
        <div className="space-y-1">
          <h1 className="font-medium text-[1.5rem]">Utilize full bandwidth</h1>
          <p>
            Zetarya uses TCP/IP under the hood for reliable data transfer and maximizes the use of the
            available bandwidth provided by your ISP. Say goodbye to slow transfers and move data in less
            time.
          </p>
        </div>
        <div className="space-y-1">
          <h1 className="font-medium text-[1.5rem]">No more file size limits</h1>
          <p>
            Because we don't store the data, there's no need for file size limits. Just share files of any size or
            whatever amount. As long as you keep an eye on your own data usage.
          </p>
        </div>
        <div className="space-y-1">
          <h1 className="font-medium text-[1.5rem]">Only the receiver can access your files</h1>
          <p>
            Your data is encrypted end-to-end using AES-256 encryption and can only be read by your
            receiver (and you). Zetarya also uses TLS 1.3 encryption while your data is in transit.
          </p>
        </div>
        <div className="space-y-1">
          <h1 className="font-medium text-[1.5rem]">Simple transfers at a glance</h1>
          <p>
            Zetarya makes transferring simple. After connecting with your peer, just select a file or
            folder and transfer with one click. No endless menus or confusing UI — just straightforward
            sharing.
          </p>
        </div>
        <div className="space-y-1">
          <h1 className="font-medium text-[1.5rem]">Low environmental impact</h1>
          <p>
            Because we don't store your data, we avoid the need for energy-hungry servers. By using
            Zetarya, you’ll have a much smaller carbon footprint than with traditional cloud storage
            providers.
          </p>
        </div>
      </div>


      <div className="space-y-1 pt-[10rem] ">
        <footer className="bg-[#171515] text-[#F5F5F7] py-8">
          <div className="flex flex-row justify-between h-[200px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="">
              <h2 className="mb-4">CONTACT US</h2>
              <p className="text-base lg:text-5xl mb-4 font-semibold">info@zetarya.com</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
              <div>
                <a href="https://docs.zetarya.com" className="text-sm hover:underline">Docs</a>
              </div>
              <div>
                <a href="/terms-and-privacy" className="text-sm hover:underline">Term & Privacy</a>
              </div>
              <div>
                <a href="/media-production-and-post-production" className="text-sm hover:underline">Blogs</a>
              </div>
              {/*<div>*/}
              {/*  <a href="/pricing" className="text-sm hover:underline">Pricing</a>*/}
              {/*</div>*/}
              <div>
                <a href="https://www.zero2.in" className="text-sm hover:underline">Company</a>
              </div>
              <div>
                <a href="/contact" className="text-sm hover:underline">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <p className="text-gray-700 bg-[#171515] w-full text-center pb-2">© zero2 All rights reserved</p>
    </div> 
  );
}
