// pages/privacy-policy.js
import Navbar from '@/components/ui/navbar-white';
import React from 'react';



const PrivacyPolicy = () => {
  return (
    <div className="flex justify-center align-center flex-col scroll-smooth">
        <div className="bg-white mx-auto">
            <Navbar />
        </div>
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4">Terms and Privacy</h1>
        <p className="text-lg text-gray-600 mb-8">Effective Date: December 19, 2024</p>

        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Terms of Use</h2>
            <p className="text-gray-700 mb-4">
            Please do carefully read the statement below before you start using this site. The permission to use this site depends upon your consent to the terms stated herein, and if you do not agree with these terms in full, you should leave this site immediately and cease to use any information that you may have obtained from this site.
            </p>
            <p className="text-gray-700">
                These terms also apply to the information posted on our official information channels on social networks and support forums, owned and under control of zero2<span className="text-xs align-top">&trade;</span>.
            </p>
        </section>

        {/* Add the remaining sections */}
        <section className='mb-12'>
            <h2 className='text-2xl font-bold mb-4'>Copyright and usage of the website content</h2>
            <p className='text-gray-700 mb-4'>
            The copyright and all other rights to the materials on this site belong to zero2<span className="text-xs align-top">&trade;</span>.
            </p>
            <p className='text-gray-700 mb-5'>
            You are entitled to view, download and reproduce any materials contained on this website solely for your internal use or personal information. When using information from this site you should:
            </p>
            <ul className='custom-list'>
                <li className='text-gray-700 mb-4'>
                leave all the respective original notices in place;
                </li>
                <li className='text-gray-700 mb-4'>
                utilize the images on the site only together with the surrounding text;
                </li>
                <li className='text-gray-700 mb-4'>
                include the following copyright notice: © zero2 All rights reserved.
                </li>
            </ul>
            <p className='text-gray-700 mb-4'>
            You are strictly prohibited to publish or use for any commercial purposes any materials from this website without prior written permission from zero2.
            </p>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
            <p className="text-gray-700 mb-4">
            The information contained on this website and other information channels under control of zero2 is for informational purposes only and does not imply warranty of any kind. We accept no responsibility of any kind for any direct, indirect, incidental, consequential or any other damages, which may result from reliance upon any information, omission, or material contained on this website or accessed through it.
            </p>
            <p className="text-gray-700 mb-4">
            Any statements about future releases, features, improvements or changes to zero2 products or services are based on the information available to zero2 as of the day such statements are made and are intended to outline general development plans. Such statements do not represent any commitment, guarantee or obligation on the side of zero2. zero2 does not assume warranty of any kind in relation to such statements and shall not be responsible for any consequences of your decisions made in reliance on this information.
            </p>
            <p className='text-gray-700 mb-4'>
            The information on this site and other information channels under control of zero2 can be updated, removed or changed without prior notice. zero2 does not guarantee that the information or this website is error-free.
            </p>
        </section>
        <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Pricing disclaimer</h2>
            <p className='text-gray-700 mb-4'>
            Prices indicated on this website are subject to change without prior notice from zero2. Request an official quote for the purpose of purchase processing. No refunds will be issued after the purchase of Zetarya services..
            </p>
        </section>
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Trademark</h2>
            <p className="text-gray-700 mb-4">
                Zetarya is prodct by zero2.
            </p>
            <p className="text-gray-700 mb-4">
                zero2 is registered trademark of Zeero Two Technova Pvt. Ltd.
            </p>
        </section>
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Intro</h2>
            <p className="text-gray-700 mb-4">
            Our Privacy Policy covers processing of all personal data that we may collect anytime you visit our website or purchase our products and services. “We” shall mean the companies, identified in Contact us section below.
            </p>
        </section>
        </div>
    </div>
  );
};

export default PrivacyPolicy;