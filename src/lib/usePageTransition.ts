import { useLocation } from "react-router-dom";

const routeOrder = ["/", "/settings"];

export function usePageTransition(path: string) {
  const location = useLocation();

  function getDirection() {
    const currentIndex = routeOrder.indexOf(location.pathname);
    const targetIndex = routeOrder.indexOf(path);
    console.log(currentIndex, targetIndex);
    return targetIndex > currentIndex ? 1 : -1;
  }

  return {
    initial: { x: `${100 * getDirection()}%`, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: `${-100 * getDirection()}%`, opacity: 0 },
    transition: { type: "spring", stiffness: 380, damping: 30 },
  };
}
