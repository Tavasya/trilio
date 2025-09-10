import { useState } from 'react';
import { X, Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: Date, time: string) => void;
}

export default function ScheduleModal({ isOpen, onClose, onSchedule }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  // Generate time slots every 30 minutes
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const display = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      timeSlots.push({ value: time, display });
    }
  }
  
  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
      onSchedule(scheduledDateTime, selectedTime);
      onClose();
    }
  };
  
  const generateBestTime = () => {
    if (!selectedDate) return;
    
    // Best posting times for LinkedIn (based on common engagement patterns)
    // Tuesday-Thursday: 10-11 AM or 7-8 PM
    // Monday, Friday: 9-10 AM
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    
    let bestTime = '';
    
    if (dayOfWeek === 2 || dayOfWeek === 3 || dayOfWeek === 4) {
      // Tuesday, Wednesday, Thursday
      const isMorening = Math.random() > 0.5;
      bestTime = isMorening ? '10:30' : '19:30';
    } else if (dayOfWeek === 1 || dayOfWeek === 5) {
      // Monday, Friday
      bestTime = '09:30';
    } else {
      // Weekend
      bestTime = '11:00';
    }
    
    setSelectedTime(bestTime);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Schedule Post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Date Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Select Date
          </label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        {/* Time Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              <Clock className="w-4 h-4 inline mr-2" />
              Select Time
            </label>
            <Button
              type="button"
              onClick={generateBestTime}
              disabled={!selectedDate}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Generate Best Time
            </Button>
          </div>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Choose a time</option>
            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.display}
              </option>
            ))}
          </select>
        </div>
        
        {/* Selected DateTime Display */}
        {selectedDate && selectedTime && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Scheduled for:</p>
            <p className="font-medium">
              {new Date(`${selectedDate}T${selectedTime}`).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
            className="flex-1"
          >
            Schedule Post
          </Button>
        </div>
      </div>
    </div>
  );
}