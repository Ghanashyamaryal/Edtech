"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { HelpCircle, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { GET_SUBJECTS, GET_TOPICS } from "@/graphql/queries/admin";
import { CREATE_QUESTION } from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const questionSchema = z.object({
  questionText: z.string().min(1, "Question is required"),
  questionType: z.enum(["multiple_choice", "true_false", "short_answer"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  subjectId: z.string().min(1, "Subject is required"),
  topicId: z.string().optional(),
  explanation: z.string().optional(),
  options: z.array(
    z.object({
      text: z.string().min(1, "Option text is required"),
      isCorrect: z.boolean(),
    })
  ),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function NewQuestionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>("");

  const { data: subjectsData } = useQuery(GET_SUBJECTS);
  const { data: topicsData } = useQuery(GET_TOPICS, {
    variables: { subjectId: selectedSubjectId },
    skip: !selectedSubjectId,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: "",
      questionType: "multiple_choice",
      difficulty: "medium",
      subjectId: "",
      topicId: "",
      explanation: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const questionType = watch("questionType");
  const options = watch("options");

  // Update subject ID for topics query
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "subjectId" && value.subjectId) {
        setSelectedSubjectId(value.subjectId);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Set true/false options when type changes
  React.useEffect(() => {
    if (questionType === "true_false") {
      setValue("options", [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: false },
      ]);
    }
  }, [questionType, setValue]);

  const [createQuestion, { loading }] = useMutation(CREATE_QUESTION, {
    onCompleted: () => {
      toast({
        title: "Question created",
        description: "Your question has been added to the question bank.",
      });
      router.push("/admin/question-bank");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const setCorrectAnswer = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setValue("options", newOptions);
  };

  const onSubmit = (data: QuestionFormData) => {
    // Ensure at least one correct answer for multiple choice
    if (
      data.questionType === "multiple_choice" &&
      !data.options.some((opt) => opt.isCorrect)
    ) {
      toast({
        title: "Error",
        description: "Please select a correct answer",
        variant: "destructive",
      });
      return;
    }

    createQuestion({
      variables: {
        input: {
          questionText: data.questionText,
          questionType: data.questionType,
          difficulty: data.difficulty,
          subjectId: data.subjectId,
          topicId: data.topicId || null,
          explanation: data.explanation || null,
          options: data.options,
        },
      },
    });
  };

  const subjects = subjectsData?.subjects || [];
  const topics = topicsData?.topics || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/question-bank">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <Title className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6" />
            Create New Question
          </Title>
          <Paragraph className="text-muted-foreground">
            Add a new question to the question bank
          </Paragraph>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Text */}
            <div className="space-y-2">
              <Label htmlFor="questionText">Question *</Label>
              <Textarea
                id="questionText"
                placeholder="Enter your question"
                rows={3}
                {...register("questionText")}
              />
              {errors.questionText && (
                <p className="text-sm text-destructive">{errors.questionText.message}</p>
              )}
            </div>

            {/* Type and Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Question Type *</Label>
                <Select
                  value={questionType}
                  onValueChange={(value: any) => setValue("questionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="short_answer">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty *</Label>
                <Select
                  value={watch("difficulty")}
                  onValueChange={(value: any) => setValue("difficulty", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subject and Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select
                  value={watch("subjectId")}
                  onValueChange={(value) => setValue("subjectId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject: any) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subjectId && (
                  <p className="text-sm text-destructive">{errors.subjectId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Topic (Optional)</Label>
                <Select
                  value={watch("topicId") || ""}
                  onValueChange={(value) => setValue("topicId", value)}
                  disabled={!selectedSubjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic: any) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        {questionType !== "short_answer" && (
          <Card>
            <CardHeader>
              <CardTitle>Answer Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      {...register(`options.${index}.text`)}
                      disabled={questionType === "true_false"}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`correct-${index}`} className="text-sm text-muted-foreground">
                      Correct
                    </Label>
                    <Switch
                      id={`correct-${index}`}
                      checked={options[index]?.isCorrect || false}
                      onCheckedChange={() => setCorrectAnswer(index)}
                    />
                  </div>
                  {questionType === "multiple_choice" && fields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              {questionType === "multiple_choice" && fields.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ text: "", isCorrect: false })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>Explanation (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Explain the correct answer..."
              rows={3}
              {...register("explanation")}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading || isSubmitting}>
            {(loading || isSubmitting) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Question
          </Button>
          <Link href="/admin/question-bank">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
