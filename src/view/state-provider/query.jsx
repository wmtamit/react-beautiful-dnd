// @flow
import React, { type Node } from 'react';
import type { State } from '../../types';
import type { Dispatch } from '../../state/store-types';
import StateContext, { type Value } from './state-context';

type ListenerProps = {|
  children: (mapProps: mixed, dispatch?: Dispatch) => Node,
  selector: (state: State, ownProps: mixed) => mixed,
  ownProps: mixed,
|};

type QueryProps = {|
  value: Value,
  ...ListenerProps,
|};

type QueryState = {|
  hasMapPropsChanged: boolean,
  mapProps: mixed,
  lastValue: Value,
  isParentRender: boolean,
|};

// listening to state updates
// want to render if a parent is rendering

// want to render if: a parent is rendering
// or if the selector returns a new value

class Query extends React.Component<QueryProps, QueryState> {
  state: QueryState = {
    hasMapPropsChanged: false,
    isParentRender: true,
    lastValue: this.props.value,
    mapProps: this.props.selector(this.props.value.state, this.props.ownProps),
  };

  static getDerivedStateFromProps(props: QueryProps, state: QueryState) {
    const isParentRender: boolean = props.value === state.lastValue;
    const mapProps = props.selector(props.value.state, props.ownProps);
    const hasMapPropsChanged: boolean = mapProps !== state.mapProps;

    return {
      hasMapPropsChanged,
      lastValue: props.value,
      isParentRender,
      mapProps,
    };
  }

  shouldComponentUpdate(props: QueryProps, state: QueryState) {
    if (state.isParentRender) {
      return true;
    }

    if (state.hasMapPropsChanged) {
      return true;
    }

    return false;
  }

  render() {
    return this.props.children(this.state.mapProps, this.props.value.dispatch);
  }
}

export default class QueryListener extends React.Component<ListenerProps> {
  render() {
    return (
      <StateContext.Consumer>
        {(value: Value) => (
          <Query value={value} {...this.props}>
            {this.props.children}
          </Query>
        )}
      </StateContext.Consumer>
    );
  }
}
