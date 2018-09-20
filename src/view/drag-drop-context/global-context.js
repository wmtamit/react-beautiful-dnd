// @flow
import React from 'react';
import type { DraggableId } from '../../types';
import type { DimensionMarshal } from '../../state/dimension-marshal/dimension-marshal-types';

export const DimensionMarshalContext = React.createContext<DimensionMarshal>();
export const StyleContext = React.createContext<string>();

export type CanLiftFn = (id: DraggableId) => boolean;
export const CanLiftContext = React.createContext<CanLiftFn>(() => false);
