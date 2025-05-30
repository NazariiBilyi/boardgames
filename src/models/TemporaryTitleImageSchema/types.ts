export interface ITemporaryTitleImage {
    data: Buffer,
    contentType: String,
    uploadedAt: {
        type: Date,
        default: Date,
        expires: number,
    },
}