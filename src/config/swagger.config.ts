import { DocumentBuilder, SwaggerDocumentOptions, SwaggerCustomOptions } from '@nestjs/swagger';
import { SwaggerUiOptions } from '@nestjs/swagger/dist/interfaces/swagger-ui-options.interface';
import { WalletModule } from 'src/modules/wallet/wallet.module';
import { TransasctionModule } from 'src/modules/transaction/transaction.module';

export const documentConfig = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('API description')
    .build();

export const documentOptions: SwaggerDocumentOptions = {
    include: [
        WalletModule,
        TransasctionModule
    ],
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
}

export const setupOptions: SwaggerCustomOptions  = {
    customSiteTitle: 'Nest Example API',
}