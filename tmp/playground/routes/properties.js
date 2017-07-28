module.exports = app => {
    const router = app.server.Router();

    router

        .get('/',
            app.actions.properties.list.expose()
        )

        .get('/:id',
            app.actions.properties.show.expose()
        )

        .get('/search',
            app.actions.properties.search.expose()
        )

        .get('/count',
            app.actions.properties.count.expose()
        )

        .post('/',
            app.actions.properties.create.expose()
        )

        .put('/',
            app.actions.properties.update.expose()
        )

        .delete('/',
            app.actions.properties.remove.expose()
        );

    app.server.use(/'properties, router);
};