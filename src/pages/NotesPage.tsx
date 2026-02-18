import React, { useState, useMemo } from 'react';
import { useFocus, Note } from '@/contexts/FocusContext';
import { 
  Plus, Search, Tag, Trash2, Star, Download, FileText, 
  ExternalLink, ChevronRight, X, Edit3, Bookmark, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogClose 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const NotesPage = () => {
  const { notes, addNote, updateNote, deleteNote } = useFocus();
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: [] as string[], isImportant: false });
  const [tagInput, setTagInput] = useState('');

  const filteredNotes = useMemo(() => {
    return notes.filter(n => 
      n.title.toLowerCase().includes(search.toLowerCase()) || 
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
  }, [notes, search]);

  const handleAddNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;
    addNote(newNote);
    setNewNote({ title: '', content: '', tags: [], isImportant: false });
    toast.success('Note added successfully');
  };

  const handleUpdateNote = () => {
    if (editingNote) {
      updateNote(editingNote.id, editingNote);
      toast.success('Note updated');
      setEditingNote(null);
    }
  };

  const handleExportTXT = (note: Note) => {
    const element = document.createElement("a");
    const file = new Blob([`${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(', ')}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    toast.info('Exporting as TXT...');
  };

  const handleExportPDF = (note: Note) => {
    // Simple mock export for PDF (actual PDF gen usually needs library like jsPDF)
    // We'll just trigger print which can save as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>${note.title}</title><style>body{font-family:serif;padding:2rem;max-width:800px;margin:auto;}h1{border-bottom:2px solid orange;}</style></head><body><h1>${note.title}</h1><p>${note.content.replace(/\n/g, '<br>')}</p></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const addTag = (isNew: boolean) => {
    if (!tagInput.trim()) return;
    if (isNew) {
      setNewNote(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    } else if (editingNote) {
      setEditingNote({ ...editingNote, tags: [...editingNote.tags, tagInput.trim()] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string, isNew: boolean) => {
    if (isNew) {
      setNewNote(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    } else if (editingNote) {
      setEditingNote({ ...editingNote, tags: editingNote.tags.filter(t => t !== tag) });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">My Notes</h1>
          <p className="text-muted-foreground">Capture your study thoughts and organize your knowledge.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input 
              placeholder="Search notes..." 
              className="pl-10 bg-card/50 border-accent/20 transition-all focus:ring-primary focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all font-bold gap-2">
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">New Note</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
              <div className="bg-primary p-6 flex items-center justify-between text-primary-foreground">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Create New Note
                </DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10 text-primary-foreground">
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </div>
              <div className="p-8 space-y-6">
                <Input 
                  placeholder="Note Title" 
                  className="text-2xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
                <Textarea 
                  placeholder="Start writing your brilliant ideas..." 
                  className="min-h-[250px] resize-none border-none p-0 focus-visible:ring-0 text-lg leading-relaxed placeholder:text-muted-foreground/30"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
                <div className="pt-4 border-t">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {newNote.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1 gap-1.5 bg-accent hover:bg-accent/80 transition-colors">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag, true)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add tag..." 
                      className="h-9 text-sm"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag(true)}
                    />
                    <Button variant="outline" size="sm" onClick={() => addTag(true)}>Add</Button>
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-accent/50 p-4 border-t px-8">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button className="bg-primary text-primary-foreground font-bold px-8" onClick={() => { handleAddNote(); setIsDialogOpen(false); }}>Save Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-accent/20 rounded-3xl border-2 border-dashed border-accent/50 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
            <BookMarked className="w-10 h-10 text-primary/50" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No notes found</h3>
          <p className="text-muted-foreground text-center max-w-xs">
            {search ? "We couldn't find any notes matching your search." : "Your study space is empty. Click 'New Note' to start writing!"}
          </p>
          {search && <Button variant="link" onClick={() => setSearch('')} className="mt-2">Clear search</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredNotes.map(note => (
            <Card key={note.id} className="group relative bg-card border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer flex flex-col h-[280px]">
              <div 
                className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={() => setEditingNote(note)}
              />
              <CardHeader className="relative z-10 pb-2 flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-xl font-bold line-clamp-1 pr-8 leading-tight group-hover:text-primary transition-colors">
                  {note.title || 'Untitled Note'}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("w-8 h-8 rounded-full", note.isImportant ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity")}
                    onClick={(e) => { e.stopPropagation(); updateNote(note.id, { isImportant: !note.isImportant }); }}
                  >
                    <Star className={cn("w-4 h-4", note.isImportant && "fill-current")} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 flex-1 overflow-hidden" onClick={() => setEditingNote(note)}>
                <p className="text-muted-foreground text-sm line-clamp-4 mb-4 leading-relaxed">
                  {note.content || 'No content yet...'}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] uppercase tracking-wider py-0 px-2 bg-accent/50 text-accent-foreground border-none">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <div className="relative z-10 bg-accent/30 px-4 py-3 border-t border-accent/20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white hover:text-primary" onClick={() => handleExportTXT(note)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white hover:text-primary" onClick={() => handleExportPDF(note)}>
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); toast.error('Note deleted'); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Editing Dialog */}
      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
          <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-primary p-6 flex items-center justify-between text-primary-foreground shrink-0">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5" />
                <h2 className="text-xl font-bold">Edit Note</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("w-9 h-9 text-primary-foreground", editingNote.isImportant && "bg-white/10")}
                  onClick={() => setEditingNote({ ...editingNote, isImportant: !editingNote.isImportant })}
                >
                  <Star className={cn("w-5 h-5", editingNote.isImportant && "fill-current")} />
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10 text-primary-foreground">
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-card custom-scrollbar">
              <Input 
                placeholder="Note Title" 
                className="text-4xl font-black border-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/20 leading-tight"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              />
              <div className="flex flex-wrap gap-2 items-center">
                <Tag className="w-4 h-4 text-primary" />
                {editingNote.tags.map(tag => (
                  <Badge key={tag} className="gap-1 px-3 py-1 bg-accent text-accent-foreground border-none">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag, false)} />
                  </Badge>
                ))}
                <div className="flex items-center gap-1 ml-2">
                  <Input 
                    placeholder="New tag..." 
                    className="h-8 w-24 text-xs"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag(false)}
                  />
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => addTag(false)}><Plus className="w-3 h-3" /></Button>
                </div>
              </div>
              <Textarea 
                placeholder="Content..." 
                className="min-h-[500px] text-lg leading-relaxed border-none p-0 focus-visible:ring-0 resize-none shadow-none bg-transparent"
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              />
            </div>

            <div className="bg-accent/50 p-6 border-t shrink-0 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium italic">
                Last edited {new Date(editingNote.updatedAt).toLocaleString()}
              </span>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => handleExportPDF(editingNote)} className="gap-2">
                  <Download className="w-4 h-4" /> Export PDF
                </Button>
                <Button className="bg-primary text-primary-foreground px-8 font-bold gap-2" onClick={handleUpdateNote}>
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Simple Lucide icon fallback
const BookMarked = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    <path d="M8 7h6" />
    <path d="M8 11h8" />
  </svg>
);

export default NotesPage;
