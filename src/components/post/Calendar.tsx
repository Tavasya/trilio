import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  setSelectedMonth,
  setSelectedYear,
  setSelectedDate,
  nextWeek,
  previousWeek
} from '../../store/slices/calendarSlice';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { fetchUserPosts, updateScheduledPost, deleteScheduledPost } from '../../features/post/postSlice';
import type { Post } from '../../features/post/postTypes';
import ScheduleModal from '../generate/ScheduleModal';
import { useAuth } from '@clerk/react-router';

const Calendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const { selectedMonth, selectedYear, selectedDate, selectedWeek } = useAppSelector((state) => state.calendar);
  const { posts } = useAppSelector((state) => state.post);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [draggedPost, setDraggedPost] = useState<Post | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ date: Date; hour: number } | null>(null);

  // Fetch posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      const token = await getToken();
      if (token) {
        dispatch(fetchUserPosts(token));
      }
    };
    loadPosts();
  }, [dispatch, getToken]);

  const getPostsOnDate = (date: Date): Post[] => {
    return posts.filter(post => {
      if (post.status === 'scheduled' && post.scheduled_for) {
        const postDate = new Date(post.scheduled_for);
        return postDate.getDate() === date.getDate() &&
          postDate.getMonth() === date.getMonth() &&
          postDate.getFullYear() === date.getFullYear();
      } else if (post.status === 'published' && post.created_at) {
        const postDate = new Date(post.created_at);
        return postDate.getDate() === date.getDate() &&
          postDate.getMonth() === date.getMonth() &&
          postDate.getFullYear() === date.getFullYear();
      }
      return false;
    });
  };

  const hasPostOnDate = (date: Date) => {
    return getPostsOnDate(date).length > 0;
  };

  const getPostsAtTime = (date: Date, hour: number): Post[] => {
    return posts.filter(post => {
      const postDate = post.scheduled_for ? new Date(post.scheduled_for) :
                       post.created_at ? new Date(post.created_at) : null;
      if (!postDate) return false;

      return postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getHours() >= hour &&
        postDate.getHours() < hour + 2; // 2-hour time slots
    });
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowScheduleModal(true);
  };

  const handleDeletePost = async (postId: string) => {
    const token = await getToken();
    if (!token) return;

    if (confirm('Are you sure you want to delete this scheduled post?')) {
      try {
        await dispatch(deleteScheduledPost({ postId, token })).unwrap();
        dispatch(fetchUserPosts(token));
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleReschedule = async (date: Date, _time: string) => {
    if (!editingPost) return;

    const token = await getToken();
    if (!token) return;

    try {
      await dispatch(updateScheduledPost({
        postId: editingPost.id,
        updateData: {
          scheduled_for: date.toISOString(),
        },
        token
      })).unwrap();

      setEditingPost(null);
      setShowScheduleModal(false);
      dispatch(fetchUserPosts(token));
    } catch (error) {
      console.error('Failed to reschedule:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, post: Post) => {
    setDraggedPost(post);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ date, hour });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = async (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    setDragOverSlot(null);

    if (!draggedPost) return;

    const token = await getToken();
    if (!token) return;

    // Create new scheduled date
    const newScheduledDate = new Date(date);
    newScheduledDate.setHours(hour);
    newScheduledDate.setMinutes(0);
    newScheduledDate.setSeconds(0);

    try {
      await dispatch(updateScheduledPost({
        postId: draggedPost.id,
        updateData: {
          scheduled_for: newScheduledDate.toISOString(),
        },
        token
      })).unwrap();

      dispatch(fetchUserPosts(token));
    } catch (error) {
      console.error('Failed to reschedule post:', error);
    }

    setDraggedPost(null);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      dispatch(setSelectedMonth(11));
      dispatch(setSelectedYear(selectedYear - 1));
    } else {
      dispatch(setSelectedMonth(selectedMonth - 1));
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      dispatch(setSelectedMonth(0));
      dispatch(setSelectedYear(selectedYear + 1));
    } else {
      dispatch(setSelectedMonth(selectedMonth + 1));
    }
  };

  const handlePreviousWeek = () => {
    dispatch(previousWeek());
  };

  const handleNextWeek = () => {
    dispatch(nextWeek());
  };

  const renderMiniCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-8"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedYear, selectedMonth, day);
      const isToday = 
        day === new Date().getDate() &&
        selectedMonth === new Date().getMonth() &&
        selectedYear === new Date().getFullYear();
      

      const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
      const isSelected = selectedDateObj && 
        day === selectedDateObj.getDate() &&
        selectedMonth === selectedDateObj.getMonth() &&
        selectedYear === selectedDateObj.getFullYear();

      const hasPost = hasPostOnDate(currentDate);

      days.push(
        <div
          key={day}
          onClick={() => dispatch(setSelectedDate(currentDate))}
          className={`h-8 flex items-center justify-center text-sm cursor-pointer rounded-lg transition-all relative
            ${isToday && !isSelected
              ? 'bg-primary/10 text-primary font-medium' 
              : ''
            }
            ${isSelected 
              ? 'bg-primary text-white font-medium shadow-sm' 
              : 'hover:bg-gray-100 text-gray-700'
            }`}
        >
          {day}
          {hasPost && (
            <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
              isSelected ? 'bg-white' : 'bg-[#0077b5]'
            }`} />
          )}
        </div>
      );
    }

    return days;
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedWeek);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const weekDates = getWeekDates();
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const formatWeekRange = () => {
    const startMonth = monthNames[weekStart.getMonth()];
    const endMonth = monthNames[weekEnd.getMonth()];
    const startYear = weekStart.getFullYear();
    const endYear = weekEnd.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonth} ${weekStart.getDate()}-${weekEnd.getDate()}, ${startYear}`;
    } else if (startYear === endYear) {
      return `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${startYear}`;
    } else {
      return `${startMonth} ${weekStart.getDate()}, ${startYear} - ${endMonth} ${weekEnd.getDate()}, ${endYear}`;
    }
  };

  const timeSlots: string[] = [];
  for (let hour = 0; hour < 24; hour += 2) {
    timeSlots.push(
      `${hour === 0 ? '12' : hour > 12 ? hour - 12 : hour}:00 ${hour < 12 ? 'AM' : 'PM'}`
    );
  }

  return (
    <div className="flex h-full bg-white">
      <div className="w-72 bg-gray-50/50 border-r border-gray-100 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900">
              {monthNames[selectedMonth]} {selectedYear}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {shortDaysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-medium text-gray-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {renderMiniCalendar()}
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-medium text-gray-900">
            {formatWeekRange()}
          </h2>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviousWeek}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => dispatch(setSelectedDate(new Date()))}
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Next week"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white">
          <div className="flex">
            <div className="w-24 flex-shrink-0">
              <div className="h-16"></div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-32 text-xs text-gray-400 pr-4 pt-2 text-right border-r border-gray-100"
                >
                  {time}
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7">
              {weekDates.map((date, index) => {
                const isToday = 
                  date.toDateString() === new Date().toDateString();
                const hasPost = hasPostOnDate(date);
                
                return (
                  <div key={index} className="border-r border-gray-100 last:border-r-0">
                    <div className={`h-16 border-b border-gray-100 flex flex-col items-center justify-center relative ${
                      isToday ? 'bg-primary/5' : 'bg-gray-50/50'
                    }`}>
                      <div className="text-xs text-gray-500 mb-1">
                        {daysOfWeek[date.getDay()]}
                      </div>
                      <div className={`text-sm font-medium ${
                        isToday ? 'text-primary' : 'text-gray-700'
                      }`}>
                        {date.getDate()}
                      </div>
                      {hasPost && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0077b5">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {timeSlots.map((_timeSlot, timeIndex) => {
                      const hour = timeIndex * 2; // Each slot represents 2 hours
                      const postsAtTime = getPostsAtTime(date, hour);

                      return (
                        <div
                          key={timeIndex}
                          className={`h-32 border-b border-gray-50 ${
                            isToday ? 'bg-primary/[0.02]' : 'hover:bg-gray-50/50'
                          } ${
                            dragOverSlot?.date.toDateString() === date.toDateString() &&
                            dragOverSlot?.hour === hour
                              ? 'bg-primary/10 border-2 border-primary/30'
                              : ''
                          } transition-colors relative`}
                          onDragOver={(e) => handleDragOver(e, date, hour)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, date, hour)}
                        >
                          {postsAtTime.map((post, postIndex) => {
                            const postDate = post.scheduled_for ? new Date(post.scheduled_for) :
                                           post.created_at ? new Date(post.created_at) : new Date();
                            const postTime = postDate.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            });

                            return (
                              <div
                                key={post.id}
                                className="absolute inset-x-2 bg-[#0077b5]/10 border border-[#0077b5]/20 rounded-lg p-2 cursor-move hover:bg-[#0077b5]/15 transition-colors"
                                style={{ top: `${12 + postIndex * 40}px` }}
                                draggable={post.status === 'scheduled'}
                                onDragStart={(e) => handleDragStart(e, post)}
                                onClick={() => setSelectedPost(post)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 mb-1">
                                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#0077b5">
                                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                      </svg>
                                      <span className="text-[10px] text-[#0077b5] font-medium">{postTime}</span>
                                      {post.status === 'scheduled' && (
                                        <Clock className="w-3 h-3 text-[#0077b5]" />
                                      )}
                                    </div>
                                    <p className="text-[10px] text-gray-700 line-clamp-2">
                                      {post.content.substring(0, 50)}...
                                    </p>
                                  </div>
                                  <div className="flex gap-1 ml-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditPost(post);
                                      }}
                                      className="p-1 hover:bg-[#0077b5]/20 rounded transition-colors"
                                    >
                                      <Edit2 className="w-3 h-3 text-[#0077b5]" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePost(post.id);
                                      }}
                                      className="p-1 hover:bg-red-100 rounded transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-500" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedPost(null)}
          />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Post Details</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-500 rotate-90" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {selectedPost.scheduled_for ?
                      new Date(selectedPost.scheduled_for).toLocaleDateString() :
                      new Date(selectedPost.created_at).toLocaleDateString()
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {selectedPost.scheduled_for ?
                      new Date(selectedPost.scheduled_for).toLocaleTimeString() :
                      new Date(selectedPost.created_at).toLocaleTimeString()
                    }
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedPost.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                  selectedPost.status === 'published' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedPost.status}
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {selectedPost.media_url && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedPost.media_url}
                    alt="Post media"
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {selectedPost.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedPost(null);
                        handleEditPost(selectedPost);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Reschedule
                    </button>
                    <button
                      onClick={() => {
                        handleDeletePost(selectedPost.id);
                        setSelectedPost(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal for Editing */}
      {showScheduleModal && editingPost && (
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setEditingPost(null);
          }}
          onSchedule={handleReschedule}
        />
      )}
    </div>
  );
};

export default Calendar;