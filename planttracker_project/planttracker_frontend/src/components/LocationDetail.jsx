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


export default function LocationDetail () {
    const [emblaRef, emblaApi] = useEmblaCarousel();
    const [location, setLocation] = useState(null);

    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])
    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])
    

    useEffect(() => {
      const id = window.location.pathname.replace('locations', '').replaceAll('/', '');
      axiosInstance.get(`locations/${id}`)
      .then(res => {
        setLocation(res.data);
        console.log(res.data);
        const matchingPlant = axiosInstance.get(`plants/${res.data.plant}`);
        const locationPhotos = axiosInstance.get(`locations/images?location=${id}`)
        Promise.all([matchingPlant, locationPhotos])
        .then(values => {
          setLocation({...res.data, plant:values[0].data});
          console.log(location)
        })

        


        .then(res => {
          console.log(res.data);

        }

        )
      
      
      })

      .catch(err => {
        console.error(err);
      })
    }, [])
;

    
    return (
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Location detail</h2>
        {location &&
        <>
        <table>
          <tbody>
          <tr>
            <td>Name</td>
            <td>{location.plant.common_name_en} ({location.plant.scientific_name})</td>
          </tr>
          <tr>
            <td>Coordinates</td>
            <td>{location.location.coordinates}</td>
          </tr>
          <tr>
            <td>Surface</td>
            <td>{location.area} m²</td>
          </tr>
          <tr>
            <td>Comment</td>
            <td>{location.description}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>{location.created_at}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
        </>
        }
      


      </div>
    );
  }

// id, plant, location.coordinates, area, description, created_at

