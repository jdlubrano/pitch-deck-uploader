import React, { useEffect, useRef } from "react";

const PdfPage = ({ pdfPage }) => {
  const canvasRef = useRef(null);
  const viewport = pdfPage.getViewport({scale: 0.4});

  async function renderPdfPage() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return
    }

    const canvasContext = canvas.getContext('2d');

    const renderContext = {
      canvasContext,
      viewport
    };

    await pdfPage.render(renderContext).promise;
  }

  useEffect(() => { renderPdfPage() }, [canvasRef]);

  return (
    <canvas ref={canvasRef} height={viewport.height} width={viewport.width} />
  );
};

export default PdfPage;
