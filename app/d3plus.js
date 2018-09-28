import styles from "./style.yml";

const currentYear = new Date().getFullYear();

const axisStyles = {
  barConfig: {
    stroke: "#ccc"
  },
  gridConfig: {
    stroke: "#ccc"
  },
  shapeConfig: {
    labelConfig: {
      fontColor: () => "#211f1a",
      fontFamily: () => "Source Sans Pro",
      fontSize: () => 12,
      fontWeight: () => 400
    },
    stroke: "#ccc"
  },
  tickSize: 5,
  titleConfig: {
    fontColor: () => "#211f1a",
    fontFamily: () => "Palanquin",
    fontSize: () => 12,
    fontWeight: () => 400
  }
};

export default {
  barPadding: 0,
  colorScaleConfig: {
    axisConfig: {
      labelOffset: true,
      labelRotation: false,
      shapeConfig: {
        labelConfig: {
          fontColor: () => "#211f1a",
          fontFamily: () => "Source Sans Pro",
          fontSize: () => 12,
          fontWeight: () => 400
        }
      },
      titleConfig: {
        fontColor: () => "#211f1a",
        fontFamily: () => "Palanquin",
        fontSize: () => 12,
        fontWeight: () => 400
      }
    },
    color: ["#ecf3f7", "#cfdfeb", "#b0cde1", "#90bad8", "#6ea7d2", "#4c96cb", "#3182bd", "#004374"],
    // color: ["#f8ecec", "#edd1d1", "#e4b4b4", "#dc9595", "#d57676", "#cf5555", "#CA3434", "#7b0000"],
    scale: "jenks"
  },
  confidenceConfig: {
    fillOpacity: 0.2
  },
  legendConfig: {
    shapeConfig: {
      labelConfig: {
        fontFamily: () => "Palanquin",
        fontSize: () => 13
      },
      height: () => 20,
      width: () => 20
    }
  },
  messageMask: false,
  messageStyle: {
    "color": "#888",
    "font-family": "'Palanquin', sans-serif",
    "font-size": "16px",
    "font-weight": "300"
  },
  ocean: "#D5DADC",
  padPixel: 1,
  shapeConfig: {
    fill: styles.red,
    hoverOpacity: 0.5,
    labelConfig: {
      fontFamily: () => "Pathway Gothic One",
      fontSize: () => 13,
      padding: 5
    },
    Line: {
      stroke: styles.red,
      strokeWidth: 3,
      strokeLinecap: "round"
    },
    Path: {
      fillOpacity: 0.75
    }
  },
  timelineConfig: {
    buttonBehavior: "buttons",
    buttonHeight: 20,
    buttonPadding: 5,
    labelRotation: false,
    selectionConfig: {
      "fill": "#888",
      "fill-opacity": 0.25,
      "transform": "translate(0, 2)"
    },
    shapeConfig: {
      fill: "transparent",
      labelConfig: {
        fontColor(d) {
          const n = parseInt(d.text, 10);
          return isNaN(n) || n <= currentYear ? "#888" : styles.red;
        },
        fontFamily: () => "Palanquin",
        fontSize: () => 12,
        fontWeight: () => 700,
        lineHeight: () => 16,
        padding: 0
      },
      stroke: "transparent",
      strokeWidth: 0
    }
  },
  titleConfig: {
    fontFamily: "Pathway Gothic One",
    fontSize: 20,
    fontWeight: 400,
    padding: 0
  },
  tooltipConfig: {
    background: "white",
    border: "1px solid #888",
    footerStyle: {
      "color": "#666",
      "font-family": "'Palanquin', sans-serif",
      "font-size": "12px",
      "font-weight": "300",
      "padding-top": "5px"
    },
    padding: "10px",
    titleStyle: {
      "color": "#888",
      "font-family": "'Palanquin', sans-serif",
      "font-size": "16px",
      "font-weight": "300"
    }
  },
  xConfig: {...axisStyles},
  yConfig: {...axisStyles}
};
