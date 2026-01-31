
import React from 'react';

interface GenreButtonProps {
  genre: string;
  isActive: boolean;
  onClick: () => void;
}

const GenreButton: React.FC<GenreButtonProps> = ({ genre, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
        ${isActive 
          ? 'genre-btn-active text-white scale-105' 
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}
      `}
    >
      {genre}
    </button>
  );
};

export default React.memo(GenreButton);
