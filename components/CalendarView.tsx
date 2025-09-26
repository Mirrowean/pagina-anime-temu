import React, { useState } from 'react';
import type { Schedule, ScheduledAnime } from '../types';
import { ScheduledAnimeCard } from './ScheduledAnimeCard';

interface CalendarViewProps {
  schedule: Schedule;
  onAnimeSelect: (anime: ScheduledAnime) => void;
}

const dayOrder = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const getTodaySpanish = (): string => {
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return days[new Date().getDay()];
};

export const CalendarView: React.FC<CalendarViewProps> = ({ schedule, onAnimeSelect }) => {
  const [selectedDay, setSelectedDay] = useState<string>(getTodaySpanish());

  const animesForDay = schedule[selectedDay] || [];

  return (
    <section>
      <h2 className="text-3xl font-bold text-text-primary mb-6 border-b-2 border-brand-primary pb-2">Weekly Schedule</h2>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {dayOrder.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 capitalize ${selectedDay === day ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'bg-base-300 hover:bg-base-100'}`}
          >
            {day}
          </button>
        ))}
      </div>

      {animesForDay.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {animesForDay.map(anime => (
            <ScheduledAnimeCard key={anime.id} anime={anime} onSelect={() => onAnimeSelect(anime)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <p className="text-text-secondary">No anime scheduled for release on this day.</p>
        </div>
      )}
    </section>
  );
};