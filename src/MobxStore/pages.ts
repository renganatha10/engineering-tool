import { types } from 'mobx-state-tree';

export interface PageArg {
  id: string;
  name: string;
  modelId: string;
}

export const CanvasLineData = types.model('CanvasLineData', {
  toGroupId: types.string,
  toNodeId: types.string,
  toIndex: types.number,
  fromNodeId: types.string,
  fromGroupId: types.string,
  fromIndex: types.number,
  id: types.string,
  type: 'Line',
});

export const CanvasNodeData = types.model('CanvasNodeData', {
  id: types.string,
  nodeId: types.string,
  numberOfInputs: types.number,
  numberOfOutputs: types.number,
  type: 'Node',
});

export const CanvasSourceData = types.model('CanvasSourceData', {
  index: types.number,
  nodeId: types.string,
  groupId: types.string,
  y1Factor: types.number,
  type: types.enumeration('type', ['Input', 'Output']),
});

export const CanvasLinePosition = types.model('CanvasLinePosition', {
  x1: types.number,
  x2: types.number,
  y1: types.number,
  y2: types.number,
  type: 'Line',
});

export const CanvasSourcePosition = types.model('CanvasNodePosition', {
  x: types.number,
  y: types.number,
  type: types.enumeration('type', ['Input', 'Output']),
});

export const CanvasNodePosition = types.model('CanvasNodePosition', {
  x: types.number,
  y: types.number,
  scale: types.number,
  type: 'Node',
});

export type PositionArgs =
  | typeof CanvasLinePosition.Type
  | typeof CanvasNodePosition.Type
  | typeof CanvasSourcePosition.Type;

export const CanvasObject = types
  .model('CanvasObject', {
    id: types.identifier,
    name: types.string,
    isDevice: types.boolean,
    isTimer: types.optional(types.boolean, false),
    timerValue: types.optional(types.number, 0),
    type: types.enumeration('type', ['Node', 'Input', 'Output', 'Line']),
    position: types.union(
      {
        dispatcher: data => {
          switch (data.type) {
            case 'Node':
              return CanvasNodePosition;
            case 'Input':
            case 'Output': {
              return CanvasSourcePosition;
            }
            default:
              return CanvasLinePosition;
          }
        },
      },
      CanvasLinePosition,
      CanvasNodePosition,
      CanvasSourcePosition
    ),
    data: types.union(
      {
        dispatcher: data => {
          switch (data.type) {
            case 'Node':
              return CanvasNodeData;
            case 'Input':
            case 'Output':
              return CanvasSourceData;
            default:
              return CanvasLineData;
          }
        },
      },
      CanvasLineData,
      CanvasSourceData,
      CanvasNodeData
    ),
  })
  .actions(self => {
    const updateCanvasPosition = (position: PositionArgs) => {
      self.position = position;
    };

    const updateTimerValue = (timerValue: number) => {
      self.timerValue = timerValue;
      self.name = 'Timer ' + timerValue.toString() + 's';
    };

    return {
      updateCanvasPosition,
      updateTimerValue,
    };
  });

export const Page = types
  .model('Page', {
    id: types.identifier,
    name: types.string,
    modelId: types.string,
    canvasObjects: types.array(CanvasObject),
  })
  .actions(self => {
    const addCanvasObject = (canvasObject: typeof CanvasObject.Type) => {
      self.canvasObjects.push(canvasObject);
    };
    const deleteCanvasObject = (id: string) => {
      const selectedCanvasObject = self.canvasObjects.find(
        item => item.id === id
      );
      if (selectedCanvasObject) {
        self.canvasObjects.remove(selectedCanvasObject);
      }
    };
    return {
      addCanvasObject,
      deleteCanvasObject,
    };
  });

const PagesStore = types
  .model('Pages', {
    pages: types.array(Page),
    currentPageId: types.safeReference(Page),
  })
  .actions(self => {
    const addPage = (page: PageArg) => {
      self.pages.push(Page.create({ ...page, canvasObjects: [] }));
      changeCurrentPage(page.id);
    };

    const changeCurrentPage = (currentPageId: string) => {
      //@ts-ignore
      self.currentPageId = currentPageId;
    };

    return {
      addPage,
      changeCurrentPage,
    };
  });

export default PagesStore;
