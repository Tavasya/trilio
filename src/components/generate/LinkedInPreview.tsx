import { useState } from 'react';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, Monitor, Smartphone, ThumbsUp, Lightbulb, Calendar, Image, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import ScheduleModal from './ScheduleModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateGeneratedPostContent, saveDraftToDatabase } from '@/features/chat/chatSlice';

import { schedulePost } from '@/features/post/postSlice';
import { useAuth } from '@clerk/react-router';
import { useNavigate } from 'react-router';


type ViewSize = 'desktop' | 'mobile';

export default function LinkedInPreview() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const generatedPost = useAppSelector(state => state.chat.generatedPost);
  const saveStatus = useAppSelector(state => state.chat.saveStatus);

  // Use Clerk user data with fallbacks
  const userName = user?.fullName || user?.firstName || "Your Name";
  const userTitle = "Product Manager | Tech Enthusiast"; // You might want to make this editable or pull from user metadata
  const userAvatar = user?.imageUrl || "";

  const [viewSize, setViewSize] = useState<ViewSize>('desktop');
  const [showFullContent, setShowFullContent] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);

  const postContent = generatedPost?.content || "Your LinkedIn post content will appear here as you generate it...";
  const postId = generatedPost?.id;

  const handleSchedule = async (date: Date, time: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication required', { position: 'top-right' });
        return;
      }

      // Get user's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Format the scheduled date/time in ISO format
      const scheduledFor = date.toISOString();

      // Dispatch the schedule action
      await dispatch(schedulePost({
        scheduleData: {
          content: postContent,
          scheduled_for: scheduledFor,
          timezone: timezone,
          visibility: 'PUBLIC'
        },
        token
      })).unwrap();

      // Close modal and navigate to posts page
      setShowScheduleModal(false);
      toast.success('Post scheduled successfully!', { position: 'top-right' });
      navigate('/posts');
    } catch (error) {
      console.error('Failed to schedule post:', error);
      toast.error('Failed to schedule post', { position: 'top-right' });
    }
  };
  
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setPostImage(imageUrl);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  
  const getPreviewWidth = () => {
    return viewSize === 'mobile' ? 'max-w-sm' : 'w-full max-w-2xl';
  };
  
  const getTruncatedContent = () => {
    const lines = postContent.split('\n');
    const maxLines = viewSize === 'mobile' ? 2 : 4;
    
    if (!showFullContent && lines.length > maxLines) {
      return {
        text: lines.slice(0, maxLines).join('\n'),
        truncated: true
      };
    }
    return {
      text: postContent,
      truncated: false
    };
  };
  
  const handleContentChange = (newContent: string) => {
    dispatch(updateGeneratedPostContent(newContent));
  };
  
  const handleContentBlur = async () => {
    setIsEditingContent(false);
    
    // Only save if we have a post ID and the content has been edited
    if (postId && generatedPost?.isEdited && saveStatus === 'unsaved') {
      try {
        const token = await getToken();
        if (!token) {
          toast.error('Authentication required', { position: 'top-right' });
          return;
        }
        
        await dispatch(saveDraftToDatabase({
          postId,
          content: postContent,
          token
        })).unwrap();
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }
  };
  
  const { text: displayContent, truncated } = getTruncatedContent();
  
  // Fixed engagement numbers
  const reactions = 127;
  const comments = 23;
  const reposts = 8;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Preview Header */}
      <div className="border-b">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">LinkedIn Preview</h2>
              <p className="text-sm text-gray-500">See how your post will look</p>
            </div>
            {/* Save Status Indicator */}
            {postId && (
              <div className="flex items-center gap-2 text-sm">
                {saveStatus === 'saving' && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-gray-500">Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Saved</span>
                  </>
                )}
                {saveStatus === 'unsaved' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-600">Unsaved changes</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Save failed</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Size Toggle Buttons */}
        <div className="border-t p-3 flex justify-center gap-1 bg-gray-50">
          <button
            onClick={() => setViewSize('desktop')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              viewSize === 'desktop' 
                ? 'bg-white shadow-sm border border-gray-300 text-primary' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-xs font-medium">Desktop</span>
          </button>
          <button
            onClick={() => setViewSize('mobile')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              viewSize === 'mobile' 
                ? 'bg-white shadow-sm border border-gray-300 text-primary' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-xs font-medium">Mobile</span>
          </button>
        </div>
      </div>

      {/* LinkedIn Post Preview */}
      <div className="flex-1 overflow-y-auto bg-gray-100 relative">
        <div className="p-4 flex justify-center items-center relative">
          {/* Post Card with responsive width */}
          <div className={`bg-white border border-gray-200 rounded-lg ${getPreviewWidth()} transition-all duration-300`}>
            {/* Post Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-gray-600 font-semibold text-lg">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                      {userName}
                    </h3>
                    <p className="text-sm text-gray-600">{userTitle}</p>
                    <p className="text-xs text-gray-500">Just now • 🌐</p>
                  </div>
                </div>
                {/* More Options */}
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              {isEditingContent ? (
                <textarea
                  value={postContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onBlur={handleContentBlur}
                  className="w-full min-h-[100px] p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  autoFocus
                />
              ) : (
                <p 
                  className="text-gray-900 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={() => setIsEditingContent(true)}
                  title="Click to edit"
                >
                  {displayContent}
                  {truncated && (
                    <>
                      {'... '}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullContent(true);
                        }}
                        className="text-gray-600 hover:underline font-medium"
                      >
                        see more
                      </button>
                    </>
                  )}
                </p>
              )}
              
              {/* Image Upload Area */}
              {postImage ? (
                <div className="mt-3 relative group">
                  <img 
                    src={postImage} 
                    alt="Post attachment" 
                    className="w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={() => setPostImage(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleImageUpload}
                  className="mt-3 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center gap-2 text-gray-500 hover:text-gray-600"
                >
                  <Image className="w-5 h-5" />
                  <span className="text-sm font-medium">Add Image</span>
                </button>
              )}
            </div>

            {/* Engagement Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <ThumbsUp className="w-3 h-3 text-white fill-white" />
                  </div>
                  <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-3 h-3 text-white fill-white" />
                  </div>
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
                <span className="ml-1">{reactions}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>{comments} comments</span>
                <span>•</span>
                <span>{reposts} reposts</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1 flex items-center justify-around border-t border-gray-200">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
              >
                <ThumbsUp className="w-5 h-5" />
                <span className="text-sm font-medium">Like</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Comment</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Repost</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <Send className="w-5 h-5" />
                <span className="text-sm font-medium">Send</span>
              </button>
            </div>
          </div>

        </div>
        
        {/* Schedule Post Button */}
        <div className="absolute bottom-4 right-4">
          <Button 
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 shadow-lg"
          >
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Schedule Post</span>
          </Button>
        </div>
      </div>
      
      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleSchedule}
      />
    </div>
  );
}