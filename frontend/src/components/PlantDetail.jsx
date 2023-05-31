import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../helpers/axios';
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import chevron_right from '../assets/icons/chevron_right.svg';
import chevron_left from '../assets/icons/chevron_left.svg';
const classes = {
  wrapper: 'h-[80vh]',
  embla: 'overflow-hidden',
  emblaContainer: 'flex ',
  emblaSlide: 'group/item overflow-clip flex-[0_0_95%] border-r-white overflow-clip min-w-0 space-y-2 p-2 bg-yellow-50 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-8',
  title: 'px-2 text-emerald-800',
  name: '',
  scientific: 'italic',
  imageContainer: 'relative',
  chevronLeft: 'group-first/item:hidden bg-slate-500/80 absolute rounded-[50%] top-[calc(50%-24px)] -left-6',
  chevronRight: 'group-last/item:hidden bg-slate-500/80 absolute rounded-[50%] top-[calc(50%-24px)] -right-6',
  image: "w-full rounded-xl border-emerald-950"

}



export default function PlantList () {
    const [emblaRef, emblaApi] = useEmblaCarousel();
    const [plantList, setPlantList] = useState([]);

    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])
  
    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])
  

    useEffect(() => {axiosInstance.get('api/plants/')
      .then(res => setPlantList(res.data))
      .catch(err => {
        console.error(err);
      })
    }, [])
;

    
    return (
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Plant detail</h2>
        <div className={classes.embla}>
        <div  ref={emblaRef}>

        <div className={classes.emblaContainer}>
            {!plantList || plantList.length <= 0? (
                <h4>No plant info available</h4> ) : (
                
                  
                  plantList.map(plant => (
                    <div key={plant.id} className={classes.emblaSlide}>

                            <h3>{plant.common_name_en}</h3>
                            <p className={classes.scientific}>{plant.scientific_name}</p>
                            <div className={classes.imageContainer}>
                              <button className={classes.chevronLeft} onClick={scrollPrev}>
                                <img src={chevron_left} alt="" />
                              </button>
                              <button className={classes.chevronRight} onClick={scrollNext}>
                                <img src={chevron_right} alt="" />
                              </button>
                              <img className={classes.image} src={plant.photo} alt=""/>
                            </div>
                            <p>{plant.description_en}</p>

                        </div>
        
                ) 
            )
            
            )}
        </div>

      </div>


      </div>
      </div>
    );
  }

