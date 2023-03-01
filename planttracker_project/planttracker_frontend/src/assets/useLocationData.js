import { useState, useEffect} from 'react'

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    const crd = pos.coords;
    return crd;
  

  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  

export async function getPosition(){
    return new Promise((resolve, reject) => {
        const coords =
        navigator.geolocation.getCurrentPosition(success, error, options);
        if (!coords) {
            reject("no coords available") } 
        resolve(coords => console.log(coords))
        
        })
    }
    




function useLocationData() {
    const [data, setData] = useState(null);

    useEffect(() => {
        getPosition()
        .then(coords => console.log(coords))
    
        
    }, [location]);

    return data;
}

export default useLocationData;




