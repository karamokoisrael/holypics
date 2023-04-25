export type DirectusError =  {
    errors: Array<DirectusException>
}

export type DirectusException = {
    message: string,
    extensions: {
        code: string
    },
    handled?: boolean
}

export type DirectusBaseException = {
    message: string,
    status: number,
    code: string,
    extensions: Record<string, any>
}

