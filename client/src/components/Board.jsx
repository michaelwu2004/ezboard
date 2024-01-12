import { useRef, useState, useEffect } from 'react'
import socket from '../helper/socket';

function Board({ room }) {

  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)

  const dpi = window.devicePixelRatio;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')

    const resizeCanvas = () => {

      canvas.width = window.innerWidth * dpi;
      canvas.height = window.innerHeight * dpi;
      context.scale(dpi, dpi)

    }

    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const getMousePosition = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = (window.innerWidth / rect.width);
      const scaleY = (window.innerHeight / rect.height);

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };

    };


    let prevPos;
    let currPos;

    const draw = (e) => {
      if (!drawing) return;

      prevPos = currPos;
      currPos = getMousePosition(e);

      context.beginPath();
      context.moveTo(prevPos.x, prevPos.y);
      console.log("here", currPos.x, currPos.y)
      context.lineTo(currPos.x, currPos.y);
      context.strokeStyle = 'black';
      context.lineWidth = 3;
      context.stroke();

      socket.emit('draw', { room, prevPos, currPos });
    };

    const socketDraw = (prevPt, currPt) => {
      context.beginPath();
      context.moveTo(prevPt.x, prevPt.y);
      context.lineTo(currPt.x, currPt.y);
      context.strokeStyle = 'black';
      context.lineWidth = 3;
      context.stroke();
      context.closePath();
    }

    socket.on("drawing", (data) => {
      socketDraw(data.prevPos, data.currPos)
    })

    const startDrawing = (e) => {
      setDrawing(true)
      currPos = getMousePosition(e);
    }

    const finishDrawing = (e) => {
      setDrawing(false)
      e.preventDefault();
    }

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', finishDrawing)
    canvas.addEventListener('mouseleave', finishDrawing)

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', finishDrawing);
      canvas.removeEventListener('mouseleave', finishDrawing)
    };
  }, [drawing, room]);

  return (
    <canvas className='border w-full h-full'
      ref={canvasRef}
    />
  )
}

export default Board