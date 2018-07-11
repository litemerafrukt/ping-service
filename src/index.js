/***********************************************
 * Functionality
 */
const { probe } = require("ping").promise;

const ping = (host, times) => Promise.all(Array.from({ length: times }, () => probe(host, {})));

/***********************************************
 * Server
 */
const app = require("express")();
const cors = require("cors");
const config = require("../config");

app.use(cors());

app.get("/", (_, res) => {
    res.send("bah!");
});

app.get("/:host/:times?", (req, res) => {
    const { host, times = 31 } = req.params;

    ping(host, times)
        .then(results => {
            const { alive, numeric_host: numericHost } = results[0];

            return {
                host,
                numericHost,
                alive,
                times: alive ? results.map(p => p.time) : []
            };
        })
        .then(result => res.json(result))
        .catch(error => res.json({ error }));
});

app.listen(config.port, () => {
    console.log(`Ping-service listening on port ${config.port} (CORS-enabled)`);
});
