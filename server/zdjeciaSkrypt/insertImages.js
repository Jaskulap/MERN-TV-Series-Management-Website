const fs = require('fs');
const { MongoClient } = require('mongodb');
const { Serial, validate } = require('../models/serial');

async function insertImagesToMongoDB() {
  const client = new MongoClient('mongodb+srv://jaskulap:haselko@pablo.ggkam8u.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const db = client.db('test');
    const collection = db.collection('serials');

    const imagePanelPath = './suits1.jpg'; // Ścieżka do obrazka dla imagePanel
    const imageMainPath = './suits2.jpg'; // Ścieżka do obrazka dla imageMain

    const imagePanelBuffer = fs.readFileSync(imagePanelPath); // Odczytaj obrazek jako dane binarne (Buffer)
    const imageMainBuffer = fs.readFileSync(imageMainPath); // Odczytaj obrazek jako dane binarne (Buffer)

    const imagePanelBase64 = imagePanelBuffer.toString('base64'); // Konwersja na łańcuch znaków w formacie base64
    const imageMainBase64 = imageMainBuffer.toString('base64'); // Konwersja na łańcuch znaków w formacie base64

    const serialData = {
      title: 'Suits',
      description: 'Opis serialu',
      imdb: 7.5,
      tag: 'anime',
      averageMinutes: 20,
      //imagePanel: imagePanelBase64,
      //imageMain: imageMainBase64,
      episodes: [
        {
          episodeTitle: 'Episode 1'
        },
        {
          episodeTitle: 'Episode 2'
        },
        {
          episodeTitle: 'Episode 3'
        },
        {
          episodeTitle: 'Episode 4'
        }
      ]
    };

    //const validationResult = validate(serialData);

    if (validationResult.error) {
      console.log('Nowo wstawiony dokument nie spełnia warunków walidacji:');
      console.log(validationResult.error);
      // Dodaj odpowiednie działania, gdy dokument nie spełnia warunków walidacji
    } else {
      await collection.insertOne(serialData);
      console.log('Nowo wstawiony dokument został zapisany w bazie danych.');
      // Dodaj odpowiednie działania, gdy dokument spełnia warunki walidacji
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas wstawiania obrazków:', error);
  } finally {
    client.close();
  }
}

insertImagesToMongoDB();
