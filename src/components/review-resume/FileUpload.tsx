import { useRef, useState } from 'react';
import { FileText, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  error: string | null;
}

export default function FileUpload({ onFileSelect, isUploading, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div>
      {!selectedFile ? (
        <div className="relative">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-[3px] border-dashed rounded-2xl py-16 px-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-indigo-400 hover:border-indigo-600 hover:bg-indigo-50/30'
            }`}
          >
            <div className="flex flex-col items-center gap-5">
              {/* File Upload Icon */}
              <div className="relative">
                <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
                  {/* Inbox/Tray base */}
                  <path
                    d="M15 45 L15 60 C15 65 17 67 22 67 L58 67 C63 67 65 65 65 60 L65 45"
                    stroke="#6366F1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#E0E7FF"
                  />
                  <path
                    d="M15 45 L30 45 C30 45 32 52 40 52 C48 52 50 45 50 45 L65 45"
                    stroke="#6366F1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Upload Arrow */}
                  <path
                    d="M40 15 L40 45"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 25 L40 15 L50 25"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>

              <div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  Drop your resume PDF here
                </p>
                <p className="text-base text-gray-500">or click to browse</p>
              </div>

              <button
                type="button"
                className="mt-2 px-8 py-3 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Choose File
              </button>

              <p className="text-sm text-gray-400 mt-1">Maximum file size: 32 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Selected File Display */}
          <div className="flex items-center justify-between p-5 bg-indigo-50 rounded-xl border-2 border-indigo-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base">{selectedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={handleRemoveFile}
                className="p-2 hover:bg-indigo-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full px-6 py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isUploading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
