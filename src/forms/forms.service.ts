import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateFormDto,
  QuestionType as DtoQuestionType,
  QuestionType,
} from '@/forms/dto/create-form.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async create(createFormDto: CreateFormDto) {
    const slug = this.generateSlug(createFormDto.title);

    // validate duplicate slug
    const existingForm = await this.prisma.form.findUnique({
      where: { slug },
    });
    if (existingForm) {
      throw new BadRequestException(
        'A form with this title already exists. Please use a different title.',
      );
    }

    return this.prisma.form.create({
      data: {
        title: createFormDto.title,
        description: createFormDto.description,
        slug: slug,
        locked: createFormDto.isLocked || false,
        questions: {
          create: createFormDto.questions.map((question) => {
            let prismaQuestionTypeMapped: QuestionType;
            switch (question.type) {
              case DtoQuestionType.TEXT:
                prismaQuestionTypeMapped = QuestionType.TEXT;
                break;
              case DtoQuestionType.DROPDOWN:
                prismaQuestionTypeMapped = QuestionType.DROPDOWN;
                break;
              case DtoQuestionType.FILE:
                prismaQuestionTypeMapped = QuestionType.FILE;
                break;
              default:
                // This case should ideally be caught by validation
                throw new Error(`Unsupported question type: ${question.type}`);
            }
            return {
              label: question.label,
              type: prismaQuestionTypeMapped,
              order: question.order,
              required: question.required,
              options: question.options,
            };
          }),
        },
      },
      include: {
        questions: true, // Include questions in the response
      },
    });
  }

  async findAll() {
    return this.prisma.form.findMany();
  }

  async search(keyword?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Build the where condition for search
    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }
      : {};

    // Get the forms for the current page
    const forms = await this.prisma.form.findMany({
      where,
      skip,
      take: limit,
      include: {
        questions: true,
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get the total count for pagination metadata
    const totalItems = await this.prisma.form.count({ where });

    return {
      data: forms,
      metadata: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.form.findUnique({
      where: {
        id,
      },
      include: {
        questions: true, // Also include questions when fetching a single form
      },
    });
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.question.deleteMany({
        where: {
          formId: id,
        },
      });

      await prisma.response.deleteMany({
        where: {
          formId: id,
        },
      });

      await prisma.form.delete({
        where: {
          id,
        },
      });
    });
  }

  private generateSlug(title: string) {
    return title.toLowerCase().replace(/ /g, '-');
  }
}
