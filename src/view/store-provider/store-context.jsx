// @flow
import React from 'react';
import type { Store } from '../../state/store-types';

const StoreContext = React.createContext<?Store>();

export default StoreContext;
