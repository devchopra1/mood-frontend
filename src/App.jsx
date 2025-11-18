import React, { useState, useEffect } from 'react';
import MoodSelector from './MoodSelector.jsx';
import PlaylistDisplay from './PlaylistDisplay.jsx';
import './index.css'; // Make sure styles are imported

// This is the new App component that handles user login
function App() {
  // State for the logged-in user's data
  const [user, setUser] = useState(null); 
  // State for the playlist
  const [playlist, setPlaylist] = useState([]);
  // State for errors
  const [error, setError] = useState(null); 
  // State for loading
  const [loading, setLoading] = useState(false);

  // This `useEffect` runs once when the app first loads
  useEffect(() => {
    // 1. Check for errors in the URL (from Spotify redirect)
    const params = new URLSearchParams(window.location.hash.substring(1));
    const urlError = params.get('error');
    if (urlError) {
      setError('Failed to log in. Please try again.');
    }

    // 2. Check if the user is already logged in (by calling our backend)
    // `withCredentials: true` is crucial for sending/receiving cookies
    fetch('http://localhost:8000/api/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          // If not OK (e.g., 401), user is not logged in
          return null; 
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setUser(data); // Save user data
        }
      })
      .catch(err => {
        // This catch is for network errors
        console.error('Could not fetch /api/me', err);
      });
  }, []); // The empty array [] means this runs only once

  // This function runs when a mood is selected
  const getPlaylist = async (selectedMood) => {
    if (!user) {
      setError('Please log in first.');
      return;
    }

    setError(null);
    setLoading(true);
    setPlaylist([]);
    
    try {
      // 3. Call the new /api/recommend endpoint
      const response = await fetch(
        `http://localhost:8000/api/recommend?mood=${selectedMood}`,
        { credentials: 'include' } // Send cookies
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      setPlaylist(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(`Failed to get songs. Is the backend server running?`);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---

  // If user data hasn't loaded yet
  if (!user) {
    // If we have an error, show it
    if (error) {
      return (
        <div className="App" style={{ textAlign: 'center' }}>
          <h1>Mood Mixer 🎧</h1>
          <p style={{ color: 'red' }}>{error}</p>
          <a href="http://localhost:8000/login" className="mood-selector button">
            Login with Spotify
          </a>
        </div>
      );
    }

    // If no user and no error, show the Login button
    return (
      <div className="App" style={{ textAlign: 'center' }}>
        <h1>Mood Mixer 🎧</h1>
        <p>Please log in to get personalized recommendations.</p>
        <a 
          href="http://localhost:8000/login" 
          className="mood-selector button"
          style={{textDecoration: 'none', display: 'inline-block'}}
        >
          Login with Spotify
        </a>
      </div>
    );
  }

  // If we have a user, show the full app!
  return (
    <div className="App">
      <h1>Mood Mixer 🎧</h1>
      <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
        Welcome, <strong>{user.display_name}</strong>!
      </p>
      
      <MoodSelector onMoodSelect={getPlaylist} />
      
      {loading && <p style={{ textAlign: 'center' }}>Finding songs based on your taste...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      {!loading && <PlaylistDisplay songs={playlist} />}
    </div>
  );
}

export default App;