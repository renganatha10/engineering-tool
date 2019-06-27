import { fabric } from 'fabric';

const Link = fabric.util.createClass(fabric.Line, {
  type: 'link',
  superType: 'link',
  //@ts-ignore
  initialize(fromPort, toPort, options) {
    options = options || {};
    const coords = [fromPort.left, fromPort.top, toPort.left, toPort.top];
    this.callSuper('initialize', coords, options);
  },
  toObject() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      id: this.get('id'),
      name: this.get('name'),
      superType: this.get('superType'),
      configuration: this.get('configuration'),
      fromNode: this.get('fromNode'),
      fromPort: this.get('fromPort'),
      toNode: this.get('toNode'),
      toPort: this.get('toPort'),
    });
  },
  //@ts-ignore
  _render(ctx) {
    this.callSuper('_render', ctx);
    ctx.save();
    const xDiff = this.x2 - this.x1;
    const yDiff = this.y2 - this.y1;
    const angle = Math.atan2(yDiff, xDiff);
    ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
    ctx.rotate(angle);
    ctx.beginPath();
    // Move 5px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
    ctx.moveTo(5, 0);
    ctx.lineTo(-5, 5);
    ctx.lineTo(-5, -5);
    ctx.closePath();
    ctx.fillStyle = this.stroke;
    ctx.fill();
    ctx.restore();
  },
});

//@ts-ignore
Link.fromObject = function(options, callback) {
  return callback(new Link(options));
};

export default Link;
