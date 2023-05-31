import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../helpers/axios';
import { resizeTiles } from '../helpers/utils';
import React from 'react';
import Carousel from './Carousel';

const classes = {
  wrapper: '',
  emblaSlide: 'emblaSlide relative border-b-8 border-white h-auto flex-[0_0_95%] min-w-0 pb-4 space-y-2 p-2 bg-yellow-50 overflow-hidden rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-4',
  title: 'pt-6 ml-2 text-emerald-800',
  name: '',
  scientific: 'italic',
  image: "w-full rounded-xl",
  link: 'font-bold text-emerald-800 italic active:text-emerald-950 active:underline',
  description: 'overflow-hidden',
  readMore: 'absolute right-0 font-bold bottom-0 rounded-full p-2 z-10 text-emerald-800 bg-white'
}





export default function PlantList () {
    const [plantList, setPlantList] = useState(false);
    const [plantImages, setPlantImages] = useState([]);



    useEffect(() => {
      const plantDataPromise = axiosInstance.get('api/plants/');
      const plantImagesPromise = axiosInstance.get('api/plants/images/')
      Promise.all([plantDataPromise, plantImagesPromise]).then(values => {
        setPlantList(values[0].data);
        setPlantImages(values[1].data);
        resizeTiles();
      })
      .catch(err => console.error(err))
 
    }, []);

    
    return (
      <div className={classes.wrapper} id='wrapper'>
        <h2 className={classes.title} id='title'>Invasive plants</h2>
        <Carousel>
            { !plantList ? (
                <h4>No plant info available</h4> ) : (
                  plantList.map(plant => (
                    <div key={plant.id} id='emblaSlide' className={classes.emblaSlide}>
                            <h3>{plant.common_name_en}</h3>
                            <p className={classes.scientific}>{plant.scientific_name}</p>
                            <img className={classes.image} src={
                              // if no image for this plant is found, show default image
                              plantImages.filter(img => img.plant === plant.id && img.type === "main")[0] ?
                              plantImages.filter(img => img.plant === plant.id && img.type === "main")[0].image :
                              plantImages.filter(img => img.type === "default")[0].image
                              } alt=""/>
                            <Link to={`${plant.id}/`} className={classes.readMore}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M453 776h60V610h167v-60H513V376h-60v174H280v60h173v166Zm27.266 200q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" stroke="#065f46" strokeWidth='50' /></svg>
                            </Link>
                            <p className={classes.description} id='description'>{plant.description_en}<Link className={classes.link} to={"/plants/" + plant.id}>Read more</Link></p>
                        </div>
                ) 
            )
          )}
          </Carousel>
        </div>

    );
  }