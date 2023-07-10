import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import chevron_left from "../../assets/icons/chevron_left.svg";
import chevron_right from "../../assets/icons/chevron_right.svg";

export default function Carousel({ children }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative md:overflow-hidden">
      {/* the previous and next buttons are only shown if more than 1 children */}
      {children.length > 1 && (
        <button
          className="absolute z-10 rounded-full bg-slate-500/80 top-1/2 -left-6 md:left-0"
          onClick={scrollPrev}
        >
          <img src={chevron_left} alt="forward" />
        </button>
      )}
      {children.length > 1 && (
        <button
          className="absolute z-10 rounded-full bg-slate-500/80 top-1/2 -right-6 md:right-0"
          onClick={scrollNext}
        >
          <img src={chevron_right} alt="back" />
        </button>
      )}
      <div ref={emblaRef}>
        <div id="emblaContainer" className="flex">
          {children}
        </div>
      </div>
    </div>
  );
}
