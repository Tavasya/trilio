import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: Date, time: string) => void;
  onPostNow?: () => void;
}

export default function ScheduleModal({ isOpen, onClose, onSchedule }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<Array<{value: string, display: string}>>([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const timeInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Generate time slots every 30 minutes
  const timeSlots: { value: string; display: string }[] = [];
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

  // Format time input for display - allow free-form input
  const formatTimeInput = (value: string) => {
    // Just return the value as-is to allow free typing
    return value;
  };

  // Convert various time formats to 24-hour format
  const parseTimeInput = (input: string): string => {
    if (!input) return '';

    const cleanInput = input.trim().toLowerCase();

    // Try various regex patterns for different time formats
    const patterns = [
      // 12-hour format with colon (e.g., "2:30 pm", "2:30pm", "02:30 PM")
      /^(\d{1,2}):(\d{1,2})\s*(am|pm|a\.m\.|p\.m\.)?$/i,
      // 12-hour format without colon (e.g., "230pm", "1130am")
      /^(\d{1,2})(\d{2})\s*(am|pm|a\.m\.|p\.m\.)$/i,
      // 24-hour format with colon (e.g., "14:30", "09:45")
      /^(\d{1,2}):(\d{1,2})$/,
      // Single or double digit hour with period (e.g., "2pm", "2 pm", "11am")
      /^(\d{1,2})\s*(am|pm|a\.m\.|p\.m\.)$/i,
      // 24-hour format without colon (e.g., "1430", "0945")
      /^(\d{2})(\d{2})$/,
      // Hour only (e.g., "14", "9")
      /^(\d{1,2})$/
    ];

    for (const pattern of patterns) {
      const match = cleanInput.match(pattern);
      if (match) {
        let hours = parseInt(match[1]);
        let minutes = match[2] ? parseInt(match[2]) : 0;
        const period = match[3]?.toLowerCase().replace(/\./g, '');

        // Handle 12-hour format
        if (period) {
          if (period.startsWith('p') && hours < 12) hours += 12;
          if (period.startsWith('a') && hours === 12) hours = 0;
        }

        // Validate hours and minutes
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
      }
    }

    // If no pattern matched but input contains numbers, try to parse it
    const numbers = cleanInput.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const firstNum = parseInt(numbers[0]);
      const secondNum = numbers.length > 1 ? parseInt(numbers[1]) : 0;

      if (firstNum >= 0 && firstNum <= 23 && secondNum >= 0 && secondNum <= 59) {
        return `${firstNum.toString().padStart(2, '0')}:${secondNum.toString().padStart(2, '0')}`;
      }
    }

    return '';
  };
  
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

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (timeInputRef.current) {
      const rect = timeInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Handle time input changes
  const handleTimeInputChange = (value: string) => {
    const formatted = formatTimeInput(value);
    setSelectedTime(formatted);

    // Filter time slots based on input
    if (value.length > 0) {
      const filtered = timeSlots.filter(slot =>
        slot.display.toLowerCase().includes(value.toLowerCase()) ||
        slot.value.includes(value)
      );
      setFilteredTimeSlots(filtered.slice(0, 12)); // Show more suggestions now that we have space
    } else {
      setFilteredTimeSlots(timeSlots.slice(0, 12));
    }
  };

  // Handle time input focus
  const handleTimeInputFocus = () => {
    updateDropdownPosition();
    setShowTimeDropdown(true);
  };

  // Handle time input blur
  const handleTimeInputBlur = () => {
    // Parse and validate time input
    const parsed = parseTimeInput(selectedTime);
    if (parsed) {
      setSelectedTime(parsed);
    }
    // Delay hiding dropdown to allow click on dropdown items
    setTimeout(() => setShowTimeDropdown(false), 200);
  };

  // Handle time selection from dropdown
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowTimeDropdown(false);
    timeInputRef.current?.focus();
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!showTimeDropdown) {
      updateDropdownPosition();
    }
    setShowTimeDropdown(!showTimeDropdown);
  };

  // Clear validation error when date or time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      validateDateTime();
    }
  }, [selectedDate, selectedTime]);

  // Initialize filtered time slots
  useEffect(() => {
    setFilteredTimeSlots(timeSlots.slice(0, 12));
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate('');
      setSelectedTime('');
      setValidationError('');
      setShowTimeDropdown(false);
    }
  }, [isOpen]);

  // Handle click outside of dropdown and position updates
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          timeInputRef.current && !timeInputRef.current.contains(event.target as Node)) {
        setShowTimeDropdown(false);
      }
    };

    const handleScroll = () => {
      if (showTimeDropdown) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (showTimeDropdown) {
        updateDropdownPosition();
      }
    };

    if (showTimeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [showTimeDropdown]);
  
  
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
          <h2 className="text-lg sm:text-xl font-semibold">Publish Post</h2>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Select Time
          </label>
          <div className="relative">
            <div className="relative">
              <input
                ref={timeInputRef}
                type="text"
                value={selectedTime ? (
                  // Show formatted time if a valid time is selected
                  selectedTime.match(/^\d{2}:\d{2}$/) ?
                    new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    }) : selectedTime
                ) : ''}
                onChange={(e) => handleTimeInputChange(e.target.value)}
                onFocus={handleTimeInputFocus}
                onBlur={handleTimeInputBlur}
                placeholder="e.g. 2:47pm"
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={toggleDropdown}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              >
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
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
            Schedule
          </Button>
        </div>
      </div>

      {/* Time Dropdown Portal */}
      {showTimeDropdown && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 9999
          }}
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {filteredTimeSlots.map((slot) => {
            // Filter out past times if today is selected
            if (selectedDate === today) {
              const now = new Date();
              const slotDateTime = new Date(`${selectedDate}T${slot.value}`);
              if (slotDateTime <= now) return null;
            }
            return (
              <button
                key={slot.value}
                type="button"
                onClick={() => handleTimeSelect(slot.value)}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 text-sm"
              >
                {slot.display}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}