"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sliderData = [
  {
    id: "slide1",
    title: "Master TOEIC Listening",
    content:
      "Enhance your listening skills with our comprehensive audio exercises and practice tests.",
    image: "/images/banner1.jpeg",
  },
  {
    id: "slide2",
    title: "Excel in TOEIC Reading",
    content:
      "Improve your reading comprehension with our extensive collection of practice materials.",
    image: "/images/banner.jpg",
  },
  {
    id: "slide3",
    title: "Boost Your TOEIC Speaking",
    content:
      "Enhance your English speaking abilities with our TOEIC-focused conversation practice sessions.",
    image: "/images/banner2.jpg",
  },
  {
    id: "slide4",
    title: "Perfect Your TOEIC Writing",
    content:
      "Develop your writing skills with our guided exercises and personalized feedback.",
    image: "/images/banner3.jpg",
  },
];

export default function ToeicBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderData.length) % sliderData.length
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {sliderData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${slide.image}')` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            aria-hidden="true"
          />
          <div className="relative h-full px-4 md:px-6 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white mb-4">
              {slide.title}
            </h2>
            <p className="max-w-[600px] text-gray-200 md:text-xl mb-8">
              {slide.content}
            </p>
          </div>
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 text-white hover:bg-black/75"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 text-white hover:bg-black/75"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex justify-center gap-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
