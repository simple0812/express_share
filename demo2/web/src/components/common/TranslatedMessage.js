/*const onClick = e => (...)

const SomeButton = props => {
  return <button onClick={onClick}>Click me!</button>
}*/

import intl from 'react-intl';
function formatMessage() {
  return intl.formatMessage.call(intl, ...arguments);
}

export * from 'react-intl';

export { formatMessage };
