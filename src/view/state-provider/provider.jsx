// @flow
import React, { type Node } from 'react';
import memoizeOne from 'memoize-one';
import type { Store } from '../../state/store-types';
import type { State as AppState } from '../../types';
import StateContext, { type Value } from './state-context';

type BlockerProps = {|
  children: Node,
|};

class Blocker extends React.Component<BlockerProps> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return this.props.children;
  }
}

type ProviderProps = {|
  store: Store,
  children: Node,
|};

type ProviderState = {|
  appState: AppState,
|};

export default class Provider extends React.Component<
  ProviderProps,
  ProviderState,
> {
  unsubscribe: Function;
  state: ProviderState = {
    appState: { phase: 'IDLE' },
  };

  constructor(props: ProviderProps, context: any) {
    super(props, context);

    this.unsubscribe = props.store.subscribe(this.onStateChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getValue = memoizeOne((appState: AppState, dispatch: Dispatch) => ({
    state: appState,
    dispatch,
  }));

  onStateChange = () => {
    const appState: AppState = this.props.store.getState();

    if (appState === this.state.appState) {
      return;
    }

    this.setState({
      appState,
    });
  };

  render() {
    const value: Value = this.getValue(
      this.state.appState,
      this.props.store.dispatch,
    );

    return (
      <StateContext.Provider value={value}>
        <Blocker>{this.props.children}</Blocker>
      </StateContext.Provider>
    );
  }
}
