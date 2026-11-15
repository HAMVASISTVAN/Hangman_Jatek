const express = require('express'); // betöltjük az Express csomagot, hogy használni tudjuk a szolgáltatásait
const app = express(); const cors = require('cors');  
app.use(cors());  
const PORT = process.env.PORT || 3000;
app.use(express.json());  // hogy az Express fel tudja dolgozni a frontendtől érkező JSON-adatokat
// A játékban használható szavak
const szavak = [
    "ISKOLA",
    "SZÁMÍTÓGÉP",
    "ELEKTRONIKA",
    "PROGRAMOZÁS",
    "VILLAMOS",
    "KONDENZÁTOR",
    "TRANZISZTOR"
];
let gondoltSzo = "";  // globális változót kell csinálnunk belőle
let hibak = 0;        // játék újraindításához, betűellenőrzéshez globálissá kell tennünk őket
let poziciok = [];    // üres tömböt hozunk létre, a pozíciók tárolására
// globális változók, mert több végpontban is használjuk őket
// globális változó, a hibás próbálkozások számának tárolására
// A HTML-fájl kiszolgálása

app.get('/', (req, res) => { //ha valaki megnyitja a szerver főoldalát (/), akkor a szerver elküldi neki az Akasztofa.html fájlt
    res.sendFile(__dirname + '/Akasztofa_kesz.html');
});
// Új játék indítása
app.get('/api/ujjatek', (req, res) => {
    const veletlenIndex = Math.floor(Math.random() * szavak.length);
    // Véletlenszerű szó kiválasztása
    gondoltSzo = szavak[veletlenIndex];
    console.log("A gondolt szó: " + gondoltSzo);
    hibak = 0;   // nullázzuk a hibák számát
    // poziciok = []; // üres tömböt hozunk létre, a pozíciók tárolására
    poziciok = [0, gondoltSzo.length - 1];
    let megjelenitettSzo = "";
    for (let i = 0; i < gondoltSzo.length; i++)
           {  if (i == 0 || i == gondoltSzo.length - 1) {  megjelenitettSzo = megjelenitettSzo + gondoltSzo[i] + " ";  }
              else                                      {  megjelenitettSzo = megjelenitettSzo + "_ ";  }
           }  
           console.log("Gondolt szó: " + gondoltSzo);
           console.log("Pozíciók: " + poziciok);
           console.log("Megjelenített szó: " + megjelenitettSzo);            
    res.json({ betukSzama: gondoltSzo.length,
               hibak: hibak,
               megjelenitettSzo: megjelenitettSzo  // el is küldjük az első és utolsó betűket
              });  
});


app.post('/api/betu', (req, res) => {
    // req: a beérkező kérés
    // body: a kérés törzse, amelyben az elküldött adat található
    // betu: a JSON-objektum egyik tulajdonsága
    const betu = req.body.betu;            // kiolvassuk a kapott JSON-adatból érkezett betűt 
    console.log("A választott betű: " + betu);
    let megjelenitettSzo = "";  // üres szöveges változó
    let talalat = false;        // ha szerepel a szóban a kapott betű
    // Megvizsgáljuk, hogy a gondolt szó tartalmazza-e a betűt
    for (let i = 0; i < gondoltSzo.length; i++) 
        {  if (gondoltSzo[i] === betu) 
               { talalat = true;
                 poziciok.push(i); 
               }

        }
   
        for (let i = 0; i < gondoltSzo.length; i++) 
        {   let talalt = false; 
            for (let j = 0; j < poziciok.length; j++)
              {                 
                  if (poziciok[j] == i)  {talalt = true;}
                  else                   {;;}  
              }
              if (talalt == true)    { megjelenitettSzo = megjelenitettSzo + gondoltSzo[i] + " ";  }
              else                   { megjelenitettSzo = megjelenitettSzo + "_ ";  }
        }
        if (talalat==true)  // ha benne van a betű  a szóban
                    {  res.json({ uzenet: "Talált!",
                                  betu: betu,
                                  megjelenitettSzo: megjelenitettSzo
                                });                                       
                   }           // ha nincs benne  a betű  a szóban              
        else       {   hibak++;
                       console.log("Hibák száma: " + hibak);
                       res.json({  uzenet: "Nincs ilyen betű!",
                                   hibak: hibak,
                                   betu: betu,                    
                                   megjelenitettSzo: megjelenitettSzo
                                 });                                 
                    }                                    
                                      
     });


// Szerver indítása
app.listen(PORT, () => {
    console.log(`Szerver fut a ${PORT} porton.`);
});
