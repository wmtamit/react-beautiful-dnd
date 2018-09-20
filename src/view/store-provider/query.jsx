// @flow
/* eslint-disable react/sort-comp */
import invariant from 'tiny-invariant';
import React, { type Node } from 'react';
import StoreContext from './store-context';
import { type State } from '../../types';
import { type Store, type Dispatch } from '../../state/store-types';

type Props = {|
  defaultState: State,
  children: <MapProps>(mapProps: MapProps, dispatch?: Dispatch) => Node,
  selector: <MapProps, OwnProps>(state: State, ownProps: OwnProps) => MapProps,
  ownProps: mixed,
|};

type QueryState = {|
  mapProps: mixed,
  lastState: State,
|};

export default class Query extends React.Component<Props, QueryState> {
  store: ?Store;
  unsubscribe: Function;

  static defaultProps = {
    defaultState: { phase: 'IDLE' },
  };

  state: QueryState = {
    lastState: this.props.defaultState,
    mapProps: this.props.selector(this.props.defaultState, this.props.ownProps),
  };

  onStateChange = () => {
    const store: ?Store = this.store;
    invariant(store);
    const state: State = store.getState();

    // no need to run the selector
    if (state === this.state.lastState) {
      return;
    }

    const mapProps = this.props.selector(state, this.props.ownProps);
    // no change
    if (this.state.mapProps === mapProps) {
      return;
    }

    this.setState({
      mapProps,
      lastState: state,
    });
  };

  renderChildren = (): Node => {
    invariant(this.store, 'Cannot render children without a store');
    return this.props.children(this.state.mapProps, this.store.dispatch);
  };

  register = (store: ?Store): Node => {
    invariant(store, 'Store is required for Provider');
    // store already registered
    if (this.store) {
      invariant(
        store === this.store,
        'Currently not supporting changing a store',
      );

      // this can happen if a parent renders
      return this.renderChildren();
    }

    // register store
    this.store = store;
    this.unsubscribe = store.subscribe(this.onStateChange);

    return this.renderChildren();
  };

  componentWillUnmount() {
    this.unsubscribe();
    this.store = null;
  }

  render() {
    return <StoreContext.Consumer>{this.register}</StoreContext.Consumer>;
  }
}
