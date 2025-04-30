import React, { useEffect, useState } from "react";

const Element = ({
  index,
  number,
  removingTime,
  top,
  left,
  handleRemove,
  isHint,
  isPause,
  isRemoving,
  setElements
}) => {
  const [countdown, setCountdown] = useState(removingTime);

  useEffect(() => {
    if (!isRemoving) return; 
    if (isPause) return;

    const tick = () => {
      setCountdown((prev) => {
        if (prev <= 0.1) {
            setElements(prev => prev.filter((_, i) => i !== index))
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
    });
    };

    const id = setTimeout(tick, 100);
    return () => clearTimeout(id);
  }, [countdown, isPause, isRemoving]);


  return (
    <div
        className={`element ${isHint ? 'hint' : ''} ${isPause ? 'pause' : ''} ${isRemoving ? 'disappear' : ''}`}
      style={{ top, left }}
      onClick={() => handleRemove(index)}
    >
      <p>{number}</p>
      {isRemoving && <span>{countdown.toFixed(1)}s</span>}
    </div>
  );
};

export default Element;
