module.exports = (err, req, res, next)=>{
    return res.status(err.status || 500).json({
        message : err.message || 'OOPS ! something went wrong',
    });
}