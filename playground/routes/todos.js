module.exports = app => {
    const router = app.server.Router();

    router

        .get('/',
            app.actions.todos.list.expose()
        )

        .get('/:id',
            app.actions.todos.show.expose()
        )

        .get('/search',
            app.actions.todos.search.expose()
        )

        .get('/count',
            app.actions.todos.count.expose()
        )

        .post('/',
            app.actions.todos.create.expose()
        )

        .put('/',
            app.actions.todos.update.expose()
        )

        .delete('/',
            app.actions.todos.remove.expose()
        );

    app.server.use('models', router);
};