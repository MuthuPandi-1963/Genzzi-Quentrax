import { PartialType } from "@nestjs/mapped-types";
import { CreateQuizHistoryDto } from "./create-quiz-history.dto";

export class UpdateQuizHistoryDto extends PartialType(CreateQuizHistoryDto) {}
