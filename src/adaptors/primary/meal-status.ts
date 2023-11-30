import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2<any> = async (event, context) => {
    console.log('hello')
    return {
        message: 'hello'
    }
}