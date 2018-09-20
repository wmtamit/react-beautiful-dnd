// @flow
import React from 'react';
import type { State } from '../../types';
import type { Dispatch } from '../../state/store-types';

export type Value = {|
  state: State,
  dispatch: Dispatch,
|};

const StateContext = React.createContext<Value>();

export default StateContext;
