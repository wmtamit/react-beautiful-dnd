// @flow
import React, { type Node } from 'react';
import memoizeOne from 'memoize-one';
import type { Store } from '../../state/store-types';
import type { State as AppState } from '../../types';
import StateContext, { type Value } from './state-context';

type BlockerProps = {|
  children: Node,
  shouldAllow: boolean,
|};

class Blocker extends React.Component<BlockerProps> {
  shouldComponentUpdate(props: BlockerProps) {
    if (props.shouldAllow) {
      return true;
    }
    console.log('not rendering tree');
    return false;
  }

  render() {
    console.error('rendering tree');
    return this.props.children;
  }
}

type ProviderProps = {|
  store: Store,
  children: Node,
|};

type ProviderState = {|
  lastAppState: AppState,
  appState: AppState,
  shouldRenderChildren: boolean,
|};

const initial: AppState = { phase: 'IDLE' };

export default class Provider extends React.Component<
  ProviderProps,
  ProviderState,
> {
  unsubscribe: Function;
  state: ProviderState;

  constructor(props: ProviderProps, context: any) {
    super(props, context);

    this.unsubscribe = props.store.subscribe(this.onStateChange);
    this.state = {
      appState: initial,
      lastAppState: initial,
      shouldRenderChildren: true,
    };
  }

  static getDerivedStateFromProps(
    props: ProviderProps,
    state: ProviderState,
  ): ProviderState {
    // render must have been caused by parent
    if (state.appState === state.lastAppState) {
      return {
        ...state,
        shouldRenderChildren: true,
      };
    }

    // app state change - want to block rendering the tree
    console.error('App state changing - do not render children');
    return {
      ...state,
      lastAppState: state.appState,
      shouldRenderChildren: false,
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

    const shouldAllow: boolean = this.state.shouldRenderChildren;
    return (
      <StateContext.Provider value={value}>
        <Blocker shouldAllow={shouldAllow}>{this.props.children}</Blocker>
      </StateContext.Provider>
    );
  }
}
