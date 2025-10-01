"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import "./globals.css"

import banner from "@/statics/img.png"
import bannerMobile from "@/statics/img.png"


import Navbar from "@/components/ui/navbar"
import { Cover } from "@/components/ui/cover";

export default function Home() {

    const handleDownload = useCallback(() => {
        setTimeout(() => {
            const link = document.createElement("a");
            link.href = "/download/zetarya_0.1.0_aarch64.pkg"; // path inside public/
            link.download = "zetarya_0.1.0_aarch64.pkg";
            link.click();
        }, 1000); // 2 seconds delay
    }, []);

  return (
    <div className="bg-white flex justify-center align-center flex-col scroll-smooth overflow-hidden">
      <script defer src="https://cloud.umami.is/script.js" data-website-id="520e5182-eaf4-4ed3-9907-598c58f7ba2c"></script>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <div className="mx-auto z-1">
        <Navbar />
      </div>
      <div className="relative overflow-hidden">
        <div className="flex max-w-[1280px] w-[90vw] mx-auto pt-[2rem] lg:pt-[3rem] justify-center items-center flex-col relative z-10">
          <div className="main">
              <div className="text-center text-black font-semibold">
                  <h1 className="text-2xl lg:text-[4rem] lg:leading-[5rem]">Direct data transfer across</h1>
                  <h1 className="text-2xl lg:text-[4rem] lg:leading-[5rem]">
                      globe upto <Cover >1 Gbps</Cover>
                  </h1>
              </div>
            <div className="flex mt-5 h-[100px] justify-center">
              <span
                  onClick={handleDownload}
                  className="bg-black cursor-pointer w-[350px] h-[50px] rounded-[10px] text-[18px] text-white mt-[22px] font-semibold flex items-center justify-center gap-3
                  transition-all duration-300 ease-in-out
               hover:ring-2 hover:ring-black
      hover:ring-offset-4"
              >
                  <svg className="w-6 h-5" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 814 1000">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" fill="currentColor"></path>
                  </svg>
                <h1>
                    Download for macOS
                </h1>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center align-center max-w-[1280px] w-[90vw] mx-auto pt-20 lg:pt-[3rem]">
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
              <h1 className="font-medium text-[1.5rem]">Military Grade Security</h1>
              <p>
                  Your data is encrypted end-to-end using AES-256 encryption and can only be read by your
                  receiver (and you). Zetarya also uses TLS 1.3 encryption while your data is in transit.
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
                <p className="text-base lg:text-xl mb-4 font-semibold">+91 9119334720</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
              <div>
                <a href="https://docs.zetarya.com" className="text-sm hover:underline">Docs</a>
              </div>
              <div>
                <a href="/terms-and-privacy" className="text-sm hover:underline">Term & Privacy</a>
              </div>
              {/*<div>*/}
              {/*  <a href="/blogs" className="text-sm hover:underline">Blogs</a>*/}
              {/*</div>*/}
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
      </div>
      <p className="text-gray-700 bg-[#171515] w-full text-center pb-2">© zero2 All rights reserved</p>
    </div> 
  );
}
