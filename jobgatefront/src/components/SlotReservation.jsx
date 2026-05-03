import React, { useMemo, useState } from 'react';

// Composant autonome pour réserver des créneaux (aucune dépendance externe)
const timeOptions = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

const SlotReservation = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStart, setSelectedStart] = useState('');
  const [duration, setDuration] = useState(30); // minutes
  const [note, setNote] = useState('');
  const [slots, setSlots] = useState([]);

  const endTime = useMemo(() => {
    if (!selectedStart) return '';
    const [h, m] = selectedStart.split(':').map(Number);
    const start = new Date(0, 0, 0, h, m, 0);
    const end = new Date(start.getTime() + duration * 60000);
    const hh = String(end.getHours()).padStart(2, '0');
    const mm = String(end.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }, [selectedStart, duration]);

  const canSubmit = selectedDate && selectedStart && duration > 0;

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const newSlot = {
      id: `${selectedDate}-${selectedStart}`,
      date: selectedDate,
      start: selectedStart,
      end: endTime,
      duration,
      note: note.trim()
    };
    setSlots((prev) => {
      const exists = prev.some((s) => s.id === newSlot.id);
      if (exists) return prev;
      return [...prev, newSlot].sort((a, b) => a.start.localeCompare(b.start));
    });
    setNote('');
  };

  const handleRemove = (id) => setSlots((prev) => prev.filter((s) => s.id !== id));


};

export default SlotReservation; 