// @flow
import React, { type Node } from 'react';
import memoizeOne from 'memoize-one';
import { bindActionCreators } from 'redux';
import type {
  MapProps,
  OwnProps,
  DispatchProps,
  DefaultProps,
  Selector,
  Props,
} from './draggable-types';
import type { Dispatch } from '../../state/store-types';
import Query from '../store-provider/query';
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

export default class ConnectedDraggable extends React.Component<OwnProps> {
  selector: Selector = getSelector();

  static defaultProps: DefaultProps = {
    isDragDisabled: false,
    // cannot drag interactive elements by default
    disableInteractiveElementBlocking: false,
  };

  getDispatchProps = memoizeOne(
    (dispatch: Dispatch): DispatchProps => {
      console.log('generating action creators');
      return bindActionCreators(
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
      );
    },
  );

  renderChildren = (mapProps: MapProps, dispatch: Dispatch): ?Node => {
    const props: Props = {
      ...this.props,
      ...this.getDispatchProps(dispatch),
      ...mapProps,
    };

    return <Draggable {...props}>{this.props.children}</Draggable>;
  };

  render() {
    return (
      <Query selector={this.selector} ownProps={this.props}>
        {this.renderChildren}
      </Query>
    );
  }
}
