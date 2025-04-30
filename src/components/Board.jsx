import React, { useEffect, useRef, useState } from "react";
import Element from "./Element";

const Board = () => {
  const [point, setPoint] = useState(0);
  const [elements, setElements] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);

  const [isLose, setIsLose] = useState(false);
  const [isPlay, setIsPlay] = useState(false);

  const [time, setTime] = useState(0);

  const [isAuto, setAuto] = useState(false);

  const handleClick = () => {
    if (point <= 0) return alert("Vui lòng nhập Points lớn hơn 0");
    let max = 600 - 50;
    let min = 0;
    setNextNumber(1);
    setIsLose(false);
    setTime(0);
    setElements([]);
    for (let i = point; i > 0; i--) {
      let element = {
        number: Number(i),
        top: Math.floor(Math.random() * (max - min + 1)) + min,
        left: Math.floor(Math.random() * (max - min + 1)) + min,
        removingTime: 3,
        isHint: false,
        isRemoving: false,
      };
      setElements((prevElements) => [...prevElements, element]);
    }
    setIsPlay(true);
    removeAutoPlayTimeOut();
  };

  const handleRemove = (index) => {
    if (isLose) return;
    if (Number(elements[index].number) === nextNumber - 1) return;
    if (Number(elements[index].number) === nextNumber) {
      setElements((prev) =>
        prev.map((el, i) =>
          i === index
            ? { ...el, isRemoving: true, isHint: false }
            : el
        )
      );
      
      console.log("deleted", elements.length);

      if (nextNumber === elements[0].number) {
        return setNextNumber(0);
      }
      setNextNumber(elements[index].number + 1);
    } else {
      setIsLose(true);
    }
  };

  useEffect(() => {
    if(isPlay && !isLose && elements.length > 0) {
        const timer = setInterval(() => {
            setTime(prev => Math.round((prev + 0.1) * 10) / 10);
        },100)
        return () => clearInterval(timer);
    }
}, [isPlay, isLose, elements])

  const timeoutIdsRef = useRef([]);
  const handleAutoPlay = () => {
    const changeAuto = !isAuto;
    setAuto(changeAuto);
    const snapshot = [...elements];
      if (changeAuto) {
      for (let i = snapshot.length - 1; i >= 0; i--) {
        const id = setTimeout(() => {
          setElements((prev) =>
            prev.map((el, index) =>
              index === i
                ? { ...el, isRemoving: true, isHint: false }
                : el
            )
          );
          if (snapshot[i].number === snapshot[0].number) {
            setNextNumber(0);
          } else {
            setNextNumber(snapshot[i].number + 1);
          }
        }, (snapshot.length - 1 - i) * 1000);
        timeoutIdsRef.current.push(id);
      }
    } else {
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
      timeoutIdsRef.current = [];
    }
  };

  const removeAutoPlayTimeOut = () => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
    setAuto(false);
  }

  const hint = (e) => {
    if (e.target.disabled) return;

    setElements((prev) =>
      prev.map((obj) =>
        obj.number === nextNumber ? { ...obj, isHint: true } : obj
      )
    );
    e.target.disabled = true;
    setTimeout(() => (e.target.disabled = false), 3000);
  };

  return (
    <div className="board">
      <div className="control">
        {isPlay ? (
          elements.length === 0 ? (
            <h1 className="complete">All cleared</h1>
          ) : isLose ? (
            <h1 className="fail">Game Over</h1>
          ) : (
            <h1>Let's play</h1>
          )
        ) : (
          <h1>Let's play</h1>
        )}
        <div>
          <label htmlFor="points">Points</label>
          <input
            type="number"
            id="points"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="time">Time</label>
          <span id="time">{time}s</span>
        </div>
        <div className="btns">
          <div>
            <button onClick={handleClick}>
              {!isPlay ? "Play" : "Restart"}
            </button>
            {isPlay && !isLose && elements.length > 0 ? (
              <button onClick={handleAutoPlay}>
                Auto Play {isAuto ? "OFF" : "ON"}
              </button>
            ) : null}
          </div>
          {isPlay && !isLose && elements.length > 0 ? (
            <button onClick={(e) => hint(e)}>Hint</button>
          ) : null}
        </div>
      </div>
      <div className="display">
        {elements.map((e, i) => (
          <Element
            key={e.number}
            index={i}
            number={e.number}
            removingTime={e.removingTime}
            top={e.top}
            left={e.left}
            handleRemove={handleRemove}
            isHint={e.isHint}
            isPause={isLose}
            isRemoving={e.isRemoving}
            setElements={setElements}
          />
        ))}
      </div>
      {isPlay && !isLose && elements.length > 0 && nextNumber !== 0 ? (
        <p>Next: {nextNumber}</p>
      ) : null}
    </div>
  );
};

export default Board;
