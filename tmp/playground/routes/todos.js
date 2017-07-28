module.exports = app => {
    const router = app.server.Router();

    router

        .get('/',
            app.actions.Todos.list.expose()
        )

        .get('/:id',
            app.actions.Todos.show.expose()
        )

        .get('/search',
            app.actions.Todos.search.expose()
        )

        .get('/count',
            app.actions.Todos.count.expose()
        )

        .post('/',
            app.actions.Todos.create.expose()
        )

        .put('/',
            app.actions.Todos.update.expose()
        )

        .delete('/',
            app.actions.Todos.remove.expose()
        );

    app.server.use(/'Todos, router);
};