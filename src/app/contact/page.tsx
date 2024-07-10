"use client";
import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { BackgroundBeams } from "@/components/ui/background-beams";

import Navbar from "@/components/ui/navbar";

const ContactInfo: React.FC = () => {
  return (
      <div className="bg-black flex justify-center align-center flex-col scroll-smooth">
          <div className="mx-auto z-10">
              <Navbar/>
          </div>
          <div
              className="h-[80vh] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
              <div className="max-w-2xl mx-auto p-4">
                  <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
                      Send us an email
                  </h1>
                  <p></p>
                  <p className="text-neutral-500 max-w-l mx-auto my-2 text-lg text-center relative z-10">
                      For more information on the services we provide, please contact us at
                      <a href="mailto:business@zetarya.com" className="underline ml-1">business@zetarya.com</a>.
                  </p>
                  <p className="text-neutral-500 max-w-l mx-auto my-2 text-lg text-center relative z-10">
                      For sales inquiries, please contact us at <a href="mailto:sales@zetarya.com"
                                                                   className="underline ml-1">sales@zetarya.com</a>.
                  </p>
              </div>
              <BackgroundBeams/>
          </div>
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
};

export default ContactInfo;
