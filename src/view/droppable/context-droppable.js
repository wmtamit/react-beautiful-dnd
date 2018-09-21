// @flow
import React, { type Node } from 'react';
import memoizeOne from 'memoize-one';
import type {
  MapProps,
  OwnProps,
  DefaultProps,
  Selector,
  Props,
} from './droppable-types';
import type { DroppableId, TypeId } from '../../types';
import Query from '../state-provider/query';
import Droppable from './droppable';
import getSelector from './get-selector';
import DroppableContext, { type Context } from './droppable-context';
import {
  StyleContext,
  DimensionMarshalContext,
} from '../drag-drop-context/global-context';
import type { DimensionMarshal } from '../../state/dimension-marshal/dimension-marshal-types';

export default class ContextDroppable extends React.Component<OwnProps> {
  selector: Selector = getSelector();

  static defaultProps: DefaultProps = {
    type: 'DEFAULT',
    direction: 'vertical',
    isDropDisabled: false,
    isCombineEnabled: false,
    ignoreContainerClipping: false,
  };

  getContext = memoizeOne(
    (id: DroppableId, type: TypeId): Context => ({
      droppableId: id,
      droppableType: type,
    }),
  );

  renderChildren = (
    styleContext: string,
    marshal: DimensionMarshal,
    mapProps: MapProps,
  ): ?Node => {
    const props: Props = {
      ...this.props,
      ...mapProps,
      styleContext,
      marshal,
    };

    return <Droppable {...props}>{this.props.children}</Droppable>;
  };

  render() {
    const context: Context = this.getContext(
      this.props.droppableId,
      this.props.type,
    );
    return (
      <DroppableContext.Provider value={context}>
        <StyleContext.Consumer>
          {(styleContext: string) => (
            <DimensionMarshalContext.Consumer>
              {(marshal: DimensionMarshal) => (
                <Query selector={this.selector} ownProps={this.props}>
                  {(mapProps: MapProps) =>
                    this.renderChildren(styleContext, marshal, mapProps)
                  }
                </Query>
              )}
            </DimensionMarshalContext.Consumer>
          )}
        </StyleContext.Consumer>
      </DroppableContext.Provider>
    );
  }
}
