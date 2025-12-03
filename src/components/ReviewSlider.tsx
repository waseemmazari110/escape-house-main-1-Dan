"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  property?: string;
  image?: string;
}

interface ReviewSliderProps {
  reviews: Review[];
  isLoading?: boolean;
}

export default function ReviewSlider({ reviews, isLoading = false }: ReviewSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Responsive slides to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2); // Tablet: 2 cards
      } else {
        setSlidesToShow(3); // Desktop: 3 cards
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, reviews.length - slidesToShow);

  useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const cardWidth = 100 / slidesToShow;

  return (
    <div className="relative px-12 sm:px-4">
      <div className="overflow-hidden rounded-xl sm:rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * cardWidth}%)` }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-2 sm:px-3"
              style={{ width: `${cardWidth}%` }}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md h-full">
                {/* Quote Icon */}
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mb-2 sm:mb-3 md:mb-4 opacity-20"
                  fill="var(--color-accent-gold)"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>

                {/* Stars */}
                <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3 md:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                        i < review.rating
                          ? "fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm md:text-base text-[var(--color-neutral-dark)] mb-3 sm:mb-4 md:mb-6 line-clamp-4 leading-relaxed">
                  {review.comment}
                </p>

                {/* Reviewer Info */}
                <div className="pt-2 sm:pt-3 md:pt-4 border-t border-[var(--color-bg-secondary)] flex items-center gap-2 sm:gap-3 md:gap-4">
                  {review.image && (
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-[var(--color-text-primary)] truncate">{review.name}</p>
                    {review.property && (
                      <p className="text-xs sm:text-sm text-[var(--color-neutral-dark)] truncate">{review.property}</p>
                    )}
                    <p className="text-xs text-[var(--color-neutral-dark)] mt-0.5 sm:mt-1 truncate">{review.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {maxIndex > 0 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[var(--color-accent-sage)] hover:text-white transition-all duration-200 hover:scale-110 z-10 border border-gray-200"
            aria-label="Previous reviews"
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[var(--color-accent-sage)] hover:text-white transition-all duration-200 hover:scale-110 z-10 border border-gray-200"
            aria-label="Next reviews"
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 md:mt-8">
          {[...Array(maxIndex + 1)].map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "w-5 sm:w-6 md:w-8 bg-[var(--color-accent-sage)]"
                  : "w-1.5 sm:w-2 bg-[var(--color-bg-secondary)]"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}



