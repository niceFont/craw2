/* eslint-disable max-len */
import React, {useEffect, useRef} from 'react';
import {useRecoilValue} from 'recoil';
import {connectedSocketAtom, userAtom, User} from '../store/atoms';
import {LocalUser} from '../types';


interface BoardProps {
  settings: {
    color: string,
    thickness: number
  }
}

interface Point {
  x : number,
  y : number,
  isConnected: boolean
}
const sendMessage = (socket: WebSocket, user : User, messageBody : object) => {
  socket.send(JSON.stringify({
    ...messageBody,
    ...user,
    authToken: user.token,
  }));
};


const Board = ({settings} : BoardProps) => {
  const socket = useRecoilValue(connectedSocketAtom);
  const localUserInfo = useRecoilValue(userAtom);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const points = useRef<Array<Point>>([]);
  const localProgress = useRef<number>(0);
  const lastPosition = useRef<{ lastX: number, lastY: number}>({
    lastX: 0,
    lastY: 0,
  });
  const draw = () => {
    const context = canvasRef.current?.getContext('2d');
    if (context && points.current) {
      for (let progress = localProgress.current; progress < points.current.length; progress++) {
        context.lineWidth = settings.thickness;
        context.strokeStyle = settings.color;
        context.beginPath();
        context.lineJoin = 'round';
        context.lineCap = 'round';
        if (points.current[progress].isConnected) {
          context.moveTo(lastPosition.current.lastX, lastPosition.current.lastY);
        } else {
          context.moveTo(points.current[progress].x - 1, points.current[progress].y -1);
        }
        context.lineTo(points.current[progress].x, points.current[progress].y);
        context.stroke();
        lastPosition.current.lastX = points.current[progress].x;
        lastPosition.current.lastY = points.current[progress].y;
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
      if (socket && localUserInfo) {
        sendMessage(socket, localUserInfo, {
          payload: coordinate,
          type: 'drawing',
        });
      }
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
