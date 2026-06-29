"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  Copy,
  FileJson,
  X,
  CheckCircle,
  AlertCircle,
  Check,
  X as XIcon,
  Type,
  ListChecks,
  Tag,
  Award,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { useDropzone } from "@/components/ui/dropzone";
import { toast } from "sonner";
import { useTopics, useQuestions } from "@/hooks";

interface QuestionBulkImportFormProps {
  bulkQuestions: boolean;
  setBulkQuestions: (open: boolean) => void;
}

const QuestionBulkImportForm = ({
  bulkQuestions: open,
  setBulkQuestions: onClose,
}: QuestionBulkImportFormProps) => {
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { topics = [] } = useTopics();
  const { createMany } = useQuestions();

  // Sample JSON for copy
  const sampleQuestionsJSON = JSON.stringify(
    [
      {
        questionText: "What is 2 + 2?",
        questionType: "MCQ",
        difficulty: "EASY",
        hints: ["Basic addition", "Think of pairs"],
        points: 1,
        explanation: "Two plus two equals four",
        tags: ["math", "addition"],
        status: "ACTIVE",
        options: [
          { text: "3", isCorrect: false },
          { text: "4", isCorrect: true },
          { text: "5", isCorrect: false },
        ],
      },
      {
        questionText: "JavaScript is a statically typed language.",
        questionType: "TRUE_FALSE",
        difficulty: "EASY",
        hints: ["Think about type declaration"],
        points: 1,
        explanation: "JavaScript is dynamically typed",
        tags: ["javascript", "programming"],
        status: "ACTIVE",
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true },
        ],
      },
      {
        questionText: "The capital of France is ______.",
        questionType: "FILL_BLANK",
        difficulty: "MEDIUM",
        hints: ["Think of the Eiffel Tower"],
        points: 2,
        explanation: "Paris is the capital of France",
        tags: ["geography", "europe"],
        status: "ACTIVE",
        options: [{ text: "Paris", isCorrect: true }],
      },
    ],
    null,
    2
  );

  const copySample = () => {
    navigator.clipboard.writeText(sampleQuestionsJSON);
    toast.success("Sample JSON copied to clipboard!");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = JSON.parse(event.target?.result as string);
          setJsonInput(JSON.stringify(content, null, 2));
          validateAndParseQuestions(content);
          toast.success("JSON file loaded successfully!");
        } catch (error) {
          toast.error("The file contains invalid JSON");
        }
      };
      reader.readAsText(file);
    } else {
      toast.error("Please upload a JSON file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const validateQuestion = (question: any, index: number) => {
    const errors: string[] = [];

    // Required fields
    const requiredFields = ["questionText", "questionType", "difficulty", "options"];
    requiredFields.forEach((field) => {
      if (!question[field]) {
        errors.push(`Question ${index + 1}: ${field} is required`);
      }
    });

    // Validate questionType
    const validQuestionTypes = ["MCQ", "TRUE_FALSE", "FILL_BLANK"];
    if (
      question.questionType &&
      !validQuestionTypes.includes(question.questionType)
    ) {
      errors.push(
        `Question ${index + 1}: questionType must be one of ${validQuestionTypes.join(
          ", "
        )}`
      );
    }

    // Validate difficulty
    const validDifficulties = ["EASY", "MEDIUM", "HARD"];
    if (
      question.difficulty &&
      !validDifficulties.includes(question.difficulty.toUpperCase()) && !validDifficulties.includes(question.difficulty)
    ) {
      errors.push(
        `Question ${index + 1}: difficulty must be one of ${validDifficulties.join(
          ", "
        )}`
      );
    }

    // Validate options
    if (question.options) {
      if (!Array.isArray(question.options) || question.options.length === 0) {
        errors.push(`Question ${index + 1}: options must be a non-empty array`);
      } else {
        const hasCorrectAnswer = question.options.some((opt: any) => opt.isCorrect);
        if (!hasCorrectAnswer) {
          errors.push(
            `Question ${index + 1}: at least one option must be marked as correct`
          );
        }
      }
    }

    // Validate points
    if (
      question.points &&
      (typeof question.points !== "number" || question.points < 1)
    ) {
      errors.push(`Question ${index + 1}: points must be a positive number`);
    }

    return errors;
  };

  const validateAndParseQuestions = (data: any) => {
    const errors: string[] = [];
    const parsed: any[] = [];

    if (!Array.isArray(data)) {
      toast.error("JSON should be an array of questions");
      return;
    }

    data.forEach((question, index) => {
      const questionErrors = validateQuestion(question, index);
      if (questionErrors.length > 0) {
        errors.push(...questionErrors);
      } else {
        // Normalize values
        parsed.push({
            ...question,
            difficulty: question.difficulty.toUpperCase(),
            status: question.status ? question.status.toUpperCase() : "ACTIVE",
        });
      }
    });

    setParsedQuestions(parsed);
    setValidationErrors(errors);
  };

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    try {
      if (value.trim()) {
        const parsed = JSON.parse(value);
        validateAndParseQuestions(parsed);
      } else {
        setParsedQuestions([]);
        setValidationErrors([]);
      }
    } catch (error: any) {
      setParsedQuestions([]);
      setValidationErrors([`Invalid JSON: ${error.message}`]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTopicId) {
      toast.error("Please select a topic");
      return;
    }

    if (validationErrors.length > 0) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    if (parsedQuestions.length === 0) {
      toast.error("Please add at least one valid question");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(`Importing ${parsedQuestions.length} questions...`);

    try {
      // Prepare questions with topicId
      const questionsWithTopic = parsedQuestions.map((q) => ({
        ...q,
        topicId: selectedTopicId,
      }));

      createMany.mutate(questionsWithTopic, {
        onSuccess: (res: any) => {
          toast.success(res?.data?.message || `Successfully imported ${parsedQuestions.length} questions!`, {
            id: toastId,
          });
          resetForm();
          onClose(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to import questions", {
            id: toastId,
          });
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
      });

    } catch (error: any) {
      toast.error(error.message || "Failed to import questions", {
        id: toastId,
      });
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedTopicId("");
    setJsonInput("");
    setParsedQuestions([]);
    setValidationErrors([]);
  };

  // Helper function to render difficulty badge
  const renderDifficultyBadge = (difficulty: string) => {
    const config: Record<string, { color: string; label: string }> = {
      EASY: { color: "bg-green-100 text-green-800", label: "Easy" },
      MEDIUM: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      HARD: { color: "bg-red-100 text-red-800", label: "Hard" },
      easy: { color: "bg-green-100 text-green-800", label: "Easy" },
      medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      hard: { color: "bg-red-100 text-red-800", label: "Hard" },
    };
    const { color, label } = config[difficulty] || config.EASY;
    return <Badge className={`${color} font-normal`}>{label}</Badge>;
  };

  // Helper function to render question type badge
  const renderQuestionTypeBadge = (type: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      MCQ: {
        color: "bg-blue-100 text-blue-800",
        icon: <ListChecks className="h-3 w-3 mr-1" />,
      },
      TRUE_FALSE: {
        color: "bg-purple-100 text-purple-800",
        icon: <Check className="h-3 w-3 mr-1" />,
      },
      FILL_BLANK: {
        color: "bg-indigo-100 text-indigo-800",
        icon: <Type className="h-3 w-3 mr-1" />,
      },
    };
    const { color, icon } = config[type] || config.MCQ;
    return (
      <Badge className={`${color} font-normal`}>
        {icon}
        {type}
      </Badge>
    );
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    return status === "ACTIVE" || status === "active" ? (
      <Badge className="bg-green-100 text-green-800 font-normal">Active</Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500 font-normal">
        Inactive
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Questions</DialogTitle>
          <DialogDescription>
            Import multiple questions at once by selecting a topic and pasting
            JSON or uploading a JSON file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Select Topic */}
          <div className="space-y-3">
            <Label htmlFor="topic">1. Select Topic *</Label>
            <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a topic" />
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

          {/* Step 2: JSON Input - Split Layout */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="json">2. Paste JSON or Upload File *</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Sample JSON */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Sample Format</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={copySample}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Sample
                  </Button>
                </div>
                <Card className="">
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                      <pre className="p-2 text-xs font-mono bg-gray-50 text-gray-700">
                        {sampleQuestionsJSON}
                      </pre>
                    </ScrollArea>
                    <div className="p-3 border-t bg-gray-50">
                      <div className="flex items-start gap-2">
                        <FileJson className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-gray-600">
                          <p className="font-medium">
                            JSON Format Requirements:
                          </p>
                          <ul className="mt-1 space-y-0.5">
                            <li>• Must be an array of question objects</li>
                            <li>
                              • Required fields: questionText, questionType,
                              difficulty, options
                            </li>
                            <li>
                              • Options array must have at least one correct
                              answer
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Input Area */}
              <div className="space-y-3 ">
                <Label className="text-sm font-medium">Your Questions</Label>

                {/* Drag & Drop Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? "Drop the JSON file here"
                      : "Drag & drop a JSON file, or click to select"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Only .json files are accepted
                  </p>
                </div>

                {/* JSON Textarea */}
                <Textarea
                  id="json"
                  placeholder="Or paste your JSON here..."
                  className="font-mono text-sm overflow-y-auto h-[178px]"
                  value={jsonInput}
                  onChange={(e) => handleJsonChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Questions Preview - Visible only when there are parsed questions */}
          {parsedQuestions.length > 0 && (
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <Label>
                  Questions Preview ({parsedQuestions.length} found)
                </Label>
                <Badge variant="outline" className="font-normal">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Ready to import
                </Badge>
              </div>

              <ScrollArea className="h-[500px] border rounded-lg">
                <div className="p-4 space-y-6">
                  {parsedQuestions.map((question, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-sm">
                            Question {index + 1}
                          </span>
                          {renderQuestionTypeBadge(question.questionType)}
                          {renderDifficultyBadge(question.difficulty)}
                          <Badge variant="outline" className="font-normal">
                            <Award className="h-3 w-3 mr-1" />
                            {question.points || 1} point
                            {question.points !== 1 ? "s" : ""}
                          </Badge>
                          {question.status &&
                            renderStatusBadge(question.status)}
                        </div>
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {question.tags.slice(0, 2).join(", ")}
                              {question.tags.length > 2 && "..."}
                            </span>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4 space-y-4">
                        {/* Question Text */}
                        <div>
                          <div className="flex items-start gap-2 mb-1">
                            <HelpCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {question.questionText}
                              </p>
                              {question.explanation && (
                                <p className="text-sm text-gray-600 mt-2">
                                  <span className="font-medium">
                                    Explanation:
                                  </span>{" "}
                                  {question.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Options */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <ListChecks className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-sm">Options</span>
                          </div>
                          <div className="space-y-2 pl-6">
                            {question.options.map(
                              (option: any, optIndex: number) => (
                                <div
                                  key={optIndex}
                                  className={`flex items-start gap-3 p-2 rounded border ${
                                    option.isCorrect
                                      ? "border-green-200 bg-green-50"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                                      option.isCorrect
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  >
                                    {option.isCorrect ? (
                                      <Check className="h-3 w-3 text-white" />
                                    ) : (
                                      <XIcon className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm">{option.text}</p>
                                    {option.isCorrect && (
                                      <Badge className="mt-1 bg-green-100 text-green-800 text-xs font-normal">
                                        Correct Answer
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Hints (if any) */}
                        {question.hints && question.hints.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-sm">Hints</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-6">
                              {question.hints.map(
                                (hint: string, hintIndex: number) => (
                                  <Badge
                                    key={hintIndex}
                                    variant="outline"
                                    className="font-normal text-xs"
                                  >
                                    {hint}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="space-y-3">
              <Label className="text-amber-600">Validation Errors</Label>
              <Card className="border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">
                      {validationErrors.length} error(s) found
                    </span>
                  </div>
                  <ScrollArea className="h-[150px]">
                    <div className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <X className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{error}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500">
              {parsedQuestions.length > 0 ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>
                    {parsedQuestions.length} valid question
                    {parsedQuestions.length !== 1 ? "s" : ""} ready to import
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                  <span>No valid questions found yet</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onClose(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !selectedTopicId ||
                  parsedQuestions.length === 0 ||
                  validationErrors.length > 0
                }
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin mr-2" />
                    Importing...
                  </>
                ) : (
                  `Import ${parsedQuestions.length} Question${
                    parsedQuestions.length !== 1 ? "s" : ""
                  }`
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionBulkImportForm;
