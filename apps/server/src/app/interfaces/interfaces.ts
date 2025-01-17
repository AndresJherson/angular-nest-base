import { Transaction } from "sequelize";
import { Request, Response } from 'express';
import { Usuario } from "@app/models";

export interface SessionData
{
    req: Request,
    res: Response,
    service: string,
    method: string,
    json: Record<string,any>
    usuario: Usuario,
    transaction: Transaction,
}


export type RequestTransaction = Request & { transaction: Transaction, usuario: Usuario };