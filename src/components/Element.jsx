import React from 'react';

const Element = ({number, top, left, handleRemove, index, isHint}) => {
    
    const styles = {
        top: top,
        left: left
    }
    return (
        <div className={'element ' + (isHint ? 'hint' : '')} style={styles} onClick={(e) => handleRemove(e, index)}>
            {number}
        </div>
    );
};

export default Element;