module.exports = function (req, res, next) {
    res.sendError = function(msg, data){
        var obj = Object.assign({error :msg}, data);
        res.status(400).send(obj);
        
    }
    next();
}