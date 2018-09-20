// @flow
import { type Position } from 'css-box-model';
import { type Node } from 'react';
import type { AutoScrollMode, DraggableId } from '../../types';

export type Callbacks = {|
  onLift: ({
    clientSelection: Position,
    autoScrollMode: AutoScrollMode,
  }) => void,
  onMove: (point: Position) => mixed,
  onWindowScroll: () => mixed,
  onMoveUp: () => mixed,
  onMoveDown: () => mixed,
  onMoveRight: () => mixed,
  onMoveLeft: () => mixed,
  onDrop: () => mixed,
  onCancel: () => mixed,
|};

export type DragHandleProps = {|
  // If a consumer is using a portal then the item will loose focus
  // when moving to the portal. This breaks keyboard dragging.
  // To get around this we manually apply focus if needed when mounting
  onFocus: () => void,
  onBlur: () => void,

  // Used to initiate dragging
  onMouseDown: (event: MouseEvent) => void,
  onKeyDown: (event: KeyboardEvent) => void,
  onTouchStart: (event: TouchEvent) => void,

  // Control styling from style marshal
  'data-react-beautiful-dnd-drag-handle': string,

  // Aria role (nicer screen reader text)
  'aria-roledescription': string,

  // Allow tabbing to this element
  tabIndex: number,

  // Stop html5 drag and drop
  draggable: boolean,
  onDragStart: (event: DragEvent) => void,
|};

export type Props = {|
  draggableId: DraggableId,
  // callbacks provided by the draggable
  callbacks: Callbacks,
  isEnabled: boolean,
  // whether the application thinks a drag is occurring
  isDragging: boolean,
  // whether the application thinks a drop is occurring
  isDropAnimating: boolean,
  // get the ref of the draggable
  getDraggableRef: () => ?HTMLElement,
  styleContext: string,
  // The canLift function is read directly off the context
  // and will communicate with the store. This is done to avoid
  // needing to query a property from the store and re-render this component
  // with that value. By putting it as a function on the context we are able
  // to avoid re-rendering to pass this information while still allowing
  // drag-handles to obtain this state if they need it.
  canLift: (id: DraggableId) => boolean,
  // whether interactive elements should be permitted to start a drag
  canDragInteractiveElements: boolean,
  children: (?DragHandleProps) => Node,
|};
