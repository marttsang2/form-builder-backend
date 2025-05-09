import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FormResponsesService } from '@/form-responses/form-responses.service';
import { CreateFormResponseDto } from '@/form-responses/dto/create-form-response.dto';

/**
 * Controller for managing form responses
 */
@Controller('form-responses')
export class FormResponsesController {
  constructor(private readonly formResponsesService: FormResponsesService) {}

  /**
   * Submit a new form response
   * @param createFormResponseDto The form response data with answers
   * @returns The created form response
   */
  @Post()
  create(@Body() createFormResponseDto: CreateFormResponseDto) {
    return this.formResponsesService.create(createFormResponseDto);
  }

  /**
   * Get all responses for a specific form
   * @param formId The UUID of the form
   * @returns Array of form responses
   */
  @Get('form/:formId')
  findAllByForm(@Param('formId') formId: string) {
    return this.formResponsesService.findAllByForm(formId);
  }

  /**
   * Get paginated responses for a specific form
   * @param formId The UUID of the form
   * @param page The page number (default: 1)
   * @param limit The number of items per page (default: 10)
   * @returns Paginated form responses with metadata
   */
  @Get('form/:formId/paginated')
  findAllByFormPaginated(
    @Param('formId') formId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.formResponsesService.findAllByFormPaginated(
      formId,
      page,
      limit,
    );
  }

  /**
   * Count occurrences of each option for all questions in a form
   * @param formId The UUID of the form
   * @returns Counts of each option selected for all questions in the form
   */
  @Get('form/:formId/questions/counts')
  countOptionsForAllQuestions(@Param('formId') formId: string) {
    return this.formResponsesService.countOptionsForAllQuestions(formId);
  }

  /**
   * Get a specific form response by ID
   * @param id The UUID of the form response
   * @returns The form response
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formResponsesService.findOne(id);
  }
}
