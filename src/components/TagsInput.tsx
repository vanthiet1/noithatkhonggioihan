'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import { X } from 'lucide-react';

interface TagsInputProps {
  name: string;
  placeholder?: string;
  initialTags?: string;
}

export default function TagsInput({ name, placeholder, initialTags = '' }: TagsInputProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Initialize tags on first render or when initialTags changes
  useEffect(() => {
    if (initialTags) {
      setTags(initialTags.split(',').map(t => t.trim()).filter(Boolean));
    }
  }, [initialTags]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      const cleanedTag = newTag.replace(/,$/, '').trim();
      
      if (cleanedTag && !tags.includes(cleanedTag)) {
        setTags([...tags, cleanedTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition flex flex-wrap gap-2 items-center min-h-[46px]">
      {tags.map((tag, index) => (
        <span 
          key={index} 
          className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2.5 py-1 rounded-md text-sm font-medium border border-sky-100"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-sky-500 hover:text-sky-700 focus:outline-none ml-0.5"
            title="Xóa từ khóa"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Add tag on blur if there is pending text
          const newTag = inputValue.trim().replace(/,$/, '').trim();
          if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setInputValue('');
          }
        }}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-grow outline-none border-none bg-transparent text-gray-900 placeholder-gray-400 min-w-[120px] text-sm py-0.5"
      />
      {/* Hidden input to pass the actual comma-separated value to the form */}
      <input type="hidden" name={name} value={tags.join(', ')} />
    </div>
  );
}
