import axios from "axios";
import { API_OSM_NOMINATIM } from "../constants";
import { debounce } from "../helpers/utils";
import { useState } from "react";


// https://nominatim.openstreetmap.org/search?q=Klosterstrasse Neumünster&limit=2&format=json


export default function SearchField({props}) {
    const {position, setPosition} = props;

    const [results, setResults] = useState([]);
    function inputHandler() {
        const input = document.querySelector("#inputfield")
        const url = `${API_OSM_NOMINATIM}?q=${input.value}&limit=5&format=json`;
        axios.get(url)
        .then(res => {
            setResults(res.data);

        })
        .catch(e => console.log(e))}
    function clickHandler() {


    }

    return (
        <>
        <input id="inputfield" onInput={debounce(inputHandler)}/>
        {results.map(
                _ => {return <div key={_.place_id} onClick={clickHandler}>{_.display_name}</div>}
            )}
   
        </>

    )
}