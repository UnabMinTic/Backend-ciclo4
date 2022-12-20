// 1. Importar express
import Express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors'

const stringConexion = 'mongodb+srv://farboleda:FArb0l3d4M0ng0*@clusterproyectobarcos.8ycogbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const client = new MongoClient(stringConexion, {
   useNewUrlParser: true,
   useUnifiedTopology: true
})


let conexion;

// 2. Servidor
const app = Express();

app.use(Express.json());
app.use(cors({ origin: true }));

// 3. ---------- Agregar ruta: GET ----------
// 1er: ruta, 2do: función (collback) que se ejecuta al solicitar la ruta
app.get('/barcos', (req, res) => {
   // 4. Mensaje para el servidor
   console.log("Alguien hizo get en la ruta /barcos");

   conexion.collection('barcos').find({}).limit(50).toArray((err, result) => {
      if (err) {
         res.status(500).send('Error consultando los barcos');
      } else {
         res.json(result);
      }
   })
});

// 7. ---------- Agregar ruta: POST ----------
app.post('/barcos/nuevo', cors(), (req, res, next) => {
   const datosBarco = req.body;
   console.log('Llaves: ', Object.keys(datosBarco));

   try {
      if (Object.keys(datosBarco).includes('serie') &&
         Object.keys(datosBarco).includes('nombre') &&
         Object.keys(datosBarco).includes('marca') &&
         Object.keys(datosBarco).includes('modelo')
      ) {
         //Implementar código para crear barco en la BD
         conexion.collection('barcos').insertOne(datosBarco, (err, result) => {
            if (err) {
               console.error(error);
               res.sendStatus(500);
            } else {
               console.error(result);
               res.sendStatus(200);
            }
         })

         /* res.sendStatus(200); */
      } else {
         res.sendStatus(500);
      }
   } catch {
      res.sendStatus(500);
   }
})

const main = () => {

   client.connect((err, db) => {
      if (err) {
         console.error('Error conectando a la BD');
      }
      conexion = db.db('barcosdb');
      console.log('Conexión exitosa');
      return app.listen(5000, () => {
         console.log("Escuchando puerto 5000");
      })
   })

}

main();