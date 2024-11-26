"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const links = [
    {
      id: 1,
      link: "docs",
    },
    {
      id: 4,
      link: "company",
    },
    {
      id: 5,
      link: "contact",
    },
  ];

  useEffect(() => {
    if (nav) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [nav]);

  return (
      <>
        <div className="flex justify-between items-center max-w-[1280px] w-[90vw] h-20 text-white bg-black nav overflow-hidden">
          <div>
            <h1 className="text-5xl font-signature ml-2 w-[150px] md:w-[200px]">
              <a className="link-underline link-underline-black" href="/" rel="noreferrer">
                <svg width="auto" height="auto" viewBox="0 0 185 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M33.435 12.935C33.8256 13.3256 33.8272 13.9608 33.4176 14.3313C29.7496 17.65 24.9702 19.5 20 19.5C15.0298 19.5 10.2504 17.65 6.58236 14.3313C6.17282 13.9608 6.17445 13.3256 6.56497 12.935L9.8648 9.6352C10.2553 9.24467 10.8862 9.24789 11.3049 9.60807C13.7154 11.6818 16.7983 12.8333 20 12.8333C23.2017 12.8333 26.2846 11.6818 28.6951 9.60808C29.1138 9.2479 29.7447 9.24467 30.1352 9.6352L33.435 12.935Z" fill="#BB254A" />
                  <path d="M33.435 27.065C33.8256 26.6744 33.8272 26.0392 33.4176 25.6687C29.7496 22.35 24.9702 20.5 20 20.5C15.0298 20.5 10.2504 22.35 6.58236 25.6687C6.17282 26.0392 6.17445 26.6744 6.56497 27.065L9.8648 30.3648C10.2553 30.7553 10.8862 30.7521 11.3049 30.3919C13.7154 28.3182 16.7983 27.1667 20 27.1667C23.2017 27.1667 26.2846 28.3182 28.6951 30.3919C29.1138 30.7521 29.7447 30.7553 30.1352 30.3648L33.435 27.065Z" fill="#BB254A" />
                  <path d="M64.0706 14.88L54.0106 25.12H64.0706V30H46.9906V25.12L57.0506 14.88H46.9906V10H64.0706V14.88ZM76.3953 30.52C74.5553 30.52 72.8753 30.0467 71.3553 29.1C69.8486 28.1533 68.642 26.8867 67.7353 25.3C66.842 23.7 66.3953 21.9267 66.3953 19.98C66.3953 18.0467 66.842 16.28 67.7353 14.68C68.642 13.08 69.8486 11.8067 71.3553 10.86C72.8753 9.91333 74.5553 9.44 76.3953 9.44C77.9553 9.44 79.382 9.77333 80.6753 10.44C81.9686 11.0933 83.0686 11.9933 83.9753 13.14C84.8953 14.2733 85.5553 15.5733 85.9553 17.04C86.3686 18.5067 86.4686 20.0467 86.2553 21.66H71.6353C71.902 22.78 72.4486 23.72 73.2753 24.48C74.102 25.24 75.142 25.6267 76.3953 25.64C77.2353 25.64 78.0086 25.4333 78.7153 25.02C79.422 24.6067 80.0086 24.04 80.4753 23.32L85.4553 24.48C84.642 26.2533 83.4286 27.7067 81.8153 28.84C80.202 29.96 78.3953 30.52 76.3953 30.52ZM71.4753 18H81.3153C81.0753 16.8 80.4953 15.7867 79.5753 14.96C78.6686 14.12 77.6086 13.7 76.3953 13.7C75.182 13.7 74.122 14.1133 73.2153 14.94C72.322 15.7667 71.742 16.7867 71.4753 18ZM100.268 14.88H96.3884V30H91.5084V14.88H88.5484V10H91.5084V3.72H96.3884V10H100.268V14.88ZM118.535 10H123.415V30H118.535L118.315 27.52C117.755 28.4267 117.028 29.1533 116.135 29.7C115.241 30.2467 114.181 30.52 112.955 30.52C111.475 30.52 110.088 30.2467 108.795 29.7C107.501 29.14 106.361 28.3667 105.375 27.38C104.401 26.3933 103.635 25.2533 103.075 23.96C102.528 22.6533 102.255 21.26 102.255 19.78C102.255 17.8733 102.715 16.14 103.635 14.58C104.555 13.02 105.788 11.7733 107.335 10.84C108.895 9.90667 110.628 9.44 112.535 9.44C113.868 9.44 115.055 9.73333 116.095 10.32C117.135 10.9067 118.021 11.6533 118.755 12.56L118.535 10ZM112.835 25.82C113.875 25.82 114.795 25.56 115.595 25.04C116.395 24.52 117.021 23.82 117.475 22.94C117.928 22.06 118.155 21.08 118.155 20C118.155 18.92 117.921 17.94 117.455 17.06C117.001 16.18 116.375 15.48 115.575 14.96C114.775 14.4267 113.861 14.16 112.835 14.16C111.795 14.16 110.855 14.4267 110.015 14.96C109.175 15.48 108.501 16.18 107.995 17.06C107.501 17.94 107.255 18.92 107.255 20C107.255 21.08 107.508 22.06 108.015 22.94C108.521 23.82 109.195 24.52 110.035 25.04C110.888 25.56 111.821 25.82 112.835 25.82ZM127.42 30L127.4 10H132.28L132.3 11.78C132.98 11.06 133.793 10.4933 134.74 10.08C135.687 9.65333 136.707 9.44 137.8 9.44C138.533 9.44 139.267 9.54667 140 9.76L138.08 14.68C137.573 14.48 137.067 14.38 136.56 14.38C135.373 14.38 134.367 14.8 133.54 15.64C132.713 16.4667 132.3 17.4667 132.3 18.64V30H127.42ZM155.886 10H161.066L150.126 40H144.946L148.566 30L141.366 10H146.706L151.006 23.32L155.886 10ZM178.144 10H183.024V30H178.144L177.924 27.52C177.364 28.4267 176.637 29.1533 175.744 29.7C174.851 30.2467 173.791 30.52 172.564 30.52C171.084 30.52 169.697 30.2467 168.404 29.7C167.111 29.14 165.971 28.3667 164.984 27.38C164.011 26.3933 163.244 25.2533 162.684 23.96C162.137 22.6533 161.864 21.26 161.864 19.78C161.864 17.8733 162.324 16.14 163.244 14.58C164.164 13.02 165.397 11.7733 166.944 10.84C168.504 9.90667 170.237 9.44 172.144 9.44C173.477 9.44 174.664 9.73333 175.704 10.32C176.744 10.9067 177.631 11.6533 178.364 12.56L178.144 10ZM172.444 25.82C173.484 25.82 174.404 25.56 175.204 25.04C176.004 24.52 176.631 23.82 177.084 22.94C177.537 22.06 177.764 21.08 177.764 20C177.764 18.92 177.531 17.94 177.064 17.06C176.611 16.18 175.984 15.48 175.184 14.96C174.384 14.4267 173.471 14.16 172.444 14.16C171.404 14.16 170.464 14.4267 169.624 14.96C168.784 15.48 168.111 16.18 167.604 17.06C167.111 17.94 166.864 18.92 166.864 20C166.864 21.08 167.117 22.06 167.624 22.94C168.131 23.82 168.804 24.52 169.644 25.04C170.497 25.56 171.431 25.82 172.444 25.82Z" fill="#F5F5F5" />
                </svg>
              </a>
            </h1>
          </div>

          <ul className="hidden md:flex">
            {links.map(({ id, link }) => (
                <li
                    key={id}
                    className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline"
                >
                  <Link href={link === "company" ? "https://www.zero2.in" : link === "docs" ? "https://docs.zetarya.com" : link}>{link}</Link>
                </li>
            ))}
          </ul>

          <div
              onClick={() => setNav(!nav)}
              className="cursor-pointer pr-4 z-20 text-gray-500 md:hidden"
          >
            {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
          </div>

          {nav && (
              <ul className="flex z-10 flex-col justify-center items-center absolute overflow-hidden top-0 left-0 w-screen h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
                {links.map(({ id, link }) => (
                    <li
                        key={id}
                        className="px-4 cursor-pointer capitalize py-6 text-4xl"
                    >
                      <Link onClick={() => setNav(!nav)} href={link === "company" ? "https://www.zero2.in" : link === "docs" ? "https://docs.zetarya.com" : link}>
                        {link}
                      </Link>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </>
  );
};

export default Navbar;
