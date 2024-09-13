const categoriesController = require('../controllers/categoriesController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/categories/getAll', passport.authenticate('jwt', {session: false}), categoriesController.getAll);
    app.post('/api/categories/create', passport.authenticate('jwt', {session: false}) , upload.array('image', 1), categoriesController.create);
    app.put('/api/categories/updateWithImage', passport.authenticate('jwt', {session: false}) , upload.array('image', 1), categoriesController.updateWithImage);
    app.put('/api/categories/update', passport.authenticate('jwt', {session: false}) , categoriesController.update);
    app.delete('/api/categories/delete/:id', passport.authenticate('jwt', {session: false}), categoriesController.delete);

}