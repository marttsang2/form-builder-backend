import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormResponseDto } from './dto/create-form-response.dto';

@Injectable()
export class FormResponsesService {
  constructor(private prisma: PrismaService) {}

  async create(createFormResponseDto: CreateFormResponseDto) {
    const form = await this.prisma.form.findUnique({
      where: { id: createFormResponseDto.formId },
    });

    if (!form) {
      throw new NotFoundException(
        `Form with ID "${createFormResponseDto.formId}" not found`,
      );
    }

    if (form.locked) {
      throw new Error(
        `Form with ID "${createFormResponseDto.formId}" is locked and cannot accept new responses.`,
      );
    }

    return this.prisma.response.create({
      data: {
        formId: createFormResponseDto.formId,
        values: {
          create: createFormResponseDto.answers.map((answer) => ({
            questionId: answer.questionId,
            value: answer.value,
          })),
        },
      },
      include: {
        values: true,
      },
    });
  }

  async findAllByForm(formId: string) {
    return this.prisma.response.findMany({
      where: {
        formId,
      },
      include: {
        values: true,
      },
    });
  }

  async findAllByFormPaginated(
    formId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const responses = await this.prisma.response.findMany({
      where: {
        formId,
      },
      skip,
      take: limit,
      include: {
        values: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get the total count for pagination metadata
    const totalItems = await this.prisma.response.count({
      where: {
        formId,
      },
    });

    return {
      data: responses,
      metadata: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.response.findUnique({
      where: {
        id,
      },
      include: {
        values: true,
      },
    });
  }

  async countOptionsForAllQuestions(formId: string) {
    // Verify the form exists
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
      include: { questions: true },
    });

    if (!form) {
      throw new NotFoundException(`Form with ID "${formId}" not found`);
    }

    // For each question, get all response values and count options
    const results = await Promise.all(
      form.questions.map(async (question) => {
        const responseValues = await this.prisma.formResponseValue.findMany({
          where: {
            questionId: question.id,
            response: {
              formId,
            },
          },
          select: {
            value: true,
          },
        });

        // Count occurrences of each option
        const optionCounts = responseValues.reduce((counts, { value }) => {
          counts[value] = (counts[value] || 0) + 1;
          return counts;
        }, {});

        return {
          questionId: question.id,
          label: question.label,
          type: question.type,
          counts: optionCounts,
        };
      }),
    );

    return {
      formId,
      questionCounts: results,
    };
  }
}
