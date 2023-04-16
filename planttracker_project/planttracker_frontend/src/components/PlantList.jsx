import { useState, useEffect } from 'react';
import { axiosInstance } from '../helpers/axios';



export default function PlantList () {
    const [plantList, setPlantList] = useState([]);
    
    useEffect(() => {axiosInstance.get('plants/')
      .then(res => setPlantList(res.data))
      .catch(err => {
        console.error(err);
      })
    }, [])
;

    
    return (
      <div>
        <div>
            <h2>Discover those invasive plant species</h2>
            <h6>Filter by tag</h6>
        </div>
        <div>
            {!plantList || plantList.length <= 0? (
                <h4>No plant info available</h4> ) : (
                    plantList.map(plant => (
                        <div key={plant.id}>
                            <div>
                                <h3>{plant.common_name_en}</h3>
                                <p>{plant.scientific_name}</p>
                                <p>{plant.description_en}</p>
                            </div>
                            <div>
                                <img src={plant.photo} alt="" /> 
                                {/* comment gérer les tags et les guillements */}
                            </div>
                        </div>
                    ) 
                ))}
        </div>
      </div>
    );
  }

