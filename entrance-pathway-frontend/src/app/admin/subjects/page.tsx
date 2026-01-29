"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
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
import { GET_SUBJECTS, GET_SUBJECT } from "@/graphql/queries/admin";
import {
  CREATE_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT,
  CREATE_TOPIC,
  UPDATE_TOPIC,
  DELETE_TOPIC,
} from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  id: string;
  name: string;
  description: string | null;
  questionsCount: number;
}

interface Subject {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  topics?: Topic[];
  topicsCount: number;
  questionsCount: number;
}

export default function SubjectsPage() {
  const { toast } = useToast();
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

  const { data, loading, refetch } = useQuery(GET_SUBJECTS);

  // Fetch topics when expanding a subject
  const { data: subjectData, refetch: refetchSubject } = useQuery(GET_SUBJECT, {
    variables: { id: selectedSubjectId },
    skip: !selectedSubjectId,
  });

  const [createSubject, { loading: creatingSubject }] = useMutation(CREATE_SUBJECT, {
    onCompleted: () => {
      toast({ title: "Subject created" });
      setShowSubjectDialog(false);
      resetSubjectForm();
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [updateSubject, { loading: updatingSubject }] = useMutation(UPDATE_SUBJECT, {
    onCompleted: () => {
      toast({ title: "Subject updated" });
      setShowSubjectDialog(false);
      resetSubjectForm();
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [deleteSubject, { loading: deletingSubject }] = useMutation(DELETE_SUBJECT, {
    onCompleted: () => {
      toast({ title: "Subject deleted" });
      setDeleteTarget(null);
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [createTopic, { loading: creatingTopic }] = useMutation(CREATE_TOPIC, {
    onCompleted: () => {
      toast({ title: "Topic created" });
      setShowTopicDialog(false);
      resetTopicForm();
      refetch();
      if (selectedSubjectId) refetchSubject();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [updateTopic, { loading: updatingTopic }] = useMutation(UPDATE_TOPIC, {
    onCompleted: () => {
      toast({ title: "Topic updated" });
      setShowTopicDialog(false);
      resetTopicForm();
      refetch();
      if (selectedSubjectId) refetchSubject();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [deleteTopic, { loading: deletingTopic }] = useMutation(DELETE_TOPIC, {
    onCompleted: () => {
      toast({ title: "Topic deleted" });
      setDeleteTarget(null);
      refetch();
      if (selectedSubjectId) refetchSubject();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

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

  const handleSaveSubject = () => {
    if (editingSubject) {
      updateSubject({
        variables: {
          id: editingSubject.id,
          name: subjectName,
          description: subjectDescription || null,
          icon: subjectIcon || null,
        },
      });
    } else {
      createSubject({
        variables: {
          input: {
            name: subjectName,
            description: subjectDescription || null,
            icon: subjectIcon || null,
          },
        },
      });
    }
  };

  const handleSaveTopic = () => {
    if (editingTopic) {
      updateTopic({
        variables: {
          id: editingTopic.id,
          name: topicName,
          description: topicDescription || null,
        },
      });
    } else {
      createTopic({
        variables: {
          input: {
            subjectId: selectedSubjectId,
            name: topicName,
            description: topicDescription || null,
          },
        },
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "subject") {
      deleteSubject({ variables: { id: deleteTarget.id } });
    } else {
      deleteTopic({ variables: { id: deleteTarget.id } });
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
    }
    setExpandedSubjects(newExpanded);
  };

  const subjects: Subject[] = data?.subjects || [];

  // Merge topics from subjectData when available
  const getTopicsForSubject = (subjectId: string) => {
    if (subjectData?.subject?.id === subjectId) {
      return subjectData.subject.topics || [];
    }
    return [];
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
                      {getTopicsForSubject(subject.id).map((topic: Topic) => (
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
