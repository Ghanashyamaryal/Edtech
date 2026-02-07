"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { ConfirmDialog } from "@/components/molecules/admin";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Tag,
} from "lucide-react";
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  type Subject,
  type Topic,
} from "@/actions";
import { useToast } from "@/hooks/use-toast";

export default function SubjectsPage() {
  const { toast } = useToast();

  // Data states
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [topicsBySubject, setTopicsBySubject] = React.useState<Record<string, Topic[]>>({});

  // Loading states
  const [loading, setLoading] = React.useState(true);
  const [creatingSubject, setCreatingSubject] = React.useState(false);
  const [updatingSubject, setUpdatingSubject] = React.useState(false);
  const [deletingSubject, setDeletingSubject] = React.useState(false);
  const [creatingTopic, setCreatingTopic] = React.useState(false);
  const [updatingTopic, setUpdatingTopic] = React.useState(false);
  const [deletingTopic, setDeletingTopic] = React.useState(false);

  // UI states
  const [expandedSubjects, setExpandedSubjects] = React.useState<Set<string>>(new Set());
  const [showSubjectDialog, setShowSubjectDialog] = React.useState(false);
  const [showTopicDialog, setShowTopicDialog] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null);
  const [editingTopic, setEditingTopic] = React.useState<Topic | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{ type: "subject" | "topic"; id: string; name: string } | null>(null);

  // Subject form state
  const [subjectName, setSubjectName] = React.useState("");
  const [subjectDescription, setSubjectDescription] = React.useState("");
  const [subjectIcon, setSubjectIcon] = React.useState("");

  // Topic form state
  const [topicName, setTopicName] = React.useState("");
  const [topicDescription, setTopicDescription] = React.useState("");

  // Load subjects
  const loadSubjects = React.useCallback(async () => {
    setLoading(true);
    const result = await getSubjects();
    if (result.success) {
      setSubjects(result.data);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLoading(false);
  }, [toast]);

  // Load topics for a subject
  const loadTopicsForSubject = React.useCallback(async (subjectId: string) => {
    const result = await getTopics(subjectId);
    if (result.success) {
      setTopicsBySubject((prev) => ({ ...prev, [subjectId]: result.data }));
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const resetSubjectForm = () => {
    setSubjectName("");
    setSubjectDescription("");
    setSubjectIcon("");
    setEditingSubject(null);
  };

  const resetTopicForm = () => {
    setTopicName("");
    setTopicDescription("");
    setEditingTopic(null);
  };

  const openSubjectDialog = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectName(subject.name);
      setSubjectDescription(subject.description || "");
      setSubjectIcon(subject.icon || "");
    }
    setShowSubjectDialog(true);
  };

  const openTopicDialog = (subjectId: string, topic?: Topic) => {
    setSelectedSubjectId(subjectId);
    if (topic) {
      setEditingTopic(topic);
      setTopicName(topic.name);
      setTopicDescription(topic.description || "");
    }
    setShowTopicDialog(true);
  };

  const handleSaveSubject = async () => {
    if (editingSubject) {
      setUpdatingSubject(true);
      const result = await updateSubject(editingSubject.id, {
        name: subjectName,
        description: subjectDescription || undefined,
        icon: subjectIcon || undefined,
      });
      if (result.success) {
        toast({ title: "Subject updated" });
        setShowSubjectDialog(false);
        resetSubjectForm();
        loadSubjects();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setUpdatingSubject(false);
    } else {
      setCreatingSubject(true);
      const result = await createSubject({
        name: subjectName,
        description: subjectDescription || undefined,
        icon: subjectIcon || undefined,
      });
      if (result.success) {
        toast({ title: "Subject created" });
        setShowSubjectDialog(false);
        resetSubjectForm();
        loadSubjects();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setCreatingSubject(false);
    }
  };

  const handleSaveTopic = async () => {
    if (!selectedSubjectId) return;

    if (editingTopic) {
      setUpdatingTopic(true);
      const result = await updateTopic(editingTopic.id, {
        name: topicName,
        description: topicDescription || undefined,
      });
      if (result.success) {
        toast({ title: "Topic updated" });
        setShowTopicDialog(false);
        resetTopicForm();
        loadSubjects();
        loadTopicsForSubject(selectedSubjectId);
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setUpdatingTopic(false);
    } else {
      setCreatingTopic(true);
      const result = await createTopic({
        subjectId: selectedSubjectId,
        name: topicName,
        description: topicDescription || undefined,
      });
      if (result.success) {
        toast({ title: "Topic created" });
        setShowTopicDialog(false);
        resetTopicForm();
        loadSubjects();
        loadTopicsForSubject(selectedSubjectId);
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setCreatingTopic(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "subject") {
      setDeletingSubject(true);
      const result = await deleteSubject(deleteTarget.id);
      if (result.success) {
        toast({ title: "Subject deleted" });
        setDeleteTarget(null);
        loadSubjects();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setDeletingSubject(false);
    } else {
      setDeletingTopic(true);
      const result = await deleteTopic(deleteTarget.id);
      if (result.success) {
        toast({ title: "Topic deleted" });
        setDeleteTarget(null);
        loadSubjects();
        if (selectedSubjectId) loadTopicsForSubject(selectedSubjectId);
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setDeletingTopic(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
      setSelectedSubjectId(null);
    } else {
      newExpanded.add(subjectId);
      setSelectedSubjectId(subjectId);
      // Load topics if not already loaded
      if (!topicsBySubject[subjectId]) {
        loadTopicsForSubject(subjectId);
      }
    }
    setExpandedSubjects(newExpanded);
  };

  const getTopicsForSubject = (subjectId: string) => {
    return topicsBySubject[subjectId] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title className="flex items-center gap-2">
            <Layers className="w-6 h-6" />
            Subjects & Topics
          </Title>
          <Paragraph className="text-muted-foreground">
            Organize your question bank by subjects and topics
          </Paragraph>
        </div>
        <Button onClick={() => openSubjectDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Subject
        </Button>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        {subjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No subjects yet</p>
              <Button onClick={() => openSubjectDialog()}>Add First Subject</Button>
            </CardContent>
          </Card>
        ) : (
          subjects.map((subject) => (
            <Card key={subject.id}>
              <Collapsible
                open={expandedSubjects.has(subject.id)}
                onOpenChange={() => toggleSubject(subject.id)}
              >
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="gap-2 p-0 h-auto hover:bg-transparent">
                        {expandedSubjects.has(subject.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mr-2">
                          <Layers className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-semibold">{subject.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({subject.topicsCount || 0} topics, {subject.questionsCount || 0} questions)
                        </span>
                      </Button>
                    </CollapsibleTrigger>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openSubjectDialog(subject);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({ type: "subject", id: subject.id, name: subject.name });
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-2 ml-8">
                      {getTopicsForSubject(subject.id).map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <Tag className="w-4 h-4 text-primary" />
                            <div>
                              <p className="font-medium">{topic.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {topic.questionsCount || 0} questions
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openTopicDialog(subject.id, topic)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setDeleteTarget({ type: "topic", id: topic.id, name: topic.name })
                              }
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => openTopicDialog(subject.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Topic
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>

      {/* Subject Dialog */}
      <Dialog open={showSubjectDialog} onOpenChange={(open) => { setShowSubjectDialog(open); if (!open) resetSubjectForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject ? "Edit Subject" : "Add Subject"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g., Mathematics"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={subjectDescription}
                onChange={(e) => setSubjectDescription(e.target.value)}
                placeholder="Enter subject description"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon (emoji or icon name)</Label>
              <Input
                value={subjectIcon}
                onChange={(e) => setSubjectIcon(e.target.value)}
                placeholder="e.g., calculator"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubjectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSubject} disabled={!subjectName || creatingSubject || updatingSubject}>
              {(creatingSubject || updatingSubject) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingSubject ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Topic Dialog */}
      <Dialog open={showTopicDialog} onOpenChange={(open) => { setShowTopicDialog(open); if (!open) resetTopicForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTopic ? "Edit Topic" : "Add Topic"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="e.g., Algebra"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                placeholder="Enter topic description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTopicDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTopic} disabled={!topicName || creatingTopic || updatingTopic}>
              {(creatingTopic || updatingTopic) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingTopic ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type === "subject" ? "Subject" : "Topic"}`}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? ${deleteTarget?.type === "subject" ? "This will also delete all topics in this subject." : ""} This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deletingSubject || deletingTopic}
        variant="destructive"
      />
    </div>
  );
}
