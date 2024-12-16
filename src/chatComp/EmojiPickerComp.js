import React from 'react';

function EmojiPicker({ onSelectEmoji }) {
  const emojis = ['😊', '😂', '❤️', '👍', '🎉'];

  return (
    <div>
      {emojis.map((emoji, index) => (
        <span
          key={index}
          onClick={() => onSelectEmoji(emoji)}
          style={{ cursor: 'pointer', fontSize: '20px', margin: '5px' }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export default EmojiPicker;
    