module.exports = app => {
    const router = app.server.Router();

    router

        .get('/',
            app.actions.suces.list.expose()
        )

        .get('/:id',
            app.actions.suces.show.expose()
        )

        .get('/search',
            app.actions.suces.search.expose()
        )

        .get('/count',
            app.actions.suces.count.expose()
        )

        .post('/',
            app.actions.suces.create.expose()
        )

        .put('/',
            app.actions.suces.update.expose()
        )

        .delete('/',
            app.actions.suces.remove.expose()
        );

    app.server.use(/'suces, router);
};