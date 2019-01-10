import React, {Component} from "react";
import PropTypes from "prop-types";
import * as d3plus from "d3plus-react";
import "./index.css";
import Options from "./Options";
import propify from "helpers/d3plusPropify";

class Viz extends Component {

  analyzeData(resp) {
    const {updateSource} = this.context;
    if (updateSource && resp.source) updateSource(resp.source);
  }

  render() {

    const {formatters, variables} = this.context;
    const {config, configOverride, className, options, slug, topic} = this.props;

    // clone config object to allow manipulation
    const vizProps = propify(config.logic, formatters, this.props.variables || variables);

    // If the result of propify has an "error" property, then the provided javascript was malformed and propify
    // caught an error. Instead of attempting to render the viz, simply show the error to the user.
    if (vizProps.error) {
      return <div>{`Error: ${vizProps.error}`}</div>;
    }
    vizProps.config = Object.assign(vizProps.config, configOverride);

    // strip out the "type" from config
    const {type} = vizProps.config;
    delete vizProps.config.type;
    if (!type) return null;
    const Visualization = d3plus[type];

    const title = this.props.title || config.title;

    return <div className={ `visualization ${className}` }>
      { options ? <Options
        component={ this }
        config={ vizProps.config }
        data={ vizProps.config.cart || vizProps.config.data }
        dataFormat={ vizProps.dataFormat }
        slug={ slug }
        title={ title }
        topic={ topic } /> : null }
      <Visualization
        ref={ comp => this.viz = comp }
        className="d3plus"
        dataFormat={resp => (this.analyzeData.bind(this)(resp), vizProps.dataFormat(resp))}
        config={vizProps.config} />
    </div>;
  }

}

Viz.contextTypes = {
  formatters: PropTypes.object,
  updateSource: PropTypes.func,
  variables: PropTypes.object
};

Viz.defaultProps = {
  className: "",
  config: {},
  configOverride: {},
  options: true,
  title: undefined
};

export default Viz;
