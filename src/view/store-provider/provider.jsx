// @flow
/* eslint-disable react/sort-comp */
import invariant from 'tiny-invariant';
import React, { type Node } from 'react';
import StoreContext from './store-context';
import { type State } from '../../types';
import { type Store, type Dispatch } from '../../state/store-types';

type Props = {|
  children: <MapProps>(mapProps: MapProps, dispatch: Dispatch) => Node,
  selector: <MapProps, OwnProps>(state: State, ownProps: OwnProps) => MapProps,
  ownProps: mixed,
|};

type QueryState = {|
  mapProps: mixed,
|};

// Temp hack
const defaultMapProps: MapProps = {
  isDragging: false,
  dropping: null,
  offset: { x: 0, y: 0 },
  shouldAnimateDragMovement: false,
  // This is set to true by default so that as soon as Draggable
  // needs to be displaced it can without needing to change this flag
  shouldAnimateDisplacement: true,
  // these properties are only populated when the item is dragging
  dimension: null,
  draggingOver: null,
  combineWith: null,
  combineTargetFor: null,
};

export default class Query extends React.Component<Props, QueryState> {
  store: ?Store;
  unsubscribe: Function;

  state: QueryState = {
    mapProps: defaultMapProps,
  };

  onStateChange = () => {
    const store: ?Store = this.store;
    invariant(store);
    const state: State = store.getState();
    const mapProps = this.props.selector(state, this.props.ownProps);
    // no change
    if (this.state.mapProps === mapProps) {
      return;
    }

    this.setState({
      mapProps,
    });
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
      return this.props.children(this.state.mapProps, this.store.dispatch);
    }

    // register store
    this.store = store;
    // get initial map props
    this.unsubscribe = store.subscribe(this.onStateChange);

    // TODO: put this into state</MapProps>
    const state: State = store.getState();
    const mapProps = this.props.selector(state, this.props.ownProps);
    return this.props.children(mapProps, store.dispatch);
  };

  componentWillUnmount() {
    this.unsubscribe();
    this.store = null;
  }

  render() {
    return <StoreContext.Consumer>{this.register}</StoreContext.Consumer>;
  }
}
