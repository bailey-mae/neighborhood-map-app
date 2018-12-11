import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import SideBar from './sidebar.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.filterVenues = this.filterVenues.bind(this)
  }

  state = {
    venues: [],
    filteredVenueIds: []
  }

  componentDidMount() {
    this.getVenues ()
  }


//render map with google api
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAGlDDI4IhHVNMooY1WCGtTb6TSGmRnv9Q&callback=initMap")
    window.initMap = this.initMap
  }

//foursqaure api to get sushi places in Frederick, MD
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "1FSWOD3MHOO1XYMP5ESSXGDRJHEWMD3QMZWQIWYMA0G433C5",
      client_secret: "FIJNBNPGLBMLRL0HY52UVXUIQF2KOHISCKOUVXB4OLFCH3JJ",
      query: "sushi",
      near: "Frederick",
      v: "20182507"
    }

//axios for xmlhttp requests and error handling
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        let venues = response.data.response.groups[0].items.map(item => item.venue)
        this.setState({
          venues,
          filteredVenueIds : venues.map (item => item.id)
        }, this.renderMap())
      })
      .catch(error => {
        console.log("So sorry, the following error occured " + error)

      })
  }
//filter venues
     filterVenues = (query) => {
      let filteredVenueIds;
      if (!query) {
        filteredVenueIds = this.state.venues.map (item => item.id)
      } else {
          filteredVenueIds = this.state.venues.filter (item => {
            return item.name.toLowerCase ().indexOf(query.toLowerCase())  >= 0;
          }) .map(item => item.id);

        }
        this.setState({filteredVenueIds}, this.initMap);
     }

//initialize map with markers and info windows
  initMap = () => {
          let venues = this.getFilteredVenues()
          const map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: 39.40840019, lng: -77.45889666},
            zoom: 12
          });

          //create info window
          var infowindow = new window.google.maps.InfoWindow()


          var markerIcon = {
  url: 'https://image.flaticon.com/icons/png/128/786/786903.png',
  scaledSize: new window.google.maps.Size(60, 60),
  origin: new window.google.maps.Point(0, 0), // used if icon is a part of sprite, indicates image position in sprite
  anchor: new window.google.maps.Point(20,40) // lets offset the marker image
};
          //display markers on map
          venues.map(markVenue => {

            var contentString = `${markVenue.name + `<br>` + markVenue.location.address}`

            //create marker
            var marker = new window.google.maps.Marker({
              position: {lat: markVenue.location.lat, lng: markVenue.location.lng},
              map: map,
              venue: markVenue,
              id: markVenue.id,
              name: markVenue.name,
              animation: window.google.maps.Animation.DROP,
              icon: markerIcon
            });

            // click marker event listener
            marker.addListener('click', function() {

              //content of infowindow
              infowindow.setContent(contentString)
              //open an infowindow
              infowindow.open(map, marker)
            });

          });

  }

getFilteredVenues = () => this.state.venues.filter(venue => this.state.filteredVenueIds.includes(venue.id))

 toggleMarkerLocation = (venue) => {
    window.location.isMarkerShown = !window.location.isMarkerShown
    this.setState({ venues: this.state.venues });
  }

  render () {
    let venues = this.getFilteredVenues()
    return (
      <main id="container">
      <div id="map"></div>
      <div id="App">
      <SideBar venues={venues} filterVenues={this.filterVenues}
        OnClickText={this.toggleMarkerLocation, console.log("boo")}>
      </SideBar>
      </div>
      </main>
    )
  }
}

//vanilla javascript for google api request
function loadScript (url) {
  var index =
    window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;




