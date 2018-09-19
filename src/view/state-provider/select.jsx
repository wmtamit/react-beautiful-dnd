// @flow
import React from 'react';
import StateContext from './state-context';

type Props = {|
  selector: (state: State) => mixed,
  children: (result: mixed) => Node,
|};

class Query extends React.Component<> {}

export class Select extends React.Component<> {
  render() {
    return (
      <StateContext.Consumer>
        {(state: State) => (
          <Query state={state} selector={this.props.selector} />
        )}
      </StateContext.Consumer>
    );
  }
}
