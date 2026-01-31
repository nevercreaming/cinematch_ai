
import React, { useState } from 'react';
import { MediaItem } from '../types';
import { Star, Calendar, Film, Tv, Maximize2, Clapperboard, ExternalLink, Loader2 } from 'lucide-react';

interface RecommendationCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = item.posterUrl;

  const Placeholder = ({ isLoading }: { isLoading?: boolean }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-8 text-center relative overflow-hidden">
      <Clapperboard className={`w-24 h-24 text-white/5 absolute -top-4 -left-4 rotate-12 ${isLoading ? 'animate-pulse' : ''}`} />
      <Clapperboard className={`w-32 h-32 text-white/5 absolute -bottom-8 -right-8 -rotate-12 ${isLoading ? 'animate-pulse' : ''}`} />
      <div className="relative z-10 space-y-4">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
          {isLoading ? (
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin opacity-50" />
          ) : (
            <Film className="w-8 h-8 text-indigo-400 opacity-50" />
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-300 leading-tight">
          {item.title}
        </h3>
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-500/50">
          {isLoading ? 'Loading Visuals...' : 'Poster Pending'}
        </p>
      </div>
    </div>
  );

  return (
    <div 
      onClick={() => onClick(item)}
      className="group cursor-pointer glass rounded-3xl overflow-hidden shadow-xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative"
    >
      {/* Poster Area */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
        {/* Placeholder shown while loading or on error */}
        {(!isLoaded || imgError) && <Placeholder isLoading={!imgError && !isLoaded} />}

        {!imgError && imageUrl && (
          <img 
            src={imageUrl} 
            alt={item.title} 
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 absolute inset-0 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        
        {/* Image Source Attribution Link */}
        {!imgError && isLoaded && imageUrl && item.posterSourceUrl && (
          <a
            href={item.posterSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-24 left-4 z-40 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] text-slate-300 font-bold uppercase tracking-widest flex items-center gap-1 border border-white/10 hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            Source: {item.posterSource}
            <ExternalLink className="w-2 h-2" />
          </a>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 transform scale-75 group-hover:scale-100 transition-transform shadow-xl">
            <Maximize2 className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider z-30 shadow-lg">
          {item.type === 'Movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
          {item.type}
        </div>

        {/* Rating Badge */}
        {item.reviewScore && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/95 backdrop-blur-md text-black font-extrabold text-xs z-30 shadow-lg">
            <Star className="w-3 h-3 fill-black" />
            {item.reviewScore.toFixed(1)}
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1.5 z-30">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
             <Calendar className="w-3.5 h-3.5" />
             {item.year}
          </div>
          <h2 className="text-2xl font-black text-white line-clamp-2 leading-[1.1] drop-shadow-lg">
            {item.title}
          </h2>
        </div>
      </div>

      {/* Quick Summary Preview */}
      <div className="p-6 flex-grow space-y-4 bg-slate-900/30">
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 italic font-medium">
          "{item.reviewSnippet || 'No review snippet available.'}"
        </p>
        
        <div className="pt-4 border-t border-slate-800/50">
          <div className="flex flex-wrap gap-2">
            {item.streamingPlatforms && item.streamingPlatforms.length > 0 ? (
              <>
                {item.streamingPlatforms.slice(0, 3).map(platform => (
                  <span key={platform.name} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                    {platform.name}
                  </span>
                ))}
                {item.streamingPlatforms.length > 3 && (
                  <span className="text-slate-600 text-[9px] self-center font-bold">+{item.streamingPlatforms.length - 3}</span>
                )}
              </>
            ) : (
              <span className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">Search to find streaming</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RecommendationCard);
