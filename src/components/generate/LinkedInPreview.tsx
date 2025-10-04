import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Share2, Send, MoreHorizontal, Monitor, Smartphone, ThumbsUp, Calendar, X, MessageSquare, Bold, Italic, List, ImagePlus, Edit3, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import ScheduleModal from './ScheduleModal';
import ConnectLinkedInButton from '@/components/linkedin/ConnectLinkedInButton';
import ThumbIcon from '@/lib/icons/thumb.svg?react';
import HeartIcon from '@/lib/icons/heart.svg?react';
import ClapIcon from '@/lib/icons/clap.svg?react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateGeneratedPostContent, saveDraftToDatabase } from '@/features/chat/chatSlice';
import { schedulePost, publishToLinkedIn } from '@/features/post/postSlice';
import { useAuth, useUser } from '@clerk/react-router';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { postService } from '@/features/post/postService';

type ViewSize = 'desktop' | 'mobile';

interface LinkedInPreviewProps {
  onToggleView?: () => void;
  showToggle?: boolean;
}

export default function LinkedInPreview({ onToggleView, showToggle }: LinkedInPreviewProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const generatedPost = useAppSelector(state => state.chat.generatedPost);
  const isLoadingPost = useAppSelector(state => state.chat.isLoadingPost);

  // Use Clerk user data with fallbacks
  const userName = user?.fullName || user?.firstName || "Your Name";
  const userAvatar = user?.imageUrl || "";

  // Check if LinkedIn is connected via Clerk external accounts
  const hasLinkedIn = user?.externalAccounts?.some(
    account => account.provider === 'linkedin_oidc'
  ) || false;

  const [viewSize, setViewSize] = useState<ViewSize>('desktop');
  const [showFullContent, setShowFullContent] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imagesChanged, setImagesChanged] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [showEditPopover, setShowEditPopover] = useState(false);
  const [editInstruction, setEditInstruction] = useState('');
  const [isEditingSelection, setIsEditingSelection] = useState(false);
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [showEditButton, setShowEditButton] = useState(false);
  const [editButtonPosition, setEditButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editPopoverRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  const postContent = generatedPost?.content || "Your LinkedIn post content will appear here as you generate it...";
  const postId = generatedPost?.id;

  // Initialize image preview URLs from Redux when component mounts or generatedPost changes
  useEffect(() => {
    if (generatedPost?.imageUrls && generatedPost.imageUrls.length > 0) {
      setImagePreviewUrls(generatedPost.imageUrls);
      // Clear file objects since these are already-uploaded URLs
      setImageFiles([]);
      setImagesChanged(false);
    }
  }, [generatedPost?.imageUrls]);

  // Add keyboard listener for End key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'End' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (previewContainerRef.current) {
          previewContainerRef.current.scrollTo({
            top: previewContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSchedule = async (date: Date) => {
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

      // Use imagePreviewUrls (now contains real Supabase URLs after immediate upload)
      await dispatch(schedulePost({
        scheduleData: {
          content: postContent,
          scheduled_for: scheduledFor,
          timezone: timezone,
          visibility: 'PUBLIC',
          image_urls: imagePreviewUrls.length > 0 ? imagePreviewUrls : undefined,
          draft_id: postId  // Include the draft post ID if it exists
        },
        token
      })).unwrap();

      // Close modal and navigate to posts page
      setShowScheduleModal(false);
      toast.success('Post scheduled successfully!', { position: 'top-right' });
      navigate('/posts');
    } catch {
      toast.error('Failed to schedule post', { position: 'top-right' });
    }
  };

  const handlePostNow = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication required', { position: 'top-right' });
        return;
      }

      // Publish to LinkedIn immediately
      await dispatch(publishToLinkedIn({
        post: {
          content: postContent,
          visibility: 'PUBLIC',
          image_urls: imagePreviewUrls.length > 0 ? imagePreviewUrls : undefined,
          draft_id: postId  // Include the draft post ID if it exists
        },
        token
      })).unwrap();

      toast.success('Posted to LinkedIn successfully!', { position: 'top-right' });
      navigate('/posts');
    } catch {
      toast.error('Failed to post to LinkedIn', { position: 'top-right' });
    }
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true; // Allow multiple selection

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;

      // LinkedIn supports up to 9 images
      const maxImages = 9;
      const currentImageCount = imagePreviewUrls.length;
      const availableSlots = maxImages - currentImageCount;

      if (files.length > availableSlots) {
        toast.error(`You can only upload ${availableSlots} more image(s). LinkedIn allows up to ${maxImages} images per post.`, { position: 'top-right' });
        return;
      }

      // Store only NEW files
      const newFiles = Array.from(files);

      // Get auth token
      const token = await getToken();
      if (!token) {
        toast.error('Authentication required', { position: 'top-right' });
        return;
      }

      // Show uploading toast
      toast.info(`Uploading ${newFiles.length} image(s)...`, { position: 'top-right' });

      try {
        // Upload images immediately by saving draft
        if (postId) {
          const response = await dispatch(saveDraftToDatabase({
            postId,
            content: postContent,
            imageFiles: newFiles, // Only send NEW files - backend will append to existing
            token
          })).unwrap();

          // Update state with ALL uploaded URLs from backend response (existing + new)
          if (response.post?.image_urls) {
            setImagePreviewUrls(response.post.image_urls);
            setImageFiles([]);
            setImagesChanged(false);
            toast.success(`${newFiles.length} image(s) uploaded successfully!`, { position: 'top-right' });
          }
        } else {
          // No post ID yet - just show preview for now
          const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
          setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
          setImageFiles(newFiles);
          setImagesChanged(true);
          toast.warning('Images will upload when draft is created.', { position: 'top-right' });
        }
      } catch (error) {
        toast.error('Failed to upload images. Please try again.', { position: 'top-right' });
      }
    };

    input.click();
  };
  
  const getPreviewWidth = () => {
    return viewSize === 'mobile' ? 'w-[375px]' : 'w-[700px]';
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

  const renderFormattedText = (text: string) => {
    // LinkedIn uses Unicode bold/italic characters, so just return the text as-is
    return text;
  };
  
  const handleContentChange = (newContent: string) => {
    dispatch(updateGeneratedPostContent(newContent));
  };
  
  const handleContentBlur = async () => {
    setIsEditingContent(false);

    // Expand content when exiting edit mode
    setShowFullContent(true);

    // Save if we have a post ID and (content edited OR images changed)
    if (postId && (generatedPost?.isEdited || imagesChanged)) {
      try {
        const token = await getToken();
        if (!token) {
          toast.error('Authentication required', { position: 'top-right' });
          return;
        }

        await dispatch(saveDraftToDatabase({
          postId,
          content: postContent,
          imageFiles: imagesChanged ? imageFiles : undefined,
          token
        })).unwrap();

        // Reset imagesChanged flag after successful save
        if (imagesChanged) {
          setImagesChanged(false);
        }
      } catch {
        // Auto-save errors are silent
      }
    }
  };

  // Auto-resize textarea when entering edit mode
  useEffect(() => {
    if (isEditingContent && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [isEditingContent]);

  const applyBoldFormatting = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postContent.substring(start, end);

    if (!selectedText) {
      toast.error('Please select text to format', { position: 'top-right' });
      return;
    }

    // Convert to Unicode Mathematical Bold (using fromCodePoint for supplementary plane)
    const boldText = selectedText.split('').map(char => {
      const code = char.charCodeAt(0);
      // A-Z: 0x1D400 - 0x1D419
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x1D400 + (code - 65));
      }
      // a-z: 0x1D41A - 0x1D433
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x1D41A + (code - 97));
      }
      // 0-9: 0x1D7CE - 0x1D7D7
      if (code >= 48 && code <= 57) {
        return String.fromCodePoint(0x1D7CE + (code - 48));
      }
      return char;
    }).join('');

    const beforeText = postContent.substring(0, start);
    const afterText = postContent.substring(end);
    const newContent = beforeText + boldText + afterText;

    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + boldText.length);
    }, 0);
  };

  const applyItalicFormatting = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postContent.substring(start, end);

    if (!selectedText) {
      toast.error('Please select text to format', { position: 'top-right' });
      return;
    }

    // Convert to Unicode Mathematical Italic (using fromCodePoint for supplementary plane)
    const italicText = selectedText.split('').map(char => {
      const code = char.charCodeAt(0);
      // A-Z: 0x1D434 - 0x1D44D
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x1D434 + (code - 65));
      }
      // a-z: 0x1D44E - 0x1D467
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x1D44E + (code - 97));
      }
      return char;
    }).join('');

    const beforeText = postContent.substring(0, start);
    const afterText = postContent.substring(end);
    const newContent = beforeText + italicText + afterText;

    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + italicText.length);
    }, 0);
  };

  const insertBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postContent.substring(start, end);

    const beforeText = postContent.substring(0, start);
    const afterText = postContent.substring(end);

    if (selectedText) {
      // Convert selected lines to bullet points
      const lines = selectedText.split('\n');
      const bulletLines = lines.map(line => line.trim() ? `• ${line.trim()}` : line).join('\n');
      const newContent = `${beforeText}${bulletLines}${afterText}`;
      handleContentChange(newContent);
    } else {
      // Insert a new bullet point
      const newContent = `${beforeText}• ${afterText}`;
      handleContentChange(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  const handleTextSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postContent.substring(start, end);

    if (selectedText && selectedText.trim()) {
      // Get textarea's computed styles
      const textareaRect = textarea.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(textarea);

      // Create a mirror div to measure text position accurately
      const mirror = document.createElement('div');
      const textareaStyle = computedStyle;

      // Copy all relevant styles from textarea to mirror
      mirror.style.position = 'absolute';
      mirror.style.visibility = 'hidden';
      mirror.style.whiteSpace = 'pre-wrap';
      mirror.style.wordWrap = 'break-word';
      mirror.style.font = textareaStyle.font;
      mirror.style.fontSize = textareaStyle.fontSize;
      mirror.style.fontFamily = textareaStyle.fontFamily;
      mirror.style.fontWeight = textareaStyle.fontWeight;
      mirror.style.lineHeight = textareaStyle.lineHeight;
      mirror.style.letterSpacing = textareaStyle.letterSpacing;
      mirror.style.padding = textareaStyle.padding;
      mirror.style.border = textareaStyle.border;
      mirror.style.boxSizing = textareaStyle.boxSizing;
      mirror.style.width = textareaStyle.width;
      mirror.style.maxWidth = textareaStyle.maxWidth;
      mirror.style.minWidth = textareaStyle.minWidth;

      document.body.appendChild(mirror);

      // Add text up to selection end to measure full position
      const textUpToSelectionStart = postContent.substring(0, start);

      // Create two spans to measure the start and end positions
      mirror.innerHTML = '';
      const beforeSpan = document.createElement('span');
      beforeSpan.textContent = textUpToSelectionStart;
      mirror.appendChild(beforeSpan);

      const selectedSpan = document.createElement('span');
      selectedSpan.textContent = selectedText;
      mirror.appendChild(selectedSpan);

      // Get dimensions
      const beforeSpanRect = beforeSpan.getBoundingClientRect();
      const selectedSpanRect = selectedSpan.getBoundingClientRect();
      const mirrorRect = mirror.getBoundingClientRect();

      // Calculate position relative to textarea
      const paddingTop = parseInt(textareaStyle.paddingTop, 10) || 0;
      const paddingLeft = parseInt(textareaStyle.paddingLeft, 10) || 0;

      // Position button to the right of the selected text
      const top = textareaRect.top + (beforeSpanRect.bottom - mirrorRect.top) + paddingTop - 45;
      const left = textareaRect.left + (selectedSpanRect.right - mirrorRect.left) + paddingLeft + 10;

      // Clean up
      document.body.removeChild(mirror);

      setEditButtonPosition({ top, left });
      setShowEditButton(true);
      setSelectionRange({ start, end });
    } else {
      setShowEditButton(false);
      setEditButtonPosition(null);
    }
  };

  const handleShowEditPopover = () => {
    setShowEditButton(false);
    setShowEditPopover(true);
    setEditInstruction('');
  };

  const handleEditSelection = async () => {
    if (!selectionRange || !editInstruction.trim()) {
      toast.error('Please enter an edit instruction', { position: 'top-right' });
      return;
    }

    const token = await getToken();
    if (!token) {
      toast.error('Authentication required', { position: 'top-right' });
      return;
    }

    const { start, end } = selectionRange;
    const selectedText = postContent.substring(start, end);

    // Save the original content BEFORE modifying
    const originalContent = postContent;

    // Close popover and start editing
    setShowEditPopover(false);
    setIsEditingSelection(true);

    // Animate deletion letter by letter (reverse of streaming)
    const beforeText = postContent.substring(0, start);
    const afterText = postContent.substring(end);

    await new Promise<void>((resolve) => {
      let currentLength = selectedText.length;
      const deleteInterval = setInterval(() => {
        if (currentLength <= 0) {
          clearInterval(deleteInterval);
          resolve();
          return;
        }
        currentLength--;
        const remainingText = selectedText.substring(0, currentLength);
        handleContentChange(beforeText + remainingText + afterText);
      }, 10); // Delete one character every 10ms
    });

    // Stream the edited content
    let accumulatedNewText = '';

    try {
      await postService.streamEditSelection(
        {
          full_content: originalContent,
          selected_text: selectedText,
          edit_instruction: editInstruction.trim(),
          selection_start: start,
          selection_end: end
        },
        token,
        (chunk) => {
          accumulatedNewText += chunk;
          const newContent = beforeText + accumulatedNewText + afterText;
          handleContentChange(newContent);
        },
        () => {
          setIsEditingSelection(false);
          setSelectionRange(null);
          setEditInstruction('');

          // Focus and select the new text
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.focus();
              textareaRef.current.setSelectionRange(start, start + accumulatedNewText.length);
            }
          }, 0);
        },
        (error) => {
          setIsEditingSelection(false);
          toast.error(error.message || 'Failed to edit selection', { position: 'top-right' });
        }
      );
    } catch {
      setIsEditingSelection(false);
      toast.error('Failed to edit selection', { position: 'top-right' });
    }
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editPopoverRef.current && !editPopoverRef.current.contains(event.target as Node)) {
        setShowEditPopover(false);
      }
    };

    if (showEditPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEditPopover]);

  // Hide edit button when clicking outside or when selection is cleared
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        editButtonRef.current &&
        !editButtonRef.current.contains(target) &&
        textareaRef.current &&
        !textareaRef.current.contains(target)
      ) {
        setShowEditButton(false);
      }
    };

    if (showEditButton) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEditButton]);
  
  const { text: displayContent, truncated } = getTruncatedContent();

  // Fixed engagement numbers
  const reactions = 127;
  const comments = 23;
  const reposts = 8;

  // Skeleton loading state
  if (isLoadingPost) {
    return (
      <div className="h-full flex flex-col overflow-hidden bg-gray-100 rounded-lg border border-gray-300">
        {/* Preview Header */}
        <div className="p-4">
          <div className="bg-transparent rounded-lg p-2 min-h-[48px] flex items-center">
            <div className="flex items-center justify-between w-full relative">
              {showToggle && (
                <Button
                  onClick={onToggleView}
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              )}

              {/* Desktop/Mobile Toggle - Centered */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
                <button className="p-2 text-primary">
                  <Monitor className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400">
                  <Smartphone className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton LinkedIn Post */}
        <div className="flex-1 overflow-y-auto bg-gray-100 relative">
          <div className="p-4 flex justify-center items-start">
            <div className="bg-white border border-gray-200 rounded-lg w-[700px]">
              {/* Post Header Skeleton */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
              </div>

              {/* Post Content Skeleton */}
              <div className="px-4 pb-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Engagement Stats Skeleton */}
              <div className="px-4 py-2 flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="px-2 py-1 flex items-center justify-around border-t border-gray-200">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons Skeleton */}
        <div className="absolute bottom-4 right-4 z-10 p-2">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-100 rounded-lg border border-gray-300">
      {/* Preview Header */}
      <div className="p-4">
        <div className="bg-transparent rounded-lg p-2 min-h-[48px] flex items-center">
          <div className="flex items-center justify-between w-full relative">
            {showToggle && (
              <Button
                onClick={onToggleView}
                variant="outline"
                size="sm"
                className="lg:hidden"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
            )}

            {/* Desktop/Mobile Toggle - Centered */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
              <button
                onClick={() => setViewSize('desktop')}
                className={`p-2 transition-colors ${
                  viewSize === 'desktop'
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Desktop view"
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewSize('mobile')}
                className={`p-2 transition-colors ${
                  viewSize === 'mobile'
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Mobile view"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>

            {/* Save Status Indicator */}
            {/* {postId && (
              <div className="flex items-center gap-2 text-sm ml-auto">
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
            )} */}
          </div>
        </div>
      </div>

      {/* LinkedIn Post Preview */}
      <div ref={previewContainerRef} className="flex-1 overflow-y-auto bg-gray-100 relative custom-scrollbar">
        <div className="p-4 flex justify-center items-start gap-2 relative min-h-full">
          {/* Post Card with responsive width */}
          <div className={`bg-white border border-gray-200 rounded-lg ${getPreviewWidth()}`}>
            {/* Post Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-gray-600 font-semibold text-lg">
                        {userName.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  {/* User Info */}
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                      {userName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Just now • 🌐</p>
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
                  ref={textareaRef}
                  value={postContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onBlur={handleContentBlur}
                  onSelect={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  className="w-full p-2 border-2 border-dashed border-gray-300 rounded resize-none focus:outline-none focus:border-gray-400 text-gray-900 whitespace-pre-wrap bg-transparent"
                  autoFocus
                  style={{
                    minHeight: 'auto',
                    height: 'auto',
                    overflow: 'hidden',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.42857'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              ) : (
                <div
                  className="text-gray-900 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingContent(true);
                  }}
                  title="Click to edit"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.42857'
                  }}
                >
                  {renderFormattedText(displayContent)}
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
                  {!truncated && showFullContent && postContent.split('\n').length > (viewSize === 'mobile' ? 2 : 4) && (
                    <>
                      {' '}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullContent(false);
                        }}
                        className="text-gray-600 hover:underline font-medium"
                      >
                        see less
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Image Display Area */}
              {imagePreviewUrls.length > 0 && (
                <div className={`mt-3 ${
                  imagePreviewUrls.length === 1
                    ? 'grid grid-cols-1'
                    : imagePreviewUrls.length === 2
                    ? 'grid grid-cols-2 gap-1'
                    : imagePreviewUrls.length === 3
                    ? 'grid grid-cols-3 gap-1'
                    : imagePreviewUrls.length === 4
                    ? 'grid grid-cols-2 gap-1'
                    : 'grid grid-cols-3 gap-1'
                }`}>
                  {imagePreviewUrls.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Post attachment ${index + 1}`}
                        className={`w-full rounded-lg object-cover ${
                          imagePreviewUrls.length === 1 ? 'max-h-[500px]' : 'h-48'
                        }`}
                      />
                      <button
                        onClick={async () => {
                          // Remove from preview immediately
                          const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
                          setImagePreviewUrls(newPreviewUrls);

                          // Since images are already uploaded, just update local state
                          // The next autosave will handle cleanup if needed
                          setImagesChanged(true);
                          toast.success('Image removed', { position: 'top-right' });
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Engagement Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <ThumbIcon className="w-4 h-4" />
                  <HeartIcon className="w-4 h-4" />
                  <ClapIcon className="w-4 h-4" />
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

          {/* Formatting Toolbar - Right side */}
          <div className="sticky top-0 flex flex-col gap-1 p-1">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={applyBoldFormatting}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bold (Unicode characters)"
            >
              <Bold className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={applyItalicFormatting}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Italic (Unicode characters)"
            >
              <Italic className="w-4 h-4 text-gray-700" />
            </button>
            <div className="h-px w-6 bg-gray-300 my-1" />
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertBulletList}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bullet list"
            >
              <List className="w-4 h-4 text-gray-700" />
            </button>
            <div className="h-px w-6 bg-gray-300 my-1" />
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleImageUpload}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Add image"
            >
              <ImagePlus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Floating Edit Button */}
          {showEditButton && editButtonPosition && !isEditingSelection && (
            <button
              ref={editButtonRef}
              onClick={handleShowEditPopover}
              className="fixed bg-white border border-gray-300 text-gray-700 px-2.5 py-1.5 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-1.5 text-xs shadow-sm z-50"
              style={{
                top: `${editButtonPosition.top}px`,
                left: `${editButtonPosition.left}px`,
              }}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}

          {/* Edit Selection Popover */}
          {showEditPopover && editButtonPosition && (
            <div
              ref={editPopoverRef}
              className="fixed bg-white rounded-lg shadow-2xl border border-gray-300 p-4 z-50"
              style={{
                minWidth: '320px',
                top: `${editButtonPosition.top + 40}px`,
                left: `${Math.min(Math.max(10, editButtonPosition.left - 160), window.innerWidth - 340)}px`
              }}
            >
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How should I change this?
                </label>
                <input
                  type="text"
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditSelection();
                    } else if (e.key === 'Escape') {
                      setShowEditPopover(false);
                    }
                  }}
                  placeholder="e.g., make this more professional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowEditPopover(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSelection}
                  size="sm"
                  disabled={!editInstruction.trim()}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Post Button or Connect LinkedIn - Fixed to bottom right of preview container */}
      <div className="absolute bottom-4 right-4 z-10 p-2">
        <div className="flex gap-3">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(postContent);
              toast.success('Copied to clipboard', { position: 'top-right' });
            }}
            variant="outline"
            size="icon"
            className="bg-white text-gray-700 hover:bg-gray-50 shadow-xl rounded-lg"
          >
            <Copy className="w-4 h-4" />
          </Button>
          {hasLinkedIn ? (
            <>
              <Button
                onClick={() => setShowScheduleModal(true)}
                variant="outline"
                size="icon"
                className="bg-white text-gray-700 hover:bg-gray-50 shadow-xl rounded-lg"
              >
                <Calendar className="w-4 h-4" />
              </Button>
              <Button
                onClick={handlePostNow}
                className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 shadow-xl rounded-lg px-6 py-3"
              >
                <Send className="w-4 h-4" />
                <span className="font-medium">Post Now</span>
              </Button>
            </>
          ) : (
            <ConnectLinkedInButton
              className="shadow-xl rounded-lg px-6 py-3"
              onSuccess={() => window.location.reload()}
            />
          )}
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