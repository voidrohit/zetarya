"use client";
import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { BackgroundBeams } from "@/components/ui/background-beams";

import Navbar from "@/components/ui/navbar";

const ContactInfo: React.FC = () => {
    return (
        <div className="bg-white flex justify-center align-center flex-col scroll-smooth">
            <div className="mx-auto z-10">
                <Navbar/>
            </div>
            <div
                className="h-[80vh] w-full rounded-md bg-white relative flex flex-col items-center justify-center z-0 antialiased">
                <div className="max-w-2xl mx-auto p-4">
                    <h1 className="relative z-10 text-xl md:text-5xl  bg-clip-text text-transparent bg-black text-center font-sans font-bold">
                        Our teams are here to help
                    </h1>
                    <p></p>
                    <p className="text-neutral-500 max-w-l mx-auto my-2 text-lg text-center relative z-10">
                        Questions, bug reports, feedback — we’re here for it all.

                    </p>
                    <p className="text-neutral-500 max-w-l mx-auto my-2 text-lg text-center relative z-10">
                        <a href="mailto:info@zetarya.com" className="underline ml-1">info@zetarya.com</a>.
                    </p>
                </div>
                <BackgroundBeams/>
            </div>
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
                        {/*    <a href="/blogs" className="text-sm hover:underline">Blogs</a>*/}
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
            <p className="text-gray-700 bg-[#171515] w-full text-center pb-2">© zero2 All rights reserved</p>
        </div>
    );
};

export default ContactInfo;
