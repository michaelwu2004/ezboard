import { useRef, useState, useEffect } from 'react'

function Board({ socket, room }) {

  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    let prevX, prevY;
    let currX, currY;

    const draw = (e) => {
      if (!drawing) return;

      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;

      context.beginPath();
      context.arc(currX, currY, 1, 0, 1 * Math.PI);
      context.moveTo(prevX, prevY);

      context.lineTo(currX, currY);
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      // Emit socket event or perform other actions here if needed
      socket.emit("draw", { room, prevX, prevY, currX, currY })
    };

    const socketDraw = (px, py, cx, cy) => {
      context.beginPath();
      context.arc(cx, cy, 1, 0, 1 * Math.PI);
      context.moveTo(px, py);
      context.lineTo(cx, cy);
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    }

    socket.on("drawing", (data) => {
      socketDraw(data.prevX, data.prevY, data.currX, data.currY)
    })

    const startDrawing = (e) => {
      setDrawing(true)
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
    }

    const finishDrawing = () => {
      setDrawing(false)
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
  }, [drawing]);

  return (
    <div className='p-2 border'>
      <canvas className='border'
        ref={canvasRef}

      />
    </div>
  )
}

export default Board