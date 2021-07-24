/* eslint-disable max-len */
import React, {useEffect, useRef} from 'react';
import {LocalUser} from './types';
// import {debounce} from 'debounce';


interface BoardProps {
  localUser : LocalUser
}

interface Point {
  x : number,
  y : number,
  isConnected: boolean
}


const Board = ({localUser} : BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const points = useRef<Array<Point>>([]);
  const localProgress = useRef<number>(0);
  const draw = () => {
    const context = canvasRef.current?.getContext('2d');
    if (context && points.current) {
      for (let progress = localProgress.current; progress < points.current.length; progress++) {
        context.lineWidth = localUser.thickness;
        context.strokeStyle = localUser.color;
        context.beginPath();
        context.lineJoin = 'round';
        context.lineCap = 'round';
        if (points.current[progress].isConnected) {
          context.moveTo(localUser.lastX, localUser.lastY);
        } else {
          context.moveTo(points.current[progress].x - 1, points.current[progress].y -1);
        }
        context.lineTo(points.current[progress].x, points.current[progress].y);
        context.stroke();
        localUser.lastX = points.current[progress].x;
        localUser.lastY = points.current[progress].y;
        console.log(localProgress, progress);
        localProgress.current = progress;
      }
    }
  };

  const handleMouseMove = (event : MouseEvent) => {
    const coordinate = {
      x: (event.clientX - (canvasRef.current?.offsetLeft || 0)),
      y: (event.clientY - (canvasRef.current?.offsetTop || 0)),
      isConnected: isDrawingRef.current,
    };
    if (isDrawingRef.current) {
      points.current = [...points.current, coordinate];
      draw();
    }
  };

  const handleMouseDown = (event : MouseEvent) => {
    const coordinate = {
      x: (event.clientX - (canvasRef.current?.offsetLeft || 0)),
      y: (event.clientY - (canvasRef.current?.offsetTop || 0)),
      isConnected: false,
    };
    points.current = [...points.current, coordinate];
    draw();
    isDrawingRef.current = true;
  };
  const handleMouseUp = (event : MouseEvent) => {
    points.current = [];
    localProgress.current = 0;
    isDrawingRef.current = false;
  };
  const handleMouseLeave = (event : MouseEvent) => {
    isDrawingRef.current = false;
  };

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', handleMouseMove, false);
      canvasRef.current.addEventListener('mousedown', handleMouseDown, false);
      canvasRef.current.addEventListener('mouseup', handleMouseUp, false);
      canvasRef.current.addEventListener('mouseleave', handleMouseLeave, false);
    }

    return () => {
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown);
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      canvasRef.current?.removeEventListener('mouseup', handleMouseUp);
    };
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
