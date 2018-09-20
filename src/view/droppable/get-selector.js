// @flow

import memoizeOne from 'memoize-one';
import shouldUsePlaceholder from '../../state/droppable/should-use-placeholder';
import whatIsDraggedOver from '../../state/droppable/what-is-dragged-over';
import type {
  State,
  DroppableId,
  DraggableId,
  DragImpact,
  DraggableDimension,
  Placeholder,
} from '../../types';
import type { MapProps, OwnProps, Selector } from './droppable-types';

const defaultMapProps: MapProps = {
  isDraggingOver: false,
  draggingOverWith: null,
  placeholder: null,
};

export default (): Selector => {
  const getMapProps = memoizeOne(
    (
      isDraggingOver: boolean,
      draggingOverWith: ?DraggableId,
      placeholder: ?Placeholder,
    ): MapProps => ({
      isDraggingOver,
      draggingOverWith,
      placeholder,
    }),
  );

  const getDraggingOverProps = (
    id: DroppableId,
    draggable: DraggableDimension,
    impact: DragImpact,
  ) => {
    const isOver: boolean = whatIsDraggedOver(impact) === id;
    if (!isOver) {
      return defaultMapProps;
    }

    const usePlaceholder: boolean = shouldUsePlaceholder(
      draggable.descriptor,
      impact,
    );
    const placeholder: ?Placeholder = usePlaceholder
      ? draggable.placeholder
      : null;

    return getMapProps(true, draggable.descriptor.id, placeholder);
  };

  const selector = (state: State, ownProps: OwnProps): MapProps => {
    if (ownProps.isDropDisabled) {
      return defaultMapProps;
    }

    const id: DroppableId = ownProps.droppableId;

    if (state.isDragging) {
      const draggable: DraggableDimension =
        state.dimensions.draggables[state.critical.draggable.id];
      return getDraggingOverProps(id, draggable, state.impact);
    }

    if (state.phase === 'DROP_ANIMATING') {
      const draggable: DraggableDimension =
        state.dimensions.draggables[state.pending.result.draggableId];
      return getDraggingOverProps(id, draggable, state.pending.impact);
    }

    return defaultMapProps;
  };

  return selector;
};
