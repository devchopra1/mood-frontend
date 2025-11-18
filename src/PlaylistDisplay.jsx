import React from 'react';

// This component receives the list of songs as a prop
function PlaylistDisplay({ songs }) {
  
  // App.jsx handles the "Loading..." and "Error" messages.
  // This component will only show "Click a mood..." on the initial load
  // when the song list is empty and no loading/error is active.
  if (songs.length === 0) {
    // We check this to avoid showing "Click a mood..." *after* an error.
    const appError = document.querySelector('.App p[style*="color: red"]');
    if (appError) {
      return null; // Don't show anything if an error is already visible
    }
    
    // We also check to avoid showing this while "Loading..."
    const loadingMsg = document.querySelector('.App p[style*="text-align: center"]');
    if (loadingMsg) {
        return null; // Don't show anything if loading
    }
    
    return <p style={{ textAlign: 'center' }}>Click a mood to see songs!</p>;
  }

  // If we have songs, map over them and display them
  return (
    <div className="playlist-display">
      {songs.map((song) => (
        <div key={song.id} className="song-item">
          {/* Use the first album image, or a placeholder if none exists */}
          <img 
            src={song.album.images[0]?.url || 'https://placehold.co/64x64/282828/b3b3b3?text=N/A'} 
            alt={song.album.name} 
          />
          <div>
            {/* Link to the song on Spotify, opening in a new tab */}
            <a
              href={song.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>{song.name}</h3>
            </a>
            {/* Join all artist names with a comma */}
            <p>{song.artists.map((artist) => artist.name).join(', ')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlaylistDisplay;