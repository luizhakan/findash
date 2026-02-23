import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResumoMensalQueryDto } from './dto/resumo-mensal-query.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumo-mensal')
  buscarResumoMensal(@Query() query: ResumoMensalQueryDto) {
    return this.dashboardService.buscarResumoMensal(query);
  }
}
