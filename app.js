// importar un par de métodos del paquete mongodb para conectarnos a la base de datos
const { MongoClient, ServerApiVersion } = require("mongodb");

// Connection string: el string donde especificámos usuario:contraseña y URL de conexión 
const uri = "mongodb+srv://criadomanzaneque:MSNvQed7qIZgA387@cluster0.fl8rdre.mongodb.net/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

// función asíncrona
async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        // Una vez nos hemos conectado seleccionamos la base de datos 'sample_flix'
        const database = client.db("companiesDB");

        // El objeto database ahora guarda una referencia a la base de datos 'sample_flix'. Podemos usar el método collection para seleccionar la colección 'companies'
        const companies = database.collection("companies");

        // Order all the companies by their IPO price in a descending order.
        const query = {};

        // Objeto de opciones
        const options = {
            projection: {_id: 0, name: 1, "ipo.valuation_amount": 1},
            sort: {'ipo.valuation_amount': -1},
            limit: 10
        };

        // Ejecutar la consulta 
        const cursor = companies.find(query, options);
        // Print a message if no documents were found
        if ((await companies.countDocuments(query)) === 0) {
            console.log("No documents found!");
        }

        // Print returned documents
        // El for va a hacer iterar el cursor por todos los resultados de la query. Cuando consultamos una posición de este cursor lo que hacemos es materializar un documento en nuestra aplicación nodejs. 
        for await (const doc of cursor) {
            console.dir(doc);
        }

    // finally es una palabra reservada que significa finalmente. Este bloque de código se ejecuta SIEMPRE , tanto si se ha producido un error como si todo ha ido bien.
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
// ejetuamos la función y como es una función asíncrona, concatenamos la palabra reserva "catch" para capturar cualquier tipo de excepción que suelte nuestro código