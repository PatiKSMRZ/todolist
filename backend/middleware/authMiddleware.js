const jwt = require('jsonwebtoken'); //import bilioteki jsonwebtoken - mozna generowac, weryfikowac i dekodowac tokeny

const JWT_TOKEN = 'tajny_klucz'; //ten sam klucz któreg uzywam przy logowaniu, podpisuje nim tokeny - w realnej appce trzyma sie to w pliku .env!!


//poniżej tworzymy middleware - funkcja która działa przed endpointem req- żądanie, res - odpowiedz, next - ok, przejd dalej
const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization; //szuka nagłówka authorization, który frontend powinien wysłać

    if(!authHeader)  {
        return res.status(401).json({error: "Brak nagłówka Authorization"}); //jeśli nagłowka nie ma - błąd
    }
    //nagłówke wygląda tak  Authorization: Bearer abc.def.ghi - my bierzemy drugi element - sam token
    const token = authHeader.split(' ')[1]; 

    try {
        const decoded = jwt.verify(token, JWT_TOKEN); //jwt.verify sprawdza czy token jest ok, czy nie jest przeterminowany, czy jest ten sam podpis
        req.user = decoded;
        next(); //jesli token ok , dodajemy dane użytkownika do req.user i przechodzimy do endpointu
    }   catch  (err) {
        return res.status(401).json({error: 'Nieprawidłowy token'}); //jeśli token nieprawidłowy - zwróci  401
    }
};
module.exports = authMiddleware; //eksport funkcji, żeby można było uzywać w server.js



