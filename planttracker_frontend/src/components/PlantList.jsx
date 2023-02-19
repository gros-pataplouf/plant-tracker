export default function PlantList (props) {
    const {plants} = props;
    return (
      <div>
        <div>
            <h2>Discover those invasive plant species</h2>
            <h6>Filter by tag</h6>
        </div>
        <div>
            {!plants || plants.length <= 0? (
                <h4>No plant info available</h4> ) : (
                    plants.map(plant => (
                        <div key={plant.pk}>
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

