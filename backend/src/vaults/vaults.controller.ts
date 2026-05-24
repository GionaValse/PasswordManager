import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.types';
import { PasswordResponseDto } from 'src/passwords/passwords.dto';
import { PasswordsService } from 'src/passwords/passwords.service';
import { VaultCreateDto, VaultResponseDto, VaultUpdateDto } from './vaults.dto';
import { VaultsService } from './vaults.service';

@ApiTags('Vaults')
@ApiBearerAuth()
@Controller('vaults')
@UseGuards(AuthGuard)
export class VaultsController {
  constructor(
    private readonly vaultsService: VaultsService,
    private readonly passwordsService: PasswordsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vault' })
  @ApiResponse({ status: 201, type: VaultResponseDto })
  async createOne(
    @Body() vault: VaultCreateDto,
    @GetUser() user: JwtPayload,
  ): Promise<VaultResponseDto> {
    return this.vaultsService.createOne(vault, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all user vaults' })
  @ApiResponse({ status: 200, type: [VaultResponseDto] })
  async findAll(@GetUser() user: JwtPayload): Promise<VaultResponseDto[]> {
    return this.vaultsService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return a single vault by ID' })
  @ApiParam({ name: 'id', description: 'Vault UUID' })
  @ApiResponse({ status: 200, type: VaultResponseDto })
  async findOne(@Param('id') id: string, @GetUser() user: JwtPayload): Promise<VaultResponseDto> {
    return this.vaultsService.findOneWithUser(id, user.sub);
  }

  @Get(':vaultId/passwords')
  @ApiOperation({
    summary: 'Returns all passwords contained in a specific vault',
  })
  @ApiParam({ name: 'vaultId', description: 'Vault UUID' })
  @ApiResponse({ status: 200, type: [PasswordResponseDto] })
  async findVaultPasswords(
    @Param('vaultId') vaultId: string,
    @GetUser() user: JwtPayload,
  ): Promise<PasswordResponseDto[]> {
    return this.passwordsService.findByVault(vaultId, user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing vault' })
  @ApiResponse({ status: 200, type: VaultResponseDto })
  async updateOne(
    @Param('id') id: string,
    @Body() vault: VaultUpdateDto,
    @GetUser() user: JwtPayload,
  ): Promise<VaultResponseDto> {
    return this.vaultsService.updateOne(id, user.sub, vault);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a vault and its contents',
  })
  @ApiResponse({
    status: 200,
    description: 'Vault successfully deleted',
    type: VaultResponseDto,
  })
  async deleteOne(@Param('id') id: string, @GetUser() user: JwtPayload): Promise<VaultResponseDto> {
    return this.vaultsService.deleteOne(id, user.sub);
  }
}
