import React, {useEffect, useRef, useState} from 'react';
import {LocalUser} from './types';
import {debounce} from 'debounce';


interface BoardProps {
  localUser : LocalUser
}


const Board = ({localUser} : BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [users, updateUsers] = useState<Users>();
  const [isDrawing, _toggleIsDrawing] = useState<boolean>(false);
  const isDrawingRef = useRef<boolean>(isDrawing);
  const shouldConnectRef = useRef<boolean>();
  const x = useRef<number>(0);
  const y = useRef<number>(0);
  const toggleIsDrawing = (value : boolean) => {
    _toggleIsDrawing(value);
    isDrawingRef.current = value;
  };
  const draw = () => {
    const context = canvasRef.current?.getContext('2d');
    debounce(() => {
      if (context) {
        context.lineJoin = 'round';
        context.lineWidth = localUser.thickness;
        context.lineCap = 'round';
        context.strokeStyle = localUser.color;
        context.beginPath();
        console.log('drawing', shouldConnectRef.current, localUser.lastX, x);
        if (shouldConnectRef.current) {
          console.log('connecting');
          context.moveTo(localUser.lastX, localUser.lastY);
        } else {
          console.log('notconnecting');
          context.moveTo(x.current - 1, y.current -1);
        }
        context.lineTo(x.current, y.current);
        context.stroke();
        localUser.lastX = x.current;
        localUser.lastY = y.current;
      }
    }, 500, true)();
  };

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', (event : MouseEvent) => {
        x.current = (event.clientX - (canvasRef.current?.offsetLeft || 0));
        y.current = (event.clientY - (canvasRef.current?.offsetTop || 0));
        if (isDrawingRef.current) {
          console.log('drawing from move');
          draw();
        }
      });
      canvasRef.current.addEventListener('mousedown', (event : MouseEvent) => {
        console.log('down', isDrawingRef.current);
        toggleIsDrawing(true);
      });
      canvasRef.current.addEventListener('mouseup', (event : MouseEvent) => {
        console.log('stopped', isDrawingRef.current);
        toggleIsDrawing(false);
        shouldConnectRef.current = false;
      });
      canvasRef.current.addEventListener('mouseleave', (event : MouseEvent) => {
        console.log('leave', isDrawingRef.current);
        toggleIsDrawing(false);
        shouldConnectRef.current = false;
      });
    }
  }, [canvasRef]);

  useEffect(() => {
    console.log('useEffect', isDrawing);
    if (isDrawingRef.current) {
      setTimeout(() => {
        if (isDrawingRef.current) {
          shouldConnectRef.current = true;
        }
      }, 150);
    }
  }, [isDrawingRef.current]);
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
