import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./modules/app/app.module"
import * as cookieParser from "cookie-parser"

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: true, credentials: true }
  })
  app.use(cookieParser())

  const options = new DocumentBuilder()
    .setTitle(AppModule.apiTitle)
    .setDescription(AppModule.apiDescription)
    .setVersion(AppModule.apiVersion)
    .addSecurity("bearer", { type: "http", scheme: "bearer" })
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options, {
    include: []
  })
  SwaggerModule.setup("api", app, document)

  console.log("Baconlist running on PORT:", AppModule.port)
  await app.listen(AppModule.port)
}

void bootstrap()
