import PlantList from "./PlantList";
import axios from "axios";
import { useState, useEffect } from 'react';
import { API_URL_PLANTS } from "../constants";

export default function  Home()  {
  const [plantList, setPlantList] = useState([]);
  useEffect(() => {axios.get(API_URL_PLANTS).then(res => setPlantList(res.data)) }, plantList);


    return (
            <PlantList
              plants={plantList}
            />
    );


}
