export const logger = (req, res, next) => {
    console.log(`\n<3O~ ${new Date().toISOString()} :: ${req.method} ${req.url}\n`);
    next();
};

