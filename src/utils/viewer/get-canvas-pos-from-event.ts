export function getCanvasPosFromEvent(event): number[] {
  const canvasPos: number[] = [];

  if (!event) {
    event = window.event;
    canvasPos[0] = event.x;
    canvasPos[1] = event.y;
  } else {
    let element = event.target;
    let totalOffsetLeft = 0;
    let totalOffsetTop = 0;
    let totalScrollX = 0;
    let totalScrollY = 0;

    while (element.offsetParent) {
      totalOffsetLeft += element.offsetLeft;
      totalOffsetTop += element.offsetTop;
      totalScrollX += element.scrollLeft;
      totalScrollY += element.scrollTop;
      element = element.offsetParent;
    }
    canvasPos[0] = event.pageX + totalScrollX - totalOffsetLeft;
    canvasPos[1] = event.pageY + totalScrollY - totalOffsetTop;
  }

  return canvasPos;
}
