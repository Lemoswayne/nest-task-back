import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardService } from './board.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';

@ApiTags('boards')
@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  findAll(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.boardService.findAll(tokenPayload);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.boardService.findOne(id, tokenPayload);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.boardService.remove(id, tokenPayload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.boardService.update(id, updateBoardDto, tokenPayload);
  }
}
