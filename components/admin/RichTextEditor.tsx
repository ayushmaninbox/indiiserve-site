"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import FloatingMenuExtension from "@tiptap/extension-floating-menu";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  Heading1, Heading2, 
  List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, 
  Link as LinkIcon, Image as ImageIcon, 
  Quote, Undo, Redo, 
  Copy, Trash, Check, X, Upload, ExternalLink, 
  Eraser, Minus, Maximize2, Minimize2, Plus, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useState, useEffect, useRef } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children, 
  title,
  className
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean; 
  children: React.ReactNode;
  title?: string;
  className?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    type="button"
    className={cn(
      "p-2 rounded-lg transition-all duration-200 text-slate-400 hover:bg-white/5 hover:text-white",
      isActive && "bg-violet-500/20 text-violet-400 font-medium",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
);

export default function RichTextEditor({ content, onChange, className, placeholder }: RichTextEditorProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [linkPopover, setLinkPopover] = useState<{ x: number; y: number; visible: boolean; url: string }>({ x: 0, y: 0, visible: false, url: "" });
  const [imagePopover, setImagePopover] = useState<{ x: number; y: number; visible: boolean; tab: "url" | "upload"; url: string }>({ x: 0, y: 0, visible: false, tab: "upload", url: "" });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [, forceUpdate] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "border-t border-white/10 my-8",
          },
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "w-full rounded-2xl border border-white/5 shadow-2xl my-6 block selection:bg-violet-500/30 cursor-pointer",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-violet-400 underline decoration-violet-500/30 underline-offset-4 cursor-pointer",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing your masterpiece...",
      }),
      BubbleMenuExtension,
      FloatingMenuExtension,
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-invert prose-stone max-w-none focus:outline-none min-h-[500px] px-8 py-10 selection:bg-violet-500/30",
          "prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white",
          "prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg",
          "prose-strong:text-white prose-strong:font-black",
          "prose-blockquote:border-l-4 prose-blockquote:border-violet-500 prose-blockquote:bg-violet-500/5 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:rounded-r-xl prose-blockquote:italic",
          "prose-li:text-slate-300 prose-img:rounded-3xl",
          "tiptap-editor font-poppins"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onTransaction: () => {
      forceUpdate((n) => n + 1);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".link-popover") && !target.closest(".image-popover") && !target.closest(".menu-button-interactive")) {
        setLinkPopover(prev => ({ ...prev, visible: false }));
        setImagePopover(prev => ({ ...prev, visible: false }));
      }
      setContextMenu(prev => ({ ...prev, visible: false }));
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setLinkPopover(prev => ({ ...prev, visible: false }));
    setImagePopover(prev => ({ ...prev, visible: false }));
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
  };

  const openImagePopover = useCallback(() => {
    if (!editor) return;
    const toolbar = editorRef.current?.querySelector(".editor-toolbar");
    const rect = toolbar?.getBoundingClientRect();
    
    setImagePopover({
      x: rect ? rect.left + 400 : 300, 
      y: rect ? rect.bottom + 10 : 200,
      visible: true,
      tab: "upload",
      url: ""
    });
  }, [editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        editor.chain().focus().setImage({ src: data.path }).run();
        setImagePopover(prev => ({ ...prev, visible: false }));
        (window as any).showToast?.("Image inserted successfully", "success");
      } else {
        (window as any).showToast?.(data.error || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      (window as any).showToast?.("Failed to upload image", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const insertImageUrl = () => {
    if (imagePopover.url && editor) {
      editor.chain().focus().setImage({ src: imagePopover.url }).run();
      setImagePopover(prev => ({ ...prev, visible: false }));
    }
  };

  const openLinkPopover = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    const toolbar = editorRef.current?.querySelector(".editor-toolbar");
    const rect = toolbar?.getBoundingClientRect();
    
    setLinkPopover({
      x: rect ? rect.left + 300 : 200,
      y: rect ? rect.bottom + 10 : 200,
      visible: true,
      url: previousUrl
    });
  }, [editor]);

  const applyLink = () => {
    if (!editor) return;
    if (linkPopover.url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkPopover.url }).run();
    }
    setLinkPopover(prev => ({ ...prev, visible: false }));
  };

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkPopover(prev => ({ ...prev, visible: false, url: "" }));
  };

  const handleCopy = () => {
    const selection = window.getSelection();
    if (selection) {
      navigator.clipboard.writeText(selection.toString());
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  if (!editor) return null;

  return (
    <div 
      ref={editorRef}
      onContextMenu={handleContextMenu}
      className={cn(
        "relative flex flex-col rounded-[2.5rem] border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-500",
        isFullscreen ? "fixed inset-0 z-[60] rounded-none bg-[#030014]" : "shadow-2xl",
        className
      )}
    >
      <style jsx global>{`
        .ProseMirror-selectednode {
          outline: 3px solid #8b5cf6;
          box-shadow: 0 0 0 12px rgba(139, 92, 246, 0.1);
          border-radius: 1.5rem;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .BubbleMenu {
          display: flex;
          background-color: #030014;
          padding: 4px;
          border-radius: 14px;
          border: 1px border-white/10;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.1);
          backdrop-filter: blur(20px);
          gap: 2px;
          animation: bubble-in 0.2s ease-out;
        }
        @keyframes bubble-in {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="editor-toolbar flex flex-wrap items-center gap-1 border-b border-white/5 bg-[#030014]/50 backdrop-blur-xl p-3 sticky top-0 z-20">
        <div className="flex items-center gap-1 border-r border-white/5 pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={18} strokeWidth={2.5} /></MenuButton>
        </div>

        <div className="flex items-center gap-1 border-r border-white/5 pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold"><Bold size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic"><Italic size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} title="Underline"><UnderlineIcon size={18} strokeWidth={2.5} /></MenuButton>
        </div>

        <div className="flex items-center gap-1 border-r border-white/5 pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} title="Heading 1"><Heading1 size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 size={18} strokeWidth={2.5} /></MenuButton>
        </div>

        <div className="flex items-center gap-1 border-r border-white/5 pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Align Left"><AlignLeft size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Align Center"><AlignCenter size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} title="Align Right"><AlignRight size={18} strokeWidth={2.5} /></MenuButton>
        </div>

        <div className="flex items-center gap-1 border-r border-white/5 pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List"><List size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Ordered List"><ListOrdered size={18} strokeWidth={2.5} /></MenuButton>
        </div>

        <div className="flex items-center gap-1 border-r border-white/5 pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote"><Quote size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={openLinkPopover} isActive={editor.isActive("link")} title="Link" className="menu-button-interactive"><LinkIcon size={18} strokeWidth={2.5} /></MenuButton>
          <MenuButton onClick={openImagePopover} isActive={imagePopover.visible} title="Image" className="menu-button-interactive" disabled={isUploading}>
            {isUploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /> : <ImageIcon size={18} strokeWidth={2.5} />}
          </MenuButton>
        </div>

        <div className="ml-auto">
          <MenuButton onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? "Minimize" : "Fullscreen"}>
            {isFullscreen ? <Minimize2 size={18} strokeWidth={2.5} /> : <Maximize2 size={18} strokeWidth={2.5} />}
          </MenuButton>
        </div>
      </div>

      <div className={cn(
        "flex-1 overflow-y-auto custom-scrollbar bg-white/[0.01]",
        isFullscreen ? "h-[calc(100vh-60px)]" : "h-[600px]"
      )}>
        {editor && (
            <>
                <BubbleMenu editor={editor} updateDelay={100} className="BubbleMenu">
                    <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")}><Bold size={14} strokeWidth={3} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")}><Italic size={14} strokeWidth={3} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")}><UnderlineIcon size={14} strokeWidth={3} /></MenuButton>
                    <div className="w-[1px] h-4 bg-white/10 mx-1 self-center" />
                    <MenuButton onClick={openLinkPopover} isActive={editor.isActive("link")} className="menu-button-interactive"><LinkIcon size={14} strokeWidth={3} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().run()}><Eraser size={14} strokeWidth={3} /></MenuButton>
                </BubbleMenu>

                <FloatingMenu editor={editor} updateDelay={100} className="flex gap-1 bg-neutral-900 border border-white/5 p-1.5 rounded-xl shadow-2xl">
                    <button 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-slate-400 hover:text-white"
                        title="Main Heading"
                    >
                        <Heading1 size={14} />
                    </button>
                    <button 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-slate-400 hover:text-white"
                        title="Sub Heading"
                    >
                        <Heading2 size={14} />
                    </button>
                    <button 
                        onClick={openImagePopover}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-slate-400 hover:text-white"
                        title="Insert Image"
                    >
                        <ImageIcon size={14} />
                    </button>
                </FloatingMenu>
            </>
        )}
        <EditorContent editor={editor} />
      </div>

      {imagePopover.visible && (
        <div 
           className="image-popover fixed z-[100] bg-[#030014] rounded-2xl shadow-2xl border border-white/10 p-5 min-w-[320px] animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 backdrop-blur-3xl"
           style={{ top: imagePopover.y, left: imagePopover.x }}
           onClick={(e) => e.stopPropagation()}
        >
           <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex gap-4">
                 <button onClick={() => setImagePopover({...imagePopover, tab: "upload"})} className={cn("text-[10px] font-black uppercase tracking-wider pb-1.5 transition-all", imagePopover.tab === "upload" ? "text-violet-400 border-b-2 border-violet-400" : "text-slate-500 hover:text-slate-300")}>Upload</button>
                 <button onClick={() => setImagePopover({...imagePopover, tab: "url"})} className={cn("text-[10px] font-black uppercase tracking-wider pb-1.5 transition-all", imagePopover.tab === "url" ? "text-violet-400 border-b-2 border-violet-400" : "text-slate-500 hover:text-slate-300")}>Link</button>
              </div>
              <button onClick={() => setImagePopover({...imagePopover, visible: false})} className="text-slate-500 hover:text-white transition-colors"><X size={16} strokeWidth={2.5} /></button>
           </div>

           {imagePopover.tab === "upload" ? (
              <div 
                className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl hover:bg-white/[0.03] hover:border-violet-500/30 transition-all cursor-pointer group" 
                onClick={() => fileInputRef.current?.click()}
              >
                 <Upload className="w-8 h-8 text-slate-600 mb-2 group-hover:text-violet-500 transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click to upload image</span>
                 <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600 mt-1">or drag and drop</span>
              </div>
           ) : (
              <div className="flex gap-2">
                 <input 
                    type="text" 
                    value={imagePopover.url}
                    onChange={(e) => setImagePopover({...imagePopover, url: e.target.value})}
                    placeholder="Paste image URL..."
                    className="flex-1 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/40 transition-all"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && insertImageUrl()}
                 />
                 <button onClick={insertImageUrl} className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20">
                    <Check size={18} strokeWidth={3} />
                 </button>
              </div>
           )}
        </div>
      )}

      {linkPopover.visible && (
         <div 
          className="link-popover fixed z-[100] bg-[#030014] rounded-2xl shadow-2xl border border-white/10 p-4 min-w-[300px] animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-3 backdrop-blur-3xl"
          style={{ top: linkPopover.y, left: linkPopover.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Edit Link</label> 
            <button onClick={() => setLinkPopover({...linkPopover, visible: false})} className="text-slate-500 hover:text-white"><X size={14} strokeWidth={2.5} /></button>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={linkPopover.url}
              onChange={(e) => setLinkPopover({...linkPopover, url: e.target.value})}
              placeholder="https://example.com"
              className="flex-1 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/40 transition-all"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && applyLink()}
            />
            <button onClick={applyLink} className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20">
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 mt-1 pt-3">
            <button onClick={removeLink} className="text-[9px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
              <Eraser size={12} strokeWidth={2.5} /> Remove Link
            </button>
             <button onClick={() => window.open(linkPopover.url, "_blank")} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors" disabled={!linkPopover.url}>
              <ExternalLink size={12} strokeWidth={2.5} /> Test Link
            </button>
          </div>
        </div>
      )}

      {contextMenu.visible && (
        <div 
          className="fixed z-[100] bg-[#030014] rounded-2xl shadow-2xl border border-white/10 py-2 min-w-[180px] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-3xl"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-1.5 text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Format Text</div>
          <button onClick={() => { editor.chain().focus().toggleBold().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-all">
            <Bold size={14} strokeWidth={2.5} /> Bold
          </button>
          <button onClick={() => { editor.chain().focus().toggleItalic().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-all">
            <Italic size={14} strokeWidth={2.5} /> Italic
          </button>
           <button onClick={() => { editor.chain().focus().toggleUnderline().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-all">
            <UnderlineIcon size={14} strokeWidth={2.5} /> Underline
          </button>
          <div className="my-2 border-t border-white/5" />
           <button onClick={handleCopy} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-all">
            <Copy size={14} strokeWidth={2.5} /> Copy
          </button>
          <div className="my-2 border-t border-white/5" />
          <div className="px-4 py-1.5 text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Actions</div>
          <button onClick={() => { editor.chain().focus().unsetAllMarks().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-all">
            <Eraser size={14} strokeWidth={2.5} /> Clear Format
          </button>
          <button onClick={() => { editor.chain().focus().deleteSelection().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-all">
            <Trash size={14} strokeWidth={2.5} /> Delete Selection
          </button>
        </div>
      )}

      {editor && (
        <div className="border-t border-white/5 bg-black/20 px-6 py-2 flex justify-between items-center text-[10px] text-slate-500 font-medium tracking-tight">
          <div className="flex gap-4">
            <span>{editor.storage.characterCount?.characters() || editor.getText().length} Characters</span>
            <span>{editor.getText().split(/\s+/).filter(Boolean).length} Words</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Editor Ready</span>
          </div>
        </div>
      )}
    </div>
  );
}
