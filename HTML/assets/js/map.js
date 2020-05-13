'use strict';

/*-------------------------------------------------------------------------------
  Map Initialization
-------------------------------------------------------------------------------*/
mapboxgl.accessToken = ''; // <---- YOUR MAPBOX API KEY GOES HERE
var map = new mapboxgl.Map({
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-77.04, 38.907],
  zoom: 11.5,
  pitch: 45,
  container: 'map',
  antialias: true
});

/*-------------------------------------------------------------------------------
  Add Markers to map (Data coming from assets/js/mapdata.js)
-------------------------------------------------------------------------------*/
mapData.features.forEach(function(marker) {
  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<img src="'+marker.properties.thumbnail+'" alt="'+marker.properties.title+'"/> '+
             '<div class="acr-listing-popup-body"><h5><a href="#" title="'+marker.properties.title+'">' + marker.properties.title + '</a></h5> <span class="listing-price">'+marker.properties.price+'</span>'+
              '<p><i class="fas fa-map-signs"></i> ' + marker.properties.description + '</p> <div class="location-popup-meta"> <span><i class="fas fa-bed"></i>'+marker.properties.bed+'</span>'+
              '<span><i class="fas fa-bath"></i>'+marker.properties.bath+'</span><span><i class="fas fa-ruler-combined"></i>'+marker.properties.size+'</span> </div></div>'))
    .addTo(map);
});

/*-------------------------------------------------------------------------------
  Fly to Location
-------------------------------------------------------------------------------*/
$(".fly-to-location").on('click', function(e) {
  e.preventDefault();
  var $this = $(this);
  // Fly to a random location by offsetting the point -74.50, 40
  // by up to 5 degrees.
  map.flyTo({
    zoom: 18.5,
    center: [ $this.data('lat'), $this.data('lng') ],
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
  });
});

/*-------------------------------------------------------------------------------
  Map Building Generation
-------------------------------------------------------------------------------*/
// The 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function() {
  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;

  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
    }
  }

  map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    },
    labelLayerId
  );
});
