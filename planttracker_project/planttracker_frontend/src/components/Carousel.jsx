import { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import chevron_right from '../assets/icons/chevron_right.svg';
import chevron_left from '../assets/icons/chevron_left.svg';

const classes = {
  embla: 'relative',
  emblaContainer: 'flex ',
  chevronLeft: 'bg-slate-500/80 absolute rounded-[50%] top-[50%] -left-6 z-10',
  chevronRight: 'bg-slate-500/80 absolute rounded-[50%] top-[50%] -right-6 z-10',
}

export default function Carousel({children}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true});

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])


  return (
    <div className={classes.embla}>
    <button className={classes.chevronLeft} onClick={scrollPrev}>
      <img src={chevron_left} alt="forward" />
    </button>
    <button className={classes.chevronRight} onClick={scrollNext}>
      <img src={chevron_right} alt="back" />
    </button>
    <div  ref={emblaRef}>
    <div id="emblaContainer" className={classes.emblaContainer}>
      {children}
    </div>
    </div>
    </div>
  )
}