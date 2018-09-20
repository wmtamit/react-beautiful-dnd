// @flow
import React from 'react';
import type { DroppableId, TypeId } from '../../types';

export type Context = {|
  droppableId: DroppableId,
  droppableType: TypeId,
|};

const DroppableContext = React.createContext<Context>();

export default DroppableContext;
