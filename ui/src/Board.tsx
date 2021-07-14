import React, {useEffect, useRef} from 'react';
import {LocalUser} from './types';
// import {debounce} from 'debounce';


interface BoardProps {
  localUser : LocalUser
}


const Board = ({localUser} : BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [users, updateUsers] = useState<Users>();
  const isDrawingRef = useRef<boolean>(false);
  const shouldConnectRef = useRef<boolean>(false);
  const x = useRef<number>(0);
  const y = useRef<number>(0);
  const draw = (x : number, y : number, shouldConnect : boolean) => {
    const context = canvasRef.current?.getContext('2d');

    if (context) {
      context.lineJoin = 'round';
      context.lineWidth = localUser.thickness;
      context.lineCap = 'round';
      context.strokeStyle = localUser.color;
      context.beginPath();
      if (shouldConnect) {
        context.moveTo(localUser.lastX, localUser.lastY);
      } else {
        context.moveTo(x - 1, y -1);
      }
      context.lineTo(x, y);
      context.stroke();
      localUser.lastX = x;
      localUser.lastY = y;
    }
  };

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', (event : MouseEvent) => {
        x.current = (event.clientX - (canvasRef.current?.offsetLeft || 0));
        y.current = (event.clientY - (canvasRef.current?.offsetTop || 0));
        if (isDrawingRef.current) {
          draw(x.current, y.current, shouldConnectRef.current);
          shouldConnectRef.current = true;
        }
      });
      canvasRef.current.addEventListener('mousedown', (event : MouseEvent) => {
        isDrawingRef.current = true;
        draw(x.current, y.current, shouldConnectRef.current);
        shouldConnectRef.current = true;
      });
      canvasRef.current.addEventListener('mouseup', (event : MouseEvent) => {
        isDrawingRef.current = false;
        shouldConnectRef.current = false;
      });
      canvasRef.current.addEventListener('mouseleave', (event : MouseEvent) => {
        isDrawingRef.current = false;
        shouldConnectRef.current = false;
      });
    }
  }, [canvasRef]);

  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width="500"
      height="500">

    </canvas>
  );
};

export default Board;
