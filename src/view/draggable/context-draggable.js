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

export default class ContextDraggable extends React.PureComponent<OwnProps> {
  selector: Selector = getSelector();

  static defaultProps: DefaultProps = {
    isDragDisabled: false,
    // cannot drag interactive elements by default
    disableInteractiveElementBlocking: false,
  };

  // shouldComponentUpdate(props) {
  //   console.log('ContextDraggable: are props equal?', props === this.props);
  //   return true;
  // }

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

    console.log('Query rendering Draggable');
    return <Draggable {...props}>{this.props.children}</Draggable>;
  };

  render() {
    console.log('rendering ContextDraggable');
    return (
      <Query selector={this.selector} ownProps={this.props}>
        {this.renderChildren}
      </Query>
    );
  }
}
