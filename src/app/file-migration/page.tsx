import Navbar from "@/components/ui/navbar"
import Image from "next/image"
import cover from "./cover.jpg"

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
              <h1 className="text-4xl text-gray-500 font-bold mb-4">File Migration</h1>
              <div className="text-lg leading-7 text-gray-200">
                <p className="mb-4">
                In the rapidly advancing field of genomics, the ability to efficiently share and distribute massive datasets across research institutions and computing centers is crucial for enabling collaborative research and driving groundbreaking discoveries. Genomic datasets, such as whole-genome sequences and molecular data, can be incredibly large and complex, making traditional data sharing methods impractical.
                </p>
                <p className="mb-4">
                A single human genome contains over 3 billion base pairs, which when stored in a raw text format, can be over 100 gigabytes in size. When you consider that genomic research often involves analyzing hundreds or even thousands of genomes, along with associated molecular data like RNA sequences and protein interactions, the data quickly scales to terabytes or even petabytes.
                </p>
                <p className="mb-4">
                To enable researchers to collaborate effectively on such vast datasets, specialized data transfer and distribution solutions are essential. These solutions must be able to efficiently transfer the massive files over research networks or the Internet, while also ensuring data integrity and security. They need to integrate with the unique file formats and metadata standards used in genomics.
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
