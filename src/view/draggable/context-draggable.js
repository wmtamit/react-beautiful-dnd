// @flow
import React, { type Node } from 'react';
import memoizeOne from 'memoize-one';
import { bindActionCreators } from 'redux';
import type {
  MapProps,
  OwnProps,
  DispatchProps,
  Selector,
  Props,
} from './draggable-types';
import type { State } from '../../types';
import type { Dispatch } from '../../state/store-types';
import Provider from '../store-provider/provider';
import { origin } from '../../state/position';
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
      <Provider selector={this.selector} ownProps={this.props}>
        {this.renderChildren}
      </Provider>
    );
  }
}
