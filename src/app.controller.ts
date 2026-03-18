import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(
    @Inject(AppService)
    private readonly appService: AppService,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('hello')
  // getHelloAgain(): string {
  //   return this.appService.getHelloAgain();
  // }
}
