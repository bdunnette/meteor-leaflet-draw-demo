Markers = new Meteor.Collection('markers');

if (Meteor.isClient) {
  Template.map.rendered = function() {
    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

    var map = L.map('map', {
      doubleClickZoom: false
    }).setView([45, - 93.2], 12);

    L.tileLayer.provider('MapQuestOpen.OSM').addTo(map);

    var drawnItems = L.featureGroup().addTo(map);

    map.addControl(new L.Control.Draw({
      draw: {
        polyline: false,
        polygon: false,
        rectangle: false
      },
      edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: false
      }
    }));

    map.on('draw:created', function(event) {
      var layer = event.layer;
      console.log(event.layer);
      console.log(event.layerType);
      console.log(drawnItems);
      var feature = {
        options: event.layer.options,
        layerType: event.layerType
      };
      switch (event.layerType) {
      case 'marker':
        feature.latlng = event.layer._latlng;
        break;
      case 'circle':
        feature.latlng = event.layer._latlng;
        feature.radius = event.layer._mRadius;
        break;
      }
      console.log(feature);
      Markers.insert(feature);
    });

    map.on('draw:deleted', function(event) {
      var layer = event.layer;
      console.log(event.layer);
      console.log(event.layerType);
    });

    var query = Markers.find();
    query.observe({
      added: function(document) {
        console.log(document);
        switch (document.layerType) {
        case 'marker':
          var marker = L.marker(document.latlng).addTo(drawnItems);
          break;
        case 'circle':
          var circle = L.circle(document.latlng, document.radius).addTo(drawnItems);
          break;
        }
      },
      removed: function(oldDocument) {
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
    $(document).ready(function() {
      $('#map').css({
        height: $(window).height() + 'px'
      });
    });
    $(window).resize(function() {
      $('#map').css({
        height: $(window).height() + 'px'
      });
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
    Queue.setInterval('deleteAllMarkers','Meteor.call("deleteAllMarkers")', 86400000); /* once a day */
    Queue.run();
  });
  
  Meteor.methods({
    'deleteAllMarkers': function(){
      console.log("Removing markers...");
      Markers.remove({});
    }
  });
}
