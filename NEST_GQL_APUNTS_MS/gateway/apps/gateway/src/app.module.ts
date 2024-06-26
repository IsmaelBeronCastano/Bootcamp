import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { authContext } from './auth.context';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: authContext
      },
      gateway:{
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name:'users',
              url: 'http://localhost:3001/graphql'
            },
            {
              name:'posts',
              url: 'http://localhost:3002/graphql'
            }
          ]
        }),
        buildService({url}){
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({request, context}){
              request.http.headers.set(
                'user', //setearemos un nuevo user
                context.user? JSON.stringify(context.user): null
              )
            }
          })
        }
      }


    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
