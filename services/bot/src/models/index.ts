import { DynamoDB } from 'aws-sdk';
import { dynamodb } from '../index';

/**
 * @file Mandatory index file for mongoose models.
 * @author Ava Thorn
 */
export class Document {
    public static async get (table_name: string, query: Object): Promise<Object> {
        const data = await dynamodb.getItem({
            'TableName': table_name,
            'Key': DynamoDB.Converter.marshall(query)
        }).promise();

        if (data.Item !== undefined) {
            return DynamoDB.Converter.unmarshall(data.Item);
        } else {
            throw data;
        }
    }
    public static async scan (table_name: string, query: Object): Promise<Object> {
        const data = await dynamodb.scan({
            'TableName': table_name,
            'Key': DynamoDB.Converter.marshall(query)
        }).promise();

        if (data.Item !== undefined) {
            return DynamoDB.Converter.unmarshall(data.Item);
        } else {
            throw data;
        }
    }
}