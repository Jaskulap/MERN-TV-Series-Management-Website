const router = require("express").Router()
const { User, validate } = require("../models/user")
const { Serial } = require("../models/serial")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const tokenVerification = require("../middleware/tokenVerification");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body)
    if (error)
      return res.status(400).send({ message: error.details[0].message })
    const user = await User.findOne({ email: req.body.email })
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" })
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
      nick: req.body.nick,
      email: req.body.email,
      password: hashPassword,
      serials: [] // Utwórz nowego użytkownika bez żadnych dodanych seriali
    });

    await newUser.save();
    res.status(201).send({ message: "User created successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "routes/users.js/ Internal Server Error" })
  }
})

router.get("/", async (req, res) => {
  //pobranie wszystkich użytkowników z bd:
  User.find().exec()
    .then(async () => {
      const users = await User.find();
      //konfiguracja odpowiedzi res z przekazaniem listy użytkowników:
      res.status(200).send({ data: users, message: "Lista użytkowników" });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
})




router.get("/detail", tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "No such user" });
    }

    res.status(200).send({ data: user, message: "User data:" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.delete("/", tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return res.status(404).send({ message: "No such user" });
    }

    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post('/addSerial/:title', tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id
    const { title } = req.params;

    // Znajdź użytkownika po ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony.' });
    }
    // Sprawdź, czy serial już istnieje w tablicy serials użytkownika
    const existingSerial = user.serials.find((serial) => serial.title === title);
    if (existingSerial) {
      return res.status(400).json({ message: 'Serial już istnieje w tablicy serials użytkownika.' });
    }
    // Dodaj nowy serial do tablicy serials użytkownika
    user.serials.push({ title, watchedEpisodes: [] });
    // Zapisz zmiany w bazie danych
    await user.save();
    res.status(200).json({ message: 'Serial został dodany do tablicy serials użytkownika.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});

router.delete('/removeSerial/:title', tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const { title } = req.params;

    // Znajdź użytkownika po ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony.' });
    }

    // Sprawdź, czy serial istnieje w tablicy serials użytkownika
    const existingSerial = user.serials.find((serial) => serial.title === title);
    if (!existingSerial) {
      return res.status(400).json({ message: 'Serial nie istnieje w tablicy serials użytkownika.' });
    }

    // Usuń serial z tablicy serials użytkownika
    user.serials = user.serials.filter((serial) => serial.title !== title);

    // Zapisz zmiany w bazie danych
    await user.save();
    res.status(200).json({ message: 'Serial został usunięty z tablicy serials użytkownika.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});

router.get('/checkSerial/:title', tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const { title } = req.params;

    // Znajdź użytkownika po ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony.' });
    }
    // Sprawdź, czy serial jest dodany przez użytkownika
    const serial = user.serials.find((s) => s.title === title);
    if (!serial) {
      return res.status(200).json({ data: { isAdded: false, watchedEpisodes: [] } });
    }
    // Zwróć informacje o serialu i listę odcinków
    const isAdded = true;
    const watchedEpisodes = serial.watchedEpisodes;
    res.status(200).json({ data: { isAdded: true, watchedEpisodes } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});

router.get('/addedSerials', tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;

    // Znajdź użytkownika po ID
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony.' });
    }

    // Pobierz tytuły seriali z tablicy serials użytkownika
    const serialTitles = user.serials.map(serial => serial.title);

    // Pobierz wszystkie seriali o tytułach zawartych w tablicy serialTitles
    const watchedSerials = await Serial.find({ title: { $in: serialTitles } }).exec();

    res.status(200).json({ data: watchedSerials, message: 'Lista obejrzanych seriali' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});




router.post('/addEpisode/:title/:episodeNr', tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, episodeNr } = req.params;

    // Znajdź użytkownika po ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony.' });
    }

    // Sprawdź, czy serial istnieje w tablicy serials użytkownika
    const existingSerial = user.serials.find((serial) => serial.title === title);
    if (!existingSerial) {
      return res.status(400).json({ message: 'Serial nie istnieje w tablicy serials użytkownika.' });
    }

    // Sprawdź, czy odcinek już istnieje w tablicy watchedEpisodes danego serialu
    const isEpisodeExisting = existingSerial.watchedEpisodes.some((episode) => episode === parseInt(episodeNr));
    if (isEpisodeExisting) {
      return res.status(400).json({ message: 'Odcinek już istnieje w tablicy watchedEpisodes tego serialu.' });
    }

    // Dodaj nowy odcinek do tablicy watchedEpisodes serialu
    existingSerial.watchedEpisodes.push(parseInt(episodeNr));


    // Zapisz zmiany w bazie danych
    await user.save();
    console.log("DODANO ODCINEK " + episodeNr)
    res.status(200).json({ message: 'Odcinek został dodany do tablicy watchedEpisodes serialu.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});

router.delete('/removeEpisode/:title/:episodeNr', tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, episodeNr } = req.params;

    // Znajdź użytkownika po ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony.' });
    }

    // Sprawdź, czy serial istnieje w tablicy serials użytkownika
    const existingSerial = user.serials.find((serial) => serial.title === title);
    if (!existingSerial) {
      return res.status(400).json({ message: 'Serial nie istnieje w tablicy serials użytkownika.' });
    }

    // Sprawdź, czy odcinek istnieje w tablicy watchedEpisodes danego serialu
    const isEpisodeExisting = existingSerial.watchedEpisodes.some((episode) => episode === parseInt(episodeNr));
    if (!isEpisodeExisting) {
      return res.status(400).json({ message: 'Odcinek nie istnieje w tablicy watchedEpisodes tego serialu.' });
    }

    // Usuń odcinek z tablicy watchedEpisodes serialu
    existingSerial.watchedEpisodes = existingSerial.watchedEpisodes.filter((episode) => episode !== parseInt(episodeNr));

    // Zapisz zmiany w bazie danych
    await user.save();
    console.log("USUNIETO ODCINEK " + episodeNr)
    res.status(200).json({ message: 'Odcinek został usunięty z tablicy watchedEpisodes serialu.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});


router.get('/statistics', tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;

    // Znajdź użytkownika po ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony.' });
    }

    // Ilość dodanych seriali
    const totalSerials = user.serials.length; //OK

    // Ilość wszystkich odcinków z dodanych seriali
    let totalEpisodes = 0;
    for (const serialData of user.serials) {
      const serial = await Serial.findOne({ title: serialData.title }); // Znajdź serial na podstawie tytułu

      if (serial) {
        totalEpisodes += serial.episodes.length;
      }
    }


    // Ilość obejrzanych odcinków z dodanych seriali
    let totalWatchedEpisodes = 0;
    user.serials.forEach((serial) => {
      totalWatchedEpisodes += serial.watchedEpisodes.length;
    });

    // Czas spędzony na oglądaniu seriali (suma: obejrzany odcinek * średni czas odcinka serialu)
    let totalWatchTime = 0;
    for (const serialData of user.serials) {
      const serial = await Serial.findOne({ title: serialData.title }); // Znajdź serial na podstawie tytułu

      if (serial) {
        const averageMinutes = serial.averageMinutes;
        totalWatchTime += serialData.watchedEpisodes.length * averageMinutes;
      }
    }

    res.status(200).json({data:{
      totalSerials,
      totalEpisodes,
      totalWatchedEpisodes,
      totalWatchTime
    }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});

module.exports = router;