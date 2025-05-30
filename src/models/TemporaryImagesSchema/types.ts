export interface ITemporaryImages {
    images: [{
        data: Buffer,
        contentType: String
    }],
    uploadedAt: {
        type: Date,
        default: Date,
        expires: number,
    },
}