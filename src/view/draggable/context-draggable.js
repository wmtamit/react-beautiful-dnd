// @flow
import React, { type Node } from 'react';
import memoizeOne from 'memoize-one';
import { bindActionCreators } from 'redux';
import type {
  MapProps,
  OwnProps,
  ContextProps,
  DispatchProps,
  DefaultProps,
  Selector,
  Props,
} from './draggable-types';
import type { Dispatch } from '../../state/store-types';
import Query from '../state-provider/query';
import Draggable from './draggable';
import getSelector from './get-selector';
import {
  lift as liftAction,
  move as moveAction,
  moveUp as moveUpAction,
  moveDown as moveDownAction,
  moveLeft as moveLeftAction,
  moveRight as moveRightAction,
  drop as dropAction,
  dropAnimationFinished as dropAnimationFinishedAction,
  moveByWindowScroll as moveByWindowScrollAction,
} from '../../state/action-creators';
import {
  DimensionMarshalContext,
  StyleContext,
  CanLiftContext,
  type CanLiftFn,
} from '../drag-drop-context/global-context';
import type { DimensionMarshal } from '../../state/dimension-marshal/dimension-marshal-types';
import DroppableContext, { type Context } from '../droppable/droppable-context';

export default class ContextDraggable extends React.Component<OwnProps> {
  selector: Selector = getSelector();

  static defaultProps: DefaultProps = {
    isDragDisabled: false,
    // cannot drag interactive elements by default
    disableInteractiveElementBlocking: false,
  };

  getDispatchProps = memoizeOne(
    (dispatch: Dispatch): DispatchProps =>
      bindActionCreators(
        {
          lift: liftAction,
          move: moveAction,
          moveUp: moveUpAction,
          moveDown: moveDownAction,
          moveLeft: moveLeftAction,
          moveRight: moveRightAction,
          moveByWindowScroll: moveByWindowScrollAction,
          drop: dropAction,
          dropAnimationFinished: dropAnimationFinishedAction,
        },
        dispatch,
      ),
  );

  renderChildren = (
    styleContext: string,
    marshal: DimensionMarshal,
    canLift: CanLiftFn,
    droppableContext: Context,
    mapProps: MapProps,
    dispatch: Dispatch,
  ): ?Node => {
    const context: ContextProps = {
      styleContext,
      marshal,
      canLift,
      ...droppableContext,
    };

    const props: Props = {
      ...this.props,
      ...this.getDispatchProps(dispatch),
      ...context,
      ...mapProps,
    };

    return <Draggable {...props}>{this.props.children}</Draggable>;
  };

  render() {
    return (
      <StyleContext.Consumer>
        {(styleContext: string) => (
          <DimensionMarshalContext.Consumer>
            {(marshal: DimensionMarshal) => (
              <CanLiftContext.Consumer>
                {(canLift: CanLiftFn) => (
                  <DroppableContext.Consumer>
                    {(droppableContext: Context) => {
                      console.log('parent of query called');
                      return (
                        <Query selector={this.selector} ownProps={this.props}>
                          {(mapProps: MapProps, dispatch: Dispatch) =>
                            this.renderChildren(
                              styleContext,
                              marshal,
                              canLift,
                              droppableContext,
                              mapProps,
                              dispatch,
                            )
                          }
                        </Query>
                      );
                    }}
                  </DroppableContext.Consumer>
                )}
              </CanLiftContext.Consumer>
            )}
          </DimensionMarshalContext.Consumer>
        )}
      </StyleContext.Consumer>
    );
  }
}
