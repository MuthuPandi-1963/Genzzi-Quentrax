/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Search, Edit, Trash2, BookOpen, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TopicView from "./_view";
import type { Topic } from "@/@types";
import { Difficulty } from "@/@types/enums";

// ─────────────────────────────────────────────────────────────────────────────

interface TopicTableProps {
  filteredTopics: Topic[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  handleEdit: (topic: Topic) => void;
  handleDelete: (id: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: "easeOut" },
  }),
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
} as Variants;

// ─────────────────────────────────────────────────────────────────────────────

export default function TopicTable({
  filteredTopics,
  searchTerm,
  setSearchTerm,
  handleEdit,
  handleDelete,
}: TopicTableProps) {
  type DifficultyConfig = {
  color: string;
  bg: string;
  label: string;
};

const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.EASY]: {
    color: "hsl(142 76% 45%)",
    bg: "hsl(142 76% 45% / 0.12)",
    label: "Beginner",
  },
  [Difficulty.MEDIUM]: {
    color: "hsl(217 90% 60%)",
    bg: "hsl(217 90% 60% / 0.12)",
    label: "Intermediate",
  },
  [Difficulty.HARD]: {
    color: "hsl(330 80% 55%)",
    bg: "hsl(330 80% 55% / 0.12)",
    label: "Advanced",
  },
};

  return (
    <Card className="border-(--glass-border) bg-(--color-background-elevated)">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-(--color-foreground)">Topics</CardTitle>
            <CardDescription className="text-(--color-foreground-muted)">
              Manage all learning topics and content
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <Input
              placeholder="Search topics…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input h-10 pl-9 text-sm"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border-t border-(--glass-border) rounded-b-xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-3xl max-h-120 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-(--glass-border) bg-background-overlay hover:bg-background-overlay">
                    <TableHead className="w-12 text-center text-foreground-subtle font-semibold">#</TableHead>
                    <TableHead className="w-14 text-foreground-subtle font-semibold">Image</TableHead>
                    <TableHead className="text-color-foreground-subtle font-semibold">Name</TableHead>
                    <TableHead className="text-color-foreground-subtle font-semibold">Category</TableHead>
                    <TableHead className="text-color-foreground-subtle font-semibold">Difficulty</TableHead>
                    <TableHead className="text-color-foreground-subtle font-semibold">Tags</TableHead>
                    <TableHead className="text-color-foreground-subtle font-semibold">Status</TableHead>
                    <TableHead className="text-color-foreground-subtle font-semibold">Created</TableHead>
                    <TableHead className="text-color-foreground-subtle font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <AnimatePresence>
                    {filteredTopics.map((topic, idx) => {
                      const diff = difficultyConfig[topic.difficulty] ?? difficultyConfig.EASY;
                      return (
                        <motion.tr
                          key={topic.id}
                          custom={idx}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="border-(--glass-border) transition-colors duration-150 hover:bg-[hsl(263_70%_58%/0.05)]"
                        >
                          <TableCell className="text-center font-medium text-foreground-subtle text-sm">
                            {idx + 1}
                          </TableCell>

                          <TableCell>
                            <div className="h-10 w-10 rounded-lg overflow-hidden border border-(--glass-border) bg-background-sunken flex items-center justify-center shrink-0">
                              {topic.imageUrl ? (
                                <img
                                  src={topic.imageUrl}
                                  alt={topic.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                  }}
                                />
                              ) : null}
                              <ImageOff className={`h-4 w-4 text-foreground-subtle ${topic.imageUrl ? "hidden" : ""}`} />
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-[hsl(263_70%_68%)] shrink-0" />
                              <span className="font-semibold text-(--color-foreground) text-sm">
                                {topic.name}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="text-sm text-(--color-foreground-muted)">
                              {topic.category?.name ?? <span className="text-foreground-subtle italic">No category</span>}
                            </span>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className="font-semibold text-xs border"
                              style={{
                                background: diff.bg,
                                color: diff.color,
                                borderColor: `${diff.color}40`,
                              }}
                            >
                              {diff.label}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-32">
                              {topic.tags?.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-[10px] bg-[hsl(263_70%_58%/0.08)] text-[hsl(263_70%_68%)] border-[hsl(263_70%_58%/0.2)]"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {topic.tags && topic.tags.length > 2 && (
                                <Badge variant="outline" className="text-[10px] bg-[hsl(263_70%_58%/0.08)] text-[hsl(263_70%_68%)] border-[hsl(263_70%_58%/0.2)]">
                                  +{topic.tags.length - 2}
                                </Badge>
                              )}
                              {!topic.tags?.length && (
                                <span className="text-xs text-foreground-subtle italic">No tags</span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            {topic.deletedAt ? (
                              <Badge className="bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_84%_70%)] border border-[hsl(0_84%_60%/0.3)] text-xs">
                                Archived
                              </Badge>
                            ) : (
                              <Badge className="bg-[hsl(142_76%_45%/0.12)] text-[hsl(142_76%_65%)] border border-[hsl(142_76%_45%/0.3)] text-xs">
                                Active
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-sm text-(--color-foreground-muted) whitespace-nowrap">
                            {new Date(topic.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <TopicView topic={topic} />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(topic)}
                                className="h-8 w-8 p-0 border-(--glass-border) hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)] transition-all duration-200"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(topic.id)}
                                className="h-8 w-8 p-0 border-(--glass-border) hover:border-[hsl(0_84%_60%/0.4)] hover:text-(--color-error) transition-all duration-200"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>

          {filteredTopics.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-3 py-16 text-foreground-subtle"
            >
              <div className="p-4 rounded-2xl bg-[hsl(263_70%_58%/0.08)] border border-[hsl(263_70%_58%/0.15)]">
                <BookOpen className="h-8 w-8 text-[hsl(263_70%_58%/0.5)]" />
              </div>
              <p className="text-sm font-medium">
                {searchTerm ? "No topics match your search" : "No topics yet"}
              </p>
              {searchTerm && (
                <p className="text-xs text-foreground-subtle">
                  Try a different keyword
                </p>
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}