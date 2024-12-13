import React, { useState, useEffect } from 'react';
import { authenticateSpotify, fetchPlaylists, fetchSongsByPlaylist, playTrack, setShuffle, fetchCurrentSong } from './spotify';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';
import { FaSpotify, FaGithub } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';

const Game = () => {
  const { data: session } = useSession();
  const [players, setPlayers] = useState(['Alex', 'Hafsa', 'Emil']);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [scores, setScores] = useState({ Alex: 0, Hafsa: 0, Emil: 0 });
  const [currentSong, setCurrentSong] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [revealSong, setRevealSong] = useState(false);

  useEffect(() => {
    const fetchPlaylistsData = async () => {
      await authenticateSpotify();
      const fetchedPlaylists = await fetchPlaylists();
      setPlaylists(fetchedPlaylists);
    };
    fetchPlaylistsData();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      if (selectedPlaylist) {
        const fetchedSongs = await fetchSongsByPlaylist(selectedPlaylist);
        setSongs(fetchedSongs);
        await setShuffle(true);
        const randomSong = getRandomSong(fetchedSongs);
        if (randomSong) {
          await playTrack(randomSong.uri);
          setCurrentSong(randomSong);
        }
      }
    };
    fetchSongs();
  }, [selectedPlaylist]);

  const getRandomSong = (songsArray) => {
    if (songsArray.length === 0) {
      return null;
    }
    return songsArray[Math.floor(Math.random() * songsArray.length)];
  };

  const handlePlayerGuess = (player) => { {
      setScores((prevScores) => ({
        ...prevScores,
        [player]: prevScores[player] + 1
      }));
    }
  };

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylist(playlistId);
    setRevealSong(false);
  };

  const handleRevealSong = () => {
    setRevealSong(true);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="self-start">
        <ThemeToggle />
      </div>
      <h1 className="text-2xl bg-gradient-to-r from-green-950 to-green-700 hover:from-green-700 hover:to-black rounded-lg transition duration-3000">Hitster Digital</h1>
      <FaSpotify size={48} className="text-green-500 mb-4 mt-4" />
      {!session ? (
        <Button variant="outline" onClick={() => signIn('github')}>
          Sign in with <FaGithub size={24} className="ml-2" />
        </Button>
      ) : (
        <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Playlist To Start Guessing:</h2>
        {playlists.map((playlist) => (
          <Button variant="outline" key={playlist.id} onClick={() => handlePlaylistSelect(playlist.id)} className="m-1">
            {playlist.name.length > 15 ? `${playlist.name.slice(0, 10)}...` : playlist.name}
          </Button>
        ))}
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Players</h2>
        {players.map((player) => (
          <Button variant="outline" key={player} onClick={() => handlePlayerGuess(player)} className="m-1">
            {player} ({scores[player]})
          </Button>
        ))}
      </div>
      <Button variant="outline" className="m-1" onClick={handleRevealSong}>
        Reveal Song
      </Button>
      {revealSong && currentSong && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 mt-2">Current Song</h2>
          <div className="flex flex-col items-center">
            <img src={currentSong.album.images[0].url} alt={currentSong.name} className="w-48 h-48 rounded-lg mb-2" />
            {currentSong.name} by {currentSong.artists.map((artist) => artist.name).join(', ')}
          </div>
          <h2 className="text-xl font-semibold mb-2 mt-10">Don't forget to add a score!</h2>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default Game;