import React, { Component } from "react";
import PlantList from "./PlantList";

import axios from "axios";

import { API_URL_PLANTS } from "../constants";

class Home extends Component {
    state = {
      plants: []
    };


  componentDidMount() {
    this.resetState();
  }
  getPlants = () => {
    axios.get(API_URL_PLANTS).then(res => this.setState({ plants: res.data }));
  };

  resetState = () => {
    this.getPlants();
  };

  render() {
    return (
            <PlantList
              plants={this.state.plants}
              resetState={this.resetState}
            />
    );
  }


}

export default Home;