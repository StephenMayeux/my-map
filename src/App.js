import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import Nav from './Components/Nav'

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      venues: [],
      allMarkers: []
    }

    this.initMap = this.initMap.bind(this);
    this.getVenues = this.getVenues.bind(this);
  }

  componentDidMount() {
    this.getVenues();
  }

  // load map script
  loadMap() {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBDJfK_ZPEMHqgURHbksiFGt46JIW6wv0Y&callback=initMap")
    window.initMap = this.initMap;
    // handels console error for multipul api request
    window.google = {}
  }

  // create a google map
  initMap() {

    // created popup Window
    let infowindow = new window.google.maps.InfoWindow();
    let bounds = new window.google.maps.LatLngBounds();

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.165691, lng: -10.451526},
      zoom: 13
    });

    const allMarkers = [];

    // display venues on map (dynamic markers)
      this.state.venues.forEach(myVenue => {
        // display venue name in info window
        let contentString = `${myVenue.venue.name}`;
        // created a marker
        let marker = new window.google.maps.Marker({
          position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
          map: map,
          animation: window.google.maps.Animation.DROP,
          title: myVenue.venue.name,
          id: myVenue.venue.id
        });

        // click on marker to display info window
        marker.addListener('click', function(event) {
          console.log('click event?', event);
          // change the content
          infowindow.setContent(contentString);
          // open info window
          infowindow.open(map, marker);
        });
        // Extend boundry on map for each marker
        bounds.extend(marker.position);
        allMarkers.push(marker);
      })
      // fit map to boundry
      map.fitBounds(bounds);
      this.setState({ allMarkers });
  }

  // Api call foursquare data
  getVenues(query = '') {
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const params = {
      client_id: 'B0PVDBLLSY3FCNRHJRP25ZOHQK1B3TZMYH24PD45GYDZMYS1',
      client_secret: 'R5VUP51Z3GCUOES5CKAZ0ZQJQ4YYW2ANYCMY4G2JQJTCOKQM',
      query: query,
      near: 'Austin Texas',
      v: '20180505'
    };

    axios.get(endPoint + new URLSearchParams(params))
      .then(response => {
        const { groups } = response.data.response;
        this.setState({ venues: groups[0].items}, this.loadMap);
        })
        .catch(error => {
          console.log(error);
        })
    }

  handleVenueClick(idx) {
    const { allMarkers } = this.state;
    window.google.maps.event.trigger(allMarkers[idx], 'click');
  }

  render() {
    const listData = this.state.venues.map((item, idx) => {
      const { id, name } = item.venue;
      return (
        <li
          key={id}
          onClick={() => this.handleVenueClick(idx)}
        >
          {name}
        </li>
      );
    });

    return (
        <main>
        <div className="">
          <Nav getVenues={this.getVenues} formHandler={this.formHandler}/>
          <ul className="listView">{listData}</ul>
          </div>
          <div id="map"></div>
        </main>
    );
  }
}

function loadScript(source) {
  let index = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');
  script.src = source;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}
