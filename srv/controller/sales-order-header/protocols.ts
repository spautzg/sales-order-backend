import { SalesOrderHeader } from "@models/sales";

export interface CreationPayloadValidationResult {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>;
}