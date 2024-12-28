class SQLInsert 
{
    private tableName: string;
    private valuesData: Record<string, any>[] = [];

    constructor(tableName: string) 
    {
        this.tableName = tableName;
    }

    values(data: Record<string, any>[]): { query: string; parameters: Record<string, any> } 
    {
        if (data.length === 0) {
            throw new Error('Sin valores');
        }

        this.valuesData = data;
        const columns = Object.keys(data[0]);
        const placeholders: string[] = [];
        const parameters: Record<string, any> = {};

        data.forEach((row, i) => {
            const rowPlaceholders: string[] = [];
            for (const column of columns) {
                const paramName = `${column}_${i + 1}`;
                rowPlaceholders.push(`:${paramName}`);
                parameters[paramName] = row[column];
            }
            placeholders.push(`(${rowPlaceholders.join(', ')})`);
        });

        const query = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES ${placeholders.join(', ')}`.trim();

        return {
            query,
            parameters,
        };
    }
}


class SQLUpdate 
{
    private tableName: string;
    private valuesData: Record<string, any> = {};
    private whereData: Record<string, any> = {};

    constructor(tableName: string) 
    {
        this.tableName = tableName;
    }

    set(data: Record<string, any>): SQLUpdate 
    {
        this.valuesData = data;
        return this;
    }

    where(conditions: Record<string, any>)
    {
        this.whereData = conditions;
        return this.build();
    }

    private build(): { query: string; parameters: Record<string, any> } 
    {
        if (Object.keys(this.valuesData).length === 0) {
            throw new Error('Sin valores para actualizar');
        }

        const setClauses: string[] = [];
        const whereClauses: string[] = [];
        const parameters: Record<string, any> = {};

        // Procesar los valores del SET
        Object.entries(this.valuesData).forEach(([column, value]) => {
            const paramName = `set_${column}`;
            setClauses.push(`${column} = :${paramName}`);
            parameters[paramName] = value;
        });

        // Procesar las condiciones del WHERE
        Object.entries(this.whereData).forEach(([column, value]) => {
            const paramName = `where_${column}`;
            whereClauses.push(`${column} = :${paramName}`);
            parameters[paramName] = value;
        });

        const query = `
            UPDATE ${this.tableName}
            SET ${setClauses.join(', ')}
            ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''}
        `.trim();

        return {
            query,
            parameters,
        };
    }
}


class SQLDelete 
{
    private tableName: string;
    private whereData: Record<string, any> = {};

    constructor(tableName: string) 
    {
        this.tableName = tableName;
    }


    where(conditions: Record<string, any>)
    {
        this.whereData = conditions;
        return this.build();
    }


    private build(): { query: string; parameters: Record<string, any> } 
    {
        if (Object.keys(this.whereData).length === 0) {
            throw new Error('No se especificaron condiciones para el DELETE');
        }

        const whereClauses: string[] = [];
        const parameters: Record<string, any> = {};

        // Procesar las condiciones del WHERE
        Object.entries(this.whereData).forEach(([column, value]) => {
            const paramName = `where_${column}`;
            whereClauses.push(`${column} = :${paramName}`);
            parameters[paramName] = value;
        });

        const query = `
            DELETE FROM ${this.tableName}
            WHERE ${whereClauses.join(' AND ')}
        `.trim();

        return {
            query,
            parameters,
        };
    }
}


export class SQLBuilder 
{


    static insert(tableName: string): SQLInsert 
    {
        return new SQLInsert(tableName);
    }


    static update(tableName: string): SQLUpdate 
    {
        return new SQLUpdate(tableName);
    }


    static delete(tableName: string): SQLDelete 
    {
        return new SQLDelete(tableName);
    }
}
