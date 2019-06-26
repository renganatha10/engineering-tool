import React from 'react';
// import { Canvas, Rect } from 'fabric/fabric-impl';

class SencondCom extends React.Component {
  public render() {
    return (
      <g>
        <text />
        <rect height={120} width={120} />
      </g>
    );
  }
}

//eslint-disable-next-line
class FabricComp extends React.Component {
  public constructor(props: {}) {
    super(props);
    this.state = {
      x: 100,
      y: 100,
    };
  }

  public componentDidMount() {
    setInterval(() => {
      //@ts-ignore
      const { x, y } = this.state;
      this.setState({ x: x + 10, y: y + 10 });
    }, 1000);
  }

  public render() {
    //@ts-ignore
    const { x, y } = this.state;
    return (
      <canvas>
        <SencondCom />
        <circle />
        <g>
          <circle />
          <text />
        </g>
        <rect left={200} top={200} height={x} width={y} />
      </canvas>
    );
  }
}

export default FabricComp;
