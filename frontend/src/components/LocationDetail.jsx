import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../helpers/axios';
import React from 'react';
import Carousel from './Carousel';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { leafletLowZIndex, convertGPS } from '../helpers/leafletHelpers';

const classes = {
  wrapper: 'h-[80vh]',
  embla: 'overflow-hidden',
  emblaContainer: 'flex ',
  emblaSlide: 'group/item overflow-clip flex-[0_0_95%] border-r-white overflow-clip min-w-0 space-y-2 p-2 bg-yellow-50 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-8 h-[40vh]',
  title: 'p-4 text-emerald-800',
  name: '',
  scientific: 'italic',
  imageContainer: 'relative',
  image: "w-full rounded-xl border-emerald-950",
  mapContainer: "border-mint/99 border-2 rounded-md m-4 h-[95%]",
  locationImage: "h-full object-contain", 
  table: "bg-emerald-900 w-[95vw] p-8 mx-auto text-8 font-bold rounded-md [&>tbody>tr>td]:p-2 text-white [&>tbody>tr]:p-2 text-white" , 
  tableCell: 'p-6 text-white'
}


export default function LocationDetail () {
    const [location, setLocation] = useState(null);
    useEffect(() => {
      const id = window.location.href.split('/').at(-1);
      axiosInstance.get(`api/locations/${id}`)
      .then(res => {
        setLocation(res.data);
        const matchingPlant = axiosInstance.get(`api/plants/${res.data.plant}`);
        const locationPhotos = axiosInstance.get(`api/locations/images?location=${id}`)
        Promise.all([matchingPlant, locationPhotos])
        .then(values => {
          setLocation({...res.data, plant:values[0].data, photos:values[1].data});
      })
     
      
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
{        location.photos &&
        <Carousel>
          {[          
            <div className={classes.emblaSlide} key="map">
            {/* PostGis PointField has coordinates [lat, long], while leaflet needs [lng, lat]. Therefore, deepcopy must be made and coordinates reversed
            in: MapContainer (center), Marker */}
            <MapContainer className={classes.mapContainer} id="map smallmap" center={structuredClone(location.location.coordinates).reverse()} zoom={12} scrollWheelZoom={false} whenReady={leafletLowZIndex}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={structuredClone(location.location.coordinates).reverse()}/>
          </MapContainer>
          </div>, 

            ...location.photos.map(_ => {
            return (
              <div className={classes.emblaSlide} key={Math.floor(Math.random()*1000)}>
                <img className={classes.locationImage} src={_.image} alt="" />
              </div>
            )
          }),
          ]}
        </Carousel>
}  
        <table className={classes.table}>
          <caption>Details of the finding</caption>
          <tbody>
          <tr>
            <td>Name</td>
            <td>{location.plant.common_name_en}</td>
          </tr>
          <tr>
            <td>Coordinates</td>
            <td>{convertGPS(structuredClone(location.location.coordinates).reverse())}</td>
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
            <td>{new Date(location.created_at).toLocaleString('en-GB')}</td>
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
