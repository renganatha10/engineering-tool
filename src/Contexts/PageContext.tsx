import React, { useState, useEffect, createContext } from 'react';
import { fabric } from 'fabric';
import eventEmitter from '../utils/eventListener';

interface ContextLinePosition {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
}

interface ContextNodePosition {
  x: number;
  y: number;
}

type ContextType = 'Node' | 'Line';

interface Context {
  name?: string;
  data: any;
  type: ContextType;
  position: ContextLinePosition | ContextNodePosition;
  isDevice: boolean;
  isTimer: boolean;
}

interface NodeData {
  data: any;
  isDevice: boolean;
  isTimer: boolean;
  name: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Page {
  id: string;
  name: string;
  context: Context[];
}

export interface PageContextType {
  currentPageId: string;
  pages: Page[];
  onAddingPage?: (page: Page) => void;
  onChangeCurrentPageId?: (id: string) => void;
  updatePageObjects?: (objects: fabric.Object[]) => void;
}

interface Props {
  children: React.ReactNode;
  initPages: Page[];
  currentPageId: string;
}

export const PagesContext = createContext<PageContextType>({
  currentPageId: '',
  pages: [],
});

const PagesState = (props: Props) => {
  const { children, initPages, currentPageId: id } = props;
  const [pages, addPage] = useState<Page[]>(initPages);
  const [currentPageId, changeCurrentPageId] = useState<string>(id);

  useEffect(() => {
    window.localStorage.setItem('pages', JSON.stringify(pages));
  }, [pages]);

  const onAddingPage = (page: Page) => {
    const newPages = pages.concat(page);
    changeCurrentPageId(page.id);
    addPage(newPages);
  };

  const addNodes = (nodeData: NodeData) => {
    const page = pages.find(page => page.id === currentPageId);
    if (page) {
      page.context.push({
        type: 'Node',
        name: nodeData.name,
        data: nodeData.data,
        isDevice: nodeData.isDevice,
        isTimer: nodeData.isTimer,
        position: {
          x: nodeData.position.x,
          y: nodeData.position.y,
        },
      });
      // console.log('page device:', page.context);
    }
  };

  eventEmitter.addListener('ADD_NODES', addNodes);

  const lineCreated = (line: fabric.Line) => {
    const page = pages.find(page => page.id === currentPageId);
    if (page) {
      page.context.push({
        type: 'Line',
        isDevice: false,
        isTimer: false,
        name: 'line',
        data: line.data,
        position: {
          x1: line.x1,
          x2: line.x2,
          y1: line.y1,
          y2: line.y2,
        },
      });
      // console.log('page line:', page.context);
    }
  };

  eventEmitter.addListener('LINE_CREATED', lineCreated);

  // const movedNodes = (option: fabric.IEvent) => {
  //   console.log('inside moved node event', option);
  // };

  // eventEmitter.addListener('NODE_MOVED', movedNodes);

  // const updatePageObjects = (objects: fabric.Object[]) => {
  //   const page = pages.find(page => currentPageId === page.id);
  //   if (page) {
  //     const indexOfPage = pages.indexOf(page);
  //     const newPage = { ...page, context: objects };
  //     const newPages = [
  //       ...pages.slice(0, indexOfPage),
  //       newPage,
  //       ...pages.slice(indexOfPage + 1),
  //     ];
  //     addPage(newPages);
  //   }
  // };

  const onChangeCurrentPageId = (id: string) => {
    changeCurrentPageId(id);
  };

  return (
    <PagesContext.Provider
      value={{
        // updatePageObjects,
        currentPageId,
        pages,
        onAddingPage,
        onChangeCurrentPageId,
      }}
    >
      {children}
    </PagesContext.Provider>
  );
};

export default PagesState;
