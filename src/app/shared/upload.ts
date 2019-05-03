export class Upload {
    id?: string
    file?: File
    progress?: number
    displayName: string
    dateAdded: string = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    fbUrl?: string
    sourceUrl: string
    carousel?: boolean
    
    constructor(file: File) {
        this.file = file
    }
}
