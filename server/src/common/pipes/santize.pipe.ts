import { Injectable, PipeTransform, ArgumentMetadata } from "@nestjs/common";
import sanitizeHtml from "sanitize-html";

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;

    if (typeof value === "string") {
      return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
      }).trim();
    }

    if (typeof value === "object") {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private sanitizeObject(obj: any): any {
    // ✅ String check MUST come before array check
    if (typeof obj === "string") {
      return sanitizeHtml(obj, {
        allowedTags: [],
        allowedAttributes: {},
      }).trim();
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item)); // now safely recurses into string check above
    }

    if (obj === null || typeof obj !== "object") {
      return obj; // numbers, booleans, null — untouched
    }

    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = this.sanitizeObject(obj[key]); // unified recursion
    }

    return sanitized;
  }
}
