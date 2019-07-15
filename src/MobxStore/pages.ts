import { types } from 'mobx-state-tree';

export interface PageArg {
  id: string;
  name: string;
}

const CanvasLineData = types.model('CanvasLineData', {
  toGroupId: types.string,
  toNodeId: types.string,
  toIndex: types.number,
  fromNodeId: types.string,
  fromGroupId: types.string,
  fromIndex: types.number,
  id: types.string,
});

const CanvasNodeData = types.model('CanvasNodeData', {
  id: types.string,
  nodeId: types.string,
});

const CanvasSourceData = types.model('CanvasSourceData', {
  index: types.number,
  nodeId: types.string,
  groupId: types.string,
  y1Factor: types.number,
});

const CanvasLinePosition = types.model('CanvasLinePosition', {
  x1: types.number,
  x2: types.number,
  y1: types.number,
  y2: types.number,
});

const CanvasNodePosition = types.model('CanvasNodePosition', {
  x: types.number,
  y: types.number,
});

export type PositionArgs =
  | typeof CanvasLinePosition.Type
  | typeof CanvasNodePosition.Type;

export const CanvasObject = types
  .model('CanvasObject', {
    id: types.identifier,
    name: types.string,
    isDevice: types.boolean,
    type: types.enumeration('type', ['Node', 'Source', 'Line']),
    position: types.union(CanvasLinePosition, CanvasNodePosition),
    data: types.union(CanvasLineData, CanvasSourceData, CanvasNodeData),
  })
  .actions(self => {
    const updateCanvasPosition = (position: PositionArgs) => {
      self.position = position;
    };
    return {
      updateCanvasPosition,
    };
  });

export const Page = types
  .model('Page', {
    id: types.identifier,
    name: types.string,
    canvasObjects: types.array(CanvasObject),
  })
  .actions(self => {
    const addCanvasObject = (canvasObject: typeof CanvasObject.Type) => {
      self.canvasObjects.push(canvasObject);
    };
    return {
      addCanvasObject,
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
