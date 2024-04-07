import Navbar from "@/components/ui/navbar"
import Image from "next/image"
import cover from "./cover.jpeg"

export default function Blog () {
    return (
        <div className="bg-black flex justify-center align-center flex-col scroll-smooth">
            <div className="mx-auto">
                <Navbar />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-700 rounded-lg">
            <Image
              src={cover}
              alt="Cover"
              className="w-full rounded-lg"
              width={500}
              height={500}
            />
            <div className="px-4 py-6 sm:px-6">
              <h1 className="text-4xl text-gray-500 font-bold mb-4">Media Production and Post Production</h1>
              <div className="text-lg leading-7 text-gray-200">
                <p className="mb-4">
                  The ability to quickly and
                  reliably transfer large video files, raw footage, and other multimedia content
                  between production studios, post-production facilities, and distribution networks
                  is crucial. Production teams are often working on tight deadlines and collaborating
                  across multiple locations, so having an efficient file transfer solution in place
                  is essential to keep projects on track.
                </p>
                <p className="mb-4">
                  The file sizes involved in professional media production can be enormous - a single raw video file could be hundreds of gigabytes. Trying to transfer such large files via traditional methods like FTP or shipping hard drives is slow and cumbersome. Zetarya transfer solution allow these huge files to be sent overthe Internet or wide area network much faster,  enabling seamless collaboration between teams. Unlike other transfering tools sending lots of small files faster is much easier with zetarya.
                </p>
                <p className="mb-4">
                  As soon as filming is complete, the raw footage needs to be sent from the set to the post-production editors who may be located across the country or even the globe. The editors need to receive the files as quickly as possible so they can begin their work. Once post-production is complete, the finished files then need to be delivered to the distribution networks, either for streaming services or traditional broadcasts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
            </div>
            </div>
    )
}
