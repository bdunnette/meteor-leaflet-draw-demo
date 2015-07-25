# meteor-leaflet-draw-demo

A demo of using Leaflet.draw with Meteor (via the [bdunnette:leaflet-draw](https://github.com/bdunnette/meteor-leaflet-draw) package)

http://leaflet-draw.meteor.com

## Tips for integrating leaflet-draw with Meteor

* When adding a feature to the map, set its _leaflet_id to its database _id - this eases editing and removal; see example code [here](https://github.com/bdunnette/meteor-leaflet-draw-demo/blob/09b80f93f0c54adfe12f15b3b007f6db29bb9fd0/meteor-leaflet-draw-demo.js#L66)
