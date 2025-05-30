import multer from 'multer';

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({
    storage,
    fileFilter,
});

export const uploadSingle = upload.single('image');          // For single file
export const uploadMultiple = upload.array('images', 10);