Markers = new Meteor.Collection('markers');

if (Meteor.isClient) {
  Template.map.rendered = function() {
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

  var map = L.map('map', {
    doubleClickZoom: false
  }).setView([45, -93.2], 12);

  L.tileLayer.provider('OpenStreetMap').addTo(map);

  var drawnItems = L.featureGroup().addTo(map);
  
  map.addControl(new L.Control.Draw({
			edit: { featureGroup: drawnItems }
		}));
		
		map.on('draw:created', function(event) {
			var layer = event.layer;
			console.log(event.layer);
			console.log(event.layerType);
			Markers.insert({type: event.layerType, latlng: event.layer._latlng});
		});
		
		map.on('draw:deleted', function(event) {
			var layer = event.layer;
			console.log(event.layer);
			console.log(event.layerType);
		});

  var query = Markers.find();
  query.observe({
    added: function (document) {
      var marker = L.marker(document.latlng).addTo(map)
        .on('click', function(event) {
          console.log(marker);
        });
    },
    removed: function (oldDocument) {
      layers = map._layers;
      var key, val;
      for (key in layers) {
        val = layers[key];
        if (val._latlng) {
          if (val._latlng.lat === oldDocument.latlng.lat && val._latlng.lng === oldDocument.latlng.lng) {
            map.removeLayer(val);
          }
        }
      }
    }
  });
};

$(function() {
  $(window).resize(function() {
    $('#map').css('height', window.innerHeight - 82);
  });
  $(window).resize(); // trigger resize event
});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
