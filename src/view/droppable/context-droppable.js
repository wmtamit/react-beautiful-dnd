// @flow
import React, { type Node } from 'react';
import type {
  MapProps,
  OwnProps,
  DefaultProps,
  Selector,
  Props,
} from './droppable-types';
import Query from '../store-provider/query';
import Droppable from './droppable';
import getSelector from './get-selector';

export default class ConnectedDraggable extends React.Component<OwnProps> {
  selector: Selector = getSelector();

  static defaultProps: DefaultProps = {
    type: 'DEFAULT',
    direction: 'vertical',
    isDropDisabled: false,
    isCombineEnabled: false,
    ignoreContainerClipping: false,
  };

  renderChildren = (mapProps: MapProps): ?Node => {
    const props: Props = {
      ...this.props,
      ...mapProps,
    };

    return <Droppable {...props}>{this.props.children}</Droppable>;
  };

  render() {
    return (
      <Query selector={this.selector} ownProps={this.props}>
        {this.renderChildren}
      </Query>
    );
  }
}
