import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import _throttle from "lodash/throttle";
import { BROWSER_DIMENSIONS, CHANGE_PANEL_LAYOUT } from "../../actions/types";
import { getManifest } from "../../util/clientAPIInterface";
import { twoColumnBreakpoint } from "../../util/globals";

@connect()
class Monitor extends React.Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  componentDidMount() {
    /* API call to charon to get initial datasets etc (needed to load the splash page) */
    getManifest(this.context.router, this.props.dispatch);
    /* don't need initial dimensions - they're in the redux store on load */
    window.addEventListener( // future resizes
      "resize",
      _throttle(this.handleResizeByDispatching.bind(this), 500, {
        leading: true,
        trailing: true
      })
    );
    /* lodash throttle invokes resize event at most twice per second
    to let redraws catch up.
    Could also use debounce for 'wait until resize stops'
    */
  }

  handleResizeByDispatching() {
    this.props.dispatch((dispatch, getState) => {
      /* here we decide whether we should change panel layout from full <-> grid
      when crossing the twoColumnBreakpoint */
      const { browserDimensions } = getState();
      const oldBrowserDimensions = browserDimensions.browserDimensions;
      const newBrowserDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
        docHeight: window.document.body.clientHeight /* background needs docHeight because sidebar creates absolutely positioned container and blocks height 100% */
      };
      dispatch({type: BROWSER_DIMENSIONS, data: newBrowserDimensions});
      if (oldBrowserDimensions.width < twoColumnBreakpoint && newBrowserDimensions.width >= twoColumnBreakpoint) {
        dispatch({type: CHANGE_PANEL_LAYOUT, data: "grid"});
      } else if (oldBrowserDimensions.width > twoColumnBreakpoint && newBrowserDimensions.width <= twoColumnBreakpoint) {
        dispatch({type: CHANGE_PANEL_LAYOUT, data: "full"});
      }
    });
  }

  render() {
    return null;
  }
}

export default Monitor;