import { useState, useEffect } from "react";
import leaf from '../assets/icons/leaf.svg';

const classes = {
    text: 'p-8', 
    wrapper: 'absolute h-[80vh]',
    loadingAnimation: 'fixed top-0 h-[100vh] w-[100vw] z-30 bg-emerald-950 flex flex-col justify-center space-8 align-center', 
    loadingTitle: 'text-yellow-100 text-center loadingHero',
    image: 'm-auto h-20'

}

export default function Hero() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 20000);
    }, []);
  
    return (
        loading ? <div className={classes.loadingAnimation}>
            <h2 className={classes.loadingTitle}>Planttracker App</h2>
            <h3 className={classes.loadingTitle}>A citizen science project</h3>
            <div className={classes.loadingTitle}>
                <img src={leaf} className={classes.image} alt="" />
                

            </div>
        </div> 
        :
    
    <div className={classes.wrapper}>
        

                <div>
                <h3>Why the planttracker app</h3>
                <p>Citizen scientists can play a vital role in managing invasive plant species by using the planttracker app to inventory their distribution and abundance. Invasive species can have severe ecological impacts on native ecosystems, and having accurate information about their distribution is critical to managing them effectively.

        The planttracker app allows citizen scientists to easily collect and share information about the location and abundance of invasive plant species. This includes uploading photos and location data of invasive plants, which can then be used to create distribution maps and track changes over time. By using citizen scientists to inventory invasive plant species, a much larger area can be covered than would be possible with only professional scientists.

                    Involving citizen scientists in the inventory process can also raise public awareness about the issue of invasive species. Through participation, citizens can learn about the impact of invasive species on native ecosystems and become more invested in efforts to manage them. Additionally, the planttracker app can help prioritize management efforts by identifying areas where invasive species are most abundant or where native ecosystems are at high risk of invasion.</p>
                </div>
    </div>)
}