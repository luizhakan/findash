import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Findash API")
    .setDescription(
      "Documentacao da API de gerenciamento financeiro. Credencial: Bearer <usuario_id> ou cabecalho x-usuario-id. Rate limit global ativo (120 req/min por IP).",
    )
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "Token",
        description: "Use o valor do usuario_id como token Bearer no ambiente atual.",
      },
      "bearer",
    )
    .addSecurityRequirements("bearer")
    .addApiKey(
      {
        type: "apiKey",
        in: "header",
        name: "x-usuario-id",
        description: "Alternativa de credencial: informar o usuario_id diretamente.",
      },
      "x-usuario-id",
    )
    .addSecurityRequirements("x-usuario-id")
    .build();
  const swaggerDocumento = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, swaggerDocumento, {
    useGlobalPrefix: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const porta = process.env.PORTA_API ? Number(process.env.PORTA_API) : 3000;
  await app.listen(porta);
}

void bootstrap();
