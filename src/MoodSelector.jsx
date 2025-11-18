import React from 'react';

// This component receives a function `onMoodSelect` as a prop from App.jsx
function MoodSelector({ onMoodSelect }) {
  const moods = ['Happy', 'Sad', 'Energetic', 'Chill'];

  return (
    <div className="mood-selector">
      {moods.map((mood) => (
        <button key={mood} onClick={() => onMoodSelect(mood.toLowerCase())}>
          {mood}
        </button>
      ))}
    </div>
  );
}

export default MoodSelector;