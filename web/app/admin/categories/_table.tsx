/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit, Trash2, Layers, ImageOff } from "lucide-react";
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
import CategoryView from "./_view";
import type { Category } from "@/@types";

// ─────────────────────────────────────────────────────────────────────────────

interface CategoryTableProps {
  filteredCategories: Category[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  handleEdit: (category: Category) => void;
  handleDelete: (id: string) => void;
}



// ─────────────────────────────────────────────────────────────────────────────

export default function CategoryTable({
  filteredCategories,
  searchTerm,
  setSearchTerm,
  handleEdit,
  handleDelete,
}: CategoryTableProps) {
  return (
    <Card className="border-(--glass-border)] bg-(--color-background-elevated)]">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-(--color-foreground)]">Categories</CardTitle>
            <CardDescription className="text-(--color-foreground-muted)]">
              Manage all top-level content categories
            </CardDescription>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--color-foreground-subtle)]" />
            <Input
              placeholder="Search categories…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input h-10 pl-9 text-sm"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border-t border-(--glass-border)] rounded-b-xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-160 max-h-120 overflow-y-auto">
              <Table>
                {/* ── Head ── */}
                <TableHeader>
                  <TableRow className="border-(--glass-border)] bg-(--color-background-overlay)] hover:bg-(--color-background-overlay)]">
                    <TableHead className="w-12 text-center text-(--color-foreground-subtle)] font-semibold">
                      #
                    </TableHead>
                    <TableHead className="w-14 text-(--color-foreground-subtle)] font-semibold">
                      Image
                    </TableHead>
                    <TableHead className="text-(--color-foreground-subtle)] font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="text-(--color-foreground-subtle)] font-semibold">
                      Description
                    </TableHead>
                    <TableHead className="text-(--color-foreground-subtle)] font-semibold">
                      Topics
                    </TableHead>
                    <TableHead className="text-(--color-foreground-subtle)] font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-(--color-foreground-subtle)] font-semibold">
                      Created
                    </TableHead>
                    <TableHead className="text-(--color-foreground-subtle)] font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                {/* ── Body ── */}
                <TableBody>
                  <AnimatePresence>
                    {filteredCategories.map((cat, idx) => (
                      <motion.tr
                        key={cat.id}
                        custom={idx}
                        // variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="border-(--glass-border)] transition-colors duration-150
                          hover:bg-[hsl(263_70%_58%/0.05)]"
                      >
                        {/* Serial */}
                        <TableCell className="text-center font-medium text-(--color-foreground-subtle)] text-sm">
                          {idx + 1}
                        </TableCell>

                        {/* Thumbnail */}
                        <TableCell>
                          <div className="h-10 w-10 rounded-lg overflow-hidden border border-(--glass-border)]
                            bg-(--color-background-sunken)] flex items-center justify-center shrink-0">
                            {cat.imageUrl ? (
                              <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                }}
                              />
                            ) : null}
                            <ImageOff
                              className={`h-4 w-4 text-(--color-foreground-subtle)] ${cat.imageUrl ? "hidden" : ""}`}
                            />
                          </div>
                        </TableCell>

                        {/* Name */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-[hsl(263_70%_68%)] shrink-0" />
                            <span className="font-semibold text-(--color-foreground)] text-sm">
                              {cat.name}
                            </span>
                          </div>
                        </TableCell>

                        {/* Description */}
                        <TableCell>
                          <p className="text-sm text-(--color-foreground-muted)] max-w-50 truncate">
                            {cat.description || <span className="text-(--color-foreground-subtle)] italic">No description</span>}
                          </p>
                        </TableCell>

                        {/* Topics count */}
                        <TableCell>
                          <Badge
                            className="font-semibold text-xs
                              bg-[hsl(263_70%_58%/0.12)] text-[hsl(263_70%_78%)]
                              border border-[hsl(263_70%_58%/0.3)]"
                          >
                            {cat.topics?.length ?? 0} topics
                          </Badge>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          {cat.deletedAt ? (
                            <Badge className="bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_84%_70%)] border border-[hsl(0_84%_60%/0.3)] text-xs">
                              Archived
                            </Badge>
                          ) : (
                            <Badge className="bg-[hsl(142_76%_45%/0.12)] text-[hsl(142_76%_65%)] border border-[hsl(142_76%_45%/0.3)] text-xs">
                              Active
                            </Badge>
                          )}
                        </TableCell>

                        {/* Created */}
                        <TableCell className="text-sm text-(--color-foreground-muted)] whitespace-nowrap">
                          {new Date(cat.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <CategoryView category={cat} />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(cat)}
                              className="h-8 w-8 p-0 border-(--glass-border)]
                                hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)]
                                transition-all duration-200"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(cat.id)}
                              className="h-8 w-8 p-0 border-(--glass-border)]
                                hover:border-[hsl(0_84%_60%/0.4)] hover:text-(--color-error)]
                                transition-all duration-200"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Empty state */}
          {filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-3 py-16
                text-(--color-foreground-subtle)]"
            >
              <div className="p-4 rounded-2xl bg-[hsl(263_70%_58%/0.08)] border border-[hsl(263_70%_58%/0.15)]">
                <Layers className="h-8 w-8 text-[hsl(263_70%_58%/0.5)]" />
              </div>
              <p className="text-sm font-medium">
                {searchTerm ? "No categories match your search" : "No categories yet"}
              </p>
              {searchTerm && (
                <p className="text-xs text-(--color-foreground-subtle)]">
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