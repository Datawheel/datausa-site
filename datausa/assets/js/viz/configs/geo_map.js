viz.geo_map = function(build) {

  var key = build.config.coords.key;

  if (build.config.coords.solo) {
    build.config.coords.solo = build.config.coords.solo.split(",");
  }

  return {
    "color": {
      "heatmap": [d3plus.color.lighter(build.color), build.color, d3.rgb(build.color).darker()]
    },
    "coords": {
      "center": [0, 10],
      "key": key,
      "mute": ["79500US4804701"],
      "padding": 0,
      "projection": key === "countries" ? "equirectangular" : "albersUsa"
    },
    "labels": false
  };
}
