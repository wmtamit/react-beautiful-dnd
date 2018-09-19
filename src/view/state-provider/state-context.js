// @flow
import React from 'react';
import type { State, IdleState } from '../../types';

const idle: IdleState = { phase: 'IDLE' };

const StateContext = React.createContext<State>(idle);

export default StateContext;
