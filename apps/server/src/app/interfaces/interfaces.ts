import { Transaction } from "sequelize";
import { Request, Response } from 'express';

export interface SessionData
{
    req: Request,
    res: Response,
    transaction: Transaction,
    json: Record<string,any>
}


export type RequestTransaction = Request & { transaction: Transaction };