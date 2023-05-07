import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../helpers/axios';
import { resizeTiles } from '../helpers/utils';
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import chevron_right from '../assets/icons/chevron_right.svg';
import chevron_left from '../assets/icons/chevron_left.svg';


const classes = {
  wrapper: '',
  embla: '',
  emblaContainer: 'flex ',
  emblaSlide: 'emblaSlide relative border-b-8 border-white group/item h-auto flex-[0_0_95%] min-w-0 pb-4 space-y-2 p-2 bg-yellow-50 overflow-hidden rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-4',
  title: 'pt-6 ml-2 text-emerald-800',
  name: '',
  scientific: 'italic',
  imageContainer: 'relative',
  chevronLeft: 'group-first/item:hidden bg-slate-500/80 absolute rounded-[50%] top-[calc(50%-24px)] -left-6',
  chevronRight: 'group-last/item:hidden bg-slate-500/80 absolute rounded-[50%] top-[calc(50%-24px)] -right-6',
  image: "w-full rounded-xl",
  link: 'font-bold text-emerald-800 italic active:text-emerald-950 active:underline',
  description: 'overflow-hidden',
  readMore: 'absolute right-0 font-bold bottom-0 rounded-full p-2 z-10 text-emerald-800 bg-white'
}


export default function Carousel (props) {
    const [emblaRef, emblaApi] = useEmblaCarousel();
    const [plantList, setPlantList] = useState(false);
    const [plantImages, setPlantImages] = useState([]);

    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])
  
    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])
  


    
    return (

                  plantList.map(plant => (
                    <div key={plant.id} id='emblaSlide' className={classes.emblaSlide}>
                            <div className={classes.imageContainer}>
                              <button className={classes.chevronLeft} onClick={scrollPrev}>
                                <img src={chevron_left} alt="" />
                              </button>
                              <button className={classes.chevronRight} onClick={scrollNext}>
                                <img src={chevron_right} alt="" />
                              </button>
                              <img className={classes.image} src={plantImages.filter(img => img.plant === plant.id)[0].image} alt=""/>
                            </div>
                        </div>
                ) 
            )
          )}
  