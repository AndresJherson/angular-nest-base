export class ErrorModel extends Error
{
    public messages: string[] = [];

    constructor( message: string, previousError?: unknown ) 
    {
        super( message );
        this.name = "ErrorModel";
        
        if ( previousError instanceof ErrorModel ) {
            this.messages.push(...previousError.messages);
        }

        this.messages.push( message );

    }

    getAllMessages(): string {
        return `\n-> ${this.messages.join("\n-> ")}`;
    }
}