import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  BOX: 'box',
};

const DraggableBox = ({ id, left, top, children }) => {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { id, left, top },
  }));

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left,
        top,
        border: '1px solid black',
        padding: '8px',
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
};
export const CustomizableSection = () => {
    const [boxes, setBoxes] = useState({});
    const [background, setBackground] = useState(null);
    const [, drop] = useDrop(() => ({
      accept: ItemTypes.BOX,
      drop: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveBox(item.id, left, top);
      },
    }));
  
    const moveBox = (id, left, top) => {
      setBoxes((prevBoxes) => ({
        ...prevBoxes,
        [id]: { left, top },
      }));
    };
  
    const addBox = () => {
      const id = new Date().getTime();
      setBoxes((prevBoxes) => ({
        ...prevBoxes,
        [id]: { left: 0, top: 0 },
      }));
    };
  
    const handleBackgroundChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setBackground(e.target.result);
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <button onClick={addBox}>Add Box</button>
          <input type="file" onChange={handleBackgroundChange} />
        </div>
        <div
          id="custom-section"
          ref={drop}
          style={{
            width: '100%',
            height: '500px',
            position: 'relative',
            border: '1px solid gray',
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
          }}
        >
          {Object.keys(boxes).map((key) => (
            <DraggableBox key={key} id={key} left={boxes[key].left} top={boxes[key].top}>
              Box {key}
            </DraggableBox>
          ))}
        </div>
      </div>
    );
  };
  