"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { ArrowLeft, Loader2, Upload, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import {
  getSubjects,
  bulkCreateQuestions,
  type Subject,
  type CreateQuestionInput,
  type QuestionOption,
} from "@/actions";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_FORMAT = `1. What is the SI unit of force?
a) Joule
b) Newton*
c) Watt
d) Pascal
Explanation: Force is measured in Newtons (N), named after Sir Isaac Newton.

2. Which planet is closest to the Sun?
a) Venus
b) Earth
c) Mercury*
d) Mars

3. What is 2 + 2?
a) 3
b) 4*
c) 5
d) 6
Explanation: Basic addition.`;

function parseQuestions(
  text: string,
  subjectId: string,
  difficulty: string
): { questions: CreateQuestionInput[]; errors: string[] } {
  const questions: CreateQuestionInput[] = [];
  const errors: string[] = [];

  // Split by question numbers (1. 2. 3. etc.)
  const blocks = text.split(/(?=^\d+[\.\)]\s)/m).filter((b) => b.trim());

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    try {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

      // First line is the question (remove number prefix)
      const questionLine = lines[0].replace(/^\d+[\.\)]\s*/, "").trim();
      if (!questionLine) {
        errors.push(`Question ${i + 1}: Empty question text`);
        continue;
      }

      // Parse options (a) b) c) d) or a. b. c. d.)
      const options: QuestionOption[] = [];
      let correctIndex = -1;
      let explanationText = "";

      for (let j = 1; j < lines.length; j++) {
        const line = lines[j];

        // Check for explanation
        if (line.toLowerCase().startsWith("explanation:")) {
          explanationText = line.replace(/^explanation:\s*/i, "").trim();
          continue;
        }

        // Parse option line
        const optionMatch = line.match(/^([a-dA-D])[\.\)]\s*(.+)/);
        if (optionMatch) {
          let optionText = optionMatch[2].trim();
          let isCorrect = false;

          // Check if marked with * at the end
          if (optionText.endsWith("*")) {
            isCorrect = true;
            optionText = optionText.slice(0, -1).trim();
            correctIndex = options.length;
          }

          options.push({
            id: `opt-${options.length}`,
            text: optionText,
            isCorrect,
          });
        }
      }

      if (options.length < 2) {
        errors.push(`Question ${i + 1}: Need at least 2 options`);
        continue;
      }

      if (correctIndex === -1) {
        errors.push(`Question ${i + 1}: No correct answer marked (add * after correct option)`);
        continue;
      }

      questions.push({
        questionText: questionLine,
        questionType: "multiple_choice",
        options,
        difficulty,
        subjectId,
        explanation: explanationText || undefined,
      });
    } catch {
      errors.push(`Question ${i + 1}: Failed to parse`);
    }
  }

  return { questions, errors };
}

export default function BulkImportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [subjectId, setSubjectId] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("medium");
  const [inputText, setInputText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState<{
    questions: CreateQuestionInput[];
    errors: string[];
  } | null>(null);

  React.useEffect(() => {
    async function load() {
      const result = await getSubjects();
      if (result.success) setSubjects(result.data);
    }
    load();
  }, []);

  const handlePreview = () => {
    if (!subjectId) {
      toast({ title: "Select a subject first", variant: "destructive" });
      return;
    }
    if (!inputText.trim()) {
      toast({ title: "Paste your questions first", variant: "destructive" });
      return;
    }
    const result = parseQuestions(inputText, subjectId, difficulty);
    setPreview(result);
  };

  const handleImport = async () => {
    if (!preview || preview.questions.length === 0) return;

    setLoading(true);
    const result = await bulkCreateQuestions(preview.questions);

    if (result.success) {
      toast({
        title: "Questions imported!",
        description: `${result.data.created} questions created successfully.`,
      });
      router.push("/admin/question-bank");
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLoading(false);
  };

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
            <Upload className="w-6 h-6" />
            Bulk Import Questions
          </Title>
          <Paragraph className="text-muted-foreground">
            Paste multiple questions at once — much faster than one by one
          </Paragraph>
        </div>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings (applies to all questions)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
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
        </CardContent>
      </Card>

      {/* Format Guide */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <CardTitle>Format Guide</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Paste questions in this format. Mark the correct answer with <strong>*</strong> at the end:
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">
{`1. Your question text here?
a) Option A
b) Option B*
c) Option C
d) Option D
Explanation: Optional explanation text

2. Next question...
a) Option A*
b) Option B
c) Option C
d) Option D`}
          </pre>
        </CardContent>
      </Card>

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle>Paste Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your questions here..."
            rows={15}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setPreview(null);
            }}
            className="font-mono text-sm"
          />
          <div className="flex gap-3">
            <Button onClick={handlePreview} variant="outline" disabled={!inputText.trim() || !subjectId}>
              Preview ({inputText.split(/^\d+[\.\)]\s/m).filter((b) => b.trim()).length} questions detected)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInputText(SAMPLE_FORMAT);
                setPreview(null);
              }}
            >
              Load Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Errors */}
            {preview.errors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="font-medium text-destructive">
                    {preview.errors.length} error{preview.errors.length > 1 ? "s" : ""}
                  </p>
                </div>
                <ul className="text-sm text-destructive space-y-1">
                  {preview.errors.map((err, i) => (
                    <li key={i}>- {err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Parsed questions */}
            {preview.questions.length > 0 && (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <p className="font-medium">
                    {preview.questions.length} questions parsed successfully
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-3">
                  {preview.questions.map((q, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <p className="font-medium text-sm">
                        {i + 1}. {q.questionText}
                      </p>
                      <div className="mt-2 space-y-1">
                        {q.options.map((opt, j) => (
                          <p
                            key={j}
                            className={`text-sm pl-4 ${
                              opt.isCorrect ? "text-green-600 font-medium" : "text-muted-foreground"
                            }`}
                          >
                            {String.fromCharCode(97 + j)}) {opt.text}
                            {opt.isCorrect && " ✓"}
                          </p>
                        ))}
                      </div>
                      {q.explanation && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleImport}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import {preview.questions.length} Questions
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
