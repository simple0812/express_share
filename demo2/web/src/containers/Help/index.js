import React, { Component } from 'react';

class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <iframe
        title="navigation"
        src="https://yangjh.oschina.io/gitbook/faq/Css.html"
        frameBorder="0"></iframe>
    );
  }
}

export default Help;
