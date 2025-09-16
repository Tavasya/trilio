import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: Date, time: string) => void;
}

export default function ScheduleModal({ isOpen, onClose, onSchedule }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [useManualInput, setUseManualInput] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Get current time for validation
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };
  
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
  
  const validateDateTime = () => {
    if (!selectedDate || !selectedTime) {
      setValidationError('Please select both date and time');
      return false;
    }

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();

    if (scheduledDateTime <= now) {
      setValidationError('Please select a future date and time');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleSchedule = () => {
    if (validateDateTime()) {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
      onSchedule(scheduledDateTime, selectedTime);
      onClose();
    }
  };

  // Clear validation error when date or time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      validateDateTime();
    }
  }, [selectedDate, selectedTime]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate('');
      setSelectedTime('');
      setValidationError('');
      setUseManualInput(false);
    }
  }, [isOpen]);
  
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Schedule Post</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-1 hover:bg-gray-100 rounded-lg transition-colors"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">
              <Clock className="w-4 h-4 inline mr-2" />
              Select Time
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setUseManualInput(!useManualInput)}
                variant="outline"
                size="sm"
                className="text-xs px-2 sm:px-3"
              >
                {useManualInput ? 'Use Dropdown' : 'Type Time'}
              </Button>
              <Button
                type="button"
                onClick={generateBestTime}
                disabled={!selectedDate}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 px-2 sm:px-3"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Best Time</span>
                <span className="sm:hidden">Best</span>
              </Button>
            </div>
          </div>
          {useManualInput ? (
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              min={selectedDate === today ? getCurrentTime() : undefined}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ) : (
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Choose a time</option>
              {timeSlots.map((slot) => {
                // Filter out past times if today is selected
                if (selectedDate === today) {
                  const now = new Date();
                  const slotDateTime = new Date(`${selectedDate}T${slot.value}`);
                  if (slotDateTime <= now) return null;
                }
                return (
                  <option key={slot.value} value={slot.value}>
                    {slot.display}
                  </option>
                );
              })}
            </select>
          )}
        </div>
        
        {/* Validation Error */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600">{validationError}</p>
          </div>
        )}

        {/* Selected DateTime Display */}
        {selectedDate && selectedTime && !validationError && (
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
            disabled={!selectedDate || !selectedTime || !!validationError}
            className="flex-1"
          >
            Schedule Post
          </Button>
        </div>
      </div>
    </div>
  );
}