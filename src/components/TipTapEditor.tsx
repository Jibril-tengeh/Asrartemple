import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const setHeading = (level: any) => editor.chain().focus().toggleHeading({ level }).run();

  const addImage = () => {
    const url = window.prompt('URL de l\'image');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl">
      <button onClick={toggleBold} className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>B</button>
      <button onClick={toggleItalic} className={`px-2 py-1 rounded text-sm italic ${editor.isActive('italic') ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>I</button>
      <button onClick={toggleStrike} className={`px-2 py-1 rounded text-sm line-through ${editor.isActive('strike') ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>S</button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto" />
      <button onClick={() => setHeading(1)} className={`px-2 py-1 rounded text-sm font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>H1</button>
      <button onClick={() => setHeading(2)} className={`px-2 py-1 rounded text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>H2</button>
      <button onClick={() => setHeading(3)} className={`px-2 py-1 rounded text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>H3</button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto" />
      <button onClick={toggleBulletList} className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>• List</button>
      <button onClick={toggleOrderedList} className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>1. List</button>
      <button onClick={toggleBlockquote} className={`px-2 py-1 rounded text-sm ${editor.isActive('blockquote') ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Quote</button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto" />
      <button onClick={addImage} className={`px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`}>Image</button>
    </div>
  );
};

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange, className }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[250px] p-4 text-gray-900 dark:text-white',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className={`flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 ${className || ''}`}>
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
