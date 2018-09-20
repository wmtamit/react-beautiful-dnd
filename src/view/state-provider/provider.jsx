// @flow
import React, { type Node } from 'react';
import memoizeOne from 'memoize-one';
import type { Store } from '../../state/store-types';
import type { State as AppState } from '../../types';
import StateContext, { type Value } from './state-context';

type BlockerProps = {|
  children: Node,
  shouldBlock: boolean,
|};

class Blocker extends React.Component<BlockerProps> {
  shouldComponentUpdate(props: BlockerProps) {
    if (props.shouldBlock) {
      console.log('blocking update caused by app state');
      return false;
    }
    return true;
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
  isAppStateRender: boolean,
|};

export default class Provider extends React.Component<
  ProviderProps,
  ProviderState,
> {
  unsubscribe: Function = this.props.store.subscribe(this.onStateChange);
  state: ProviderState = {
    appState: { phase: 'IDLE' },
    isAppStateRender: false,
  };

  static getDerivedStateFromProps(props: ProviderProps, state: ProviderState) {
    if (state.isAppStateRender) {
      return state;
    }

    // render was caused by parent
    return {
      appState: state.appState,
      isAppStateRender: false,
    };
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

    this.setState({
      appState,
      isAppStateRender: true,
    });
  };

  render() {
    const value: Value = this.getValue(
      this.state.appState,
      this.props.store.dispatch,
    );
    const shouldBlock: boolean = this.state.isAppStateRender;
    return (
      <StateContext.Provider value={value}>
        <Blocker shouldBlock={shouldBlock}>{this.props.children}</Blocker>
      </StateContext.Provider>
    );
  }
}
