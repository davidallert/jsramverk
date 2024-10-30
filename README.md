# SSR Editor

# Starter project for DV1677 JSRamverk

## Uppgift 1:

**vilka steg implementerades för att få programmet att fungera?:**

För att få applikationen att fungera behövdes en hel del funktioner samt filer läggas till. Det första steget var att lägga till en .env fil för att kunna köra app.mjs filen. Utan .env filen så kunde ej app.mjs köras och därför kunde vi heller inte starta lokalservern för att se webbisdan. 

Ur kraven som ställts gällande applikationen så behövdes en del metoder och funktioner läggas till eller förändras. För att få POST / routen att fungera behövde vi lägga till en route för att uppdatera våra dokument, i denna route används funktionen updateOne, som kallades från docs.mjs filen. Denna funktion updaterar dokumentets titel och innehåll. 

Efter att funktionen att uppdatera dokument laddes till så var det relativt så sömlöst att lägga till skapande av nya dokument, då principen var ganska så lik.

**Vilket frontend-ramverk har ni valt?** 

Till frontend-ramverk så har vi beslutat att ramverket react passar våra ändamål bäst. Då react är det mest populära frontend-ramverket samt att det är react som kommer användas som bas i föreläsningarna så är vårt påstående att det är det bästa ramverket att lära sig. React och dess användning är en grad över resterande ramverk i mängden användare och att arbeta med detta nu kan vara nyttigt för både framtida möjligheter att arbeta med js-ramverk, samt nu i kursen då react kan vara en bra grund att lära sig ramverk.


## Uppgift 2:

**vilka steg implementerades för att få programmet att fungera?:**

För att få programmet att fungera så fick vi först byta databas från SQlite till MongoDB för våran backend. För att göra detta behövde vi skapa nya funktioner som svarade med JSON-data istället för att svara mot våra gamla vyer.

Efter att vi hade löst databasen så gick vi vidare till att skapa en fristående frontend som är uppladdad som ett separat GitHub-repo. Vi driftsatte den genom att använda oss utav rsync för att på så sätt publicera filerna till studentserverns editor-katalog. Rsync kunde inte hitta rätt SSH-nyckel av sig själv, men detta löstes genom att lägga till strängen "ssh -i $HOME/.ssh/dbwebb" i deploy-scriptet. För att hantera routingen lokalt hade vi använt oss av BrowserRouter, men det visade sig att denna inte var kompatibel med studentservern, vilket gjorde att vi behövde byta till HashRouter.

För att dessa två projekten skulle kunna överföra information till varandra så fick vi använda oss av Azure för att driftsätta backenden så att vår frontend hade någonstans att hämta informationen ifrån. Vi använde oss av react som ramverk och skapade våran frontend genom det. Efter det var det främst att lägga till samma funktionalitet som innan, och för det så behövde vi fetcha datan från våran backend api till våran frontend. Uppstod lite fel då och då med att få ut korrekt information till sidan men det svåraste var att uppdatera informationen från frontend till backend.

Sedan skapade vi tester för backend som bl.a kontrollerar att datan som hämtas har rätt struktur och att våra routes returnerar status 200 när de anropas. Vi skapade också några tester för frontend som ser till att dokumenten skapas på rätt sätt, att input-variablernas värden uppdateras, etc.

Därefter skapade vi en CI-kedja för backend med hjälp av GitHub Actions. Vårt s.k. workflow använder sig av en yml-konfigurationsfil för att köra testerna för alla permutationer av de specificerade versionerna.

## Slutuppgift:

**krav 1 autentisering:**

För att lösa det första kravet, autentisering så behövde vi göra en ny route i våran databas för att kunna spara nya användare. Vi använde oss av bcrypt för att enkryptera vårat inlogg, och sedan använde vi det för att kunna jämföra lösenordet under login. Om användaren inte är inloggad så kan dem ej se dokumenten då dem är kopplade till ens användare. JWT token används för att hålla koll på detta. Dessa kopplade dokument kan då delas med andra genom en inbjudan via mejl, vi använder mailersend som platform för detta. Några problem som uppstod i detta krav var att mailersend ej skickade ut mejl efter ett tag. Vi är inte säkra om det är det är så att inbjudan har börjat ses som spam av gmail/hotmail eller om det är något annat som låser den.

**krav 2 sockets:**

I detta krav så var målet att kunna göra det möjligt för två användare att kunna redigera samma dokument samtidigt, och att det skulle uppdateras live, genom sockets. Vi lade till sockets och dess funktionalitet genom att först lägga till funktioner i backenden som bland annat skapar rum. efter det så förde vi vår information från backenden till vår frontend. För att skicka det vi skriver i dokumentet till backenden och sen tillbaka till alla i rummets frontend använde vi oss av emit kommandet för sockets. Genom detta så skapade vi en sida som uppdateras live efter användarens input och skickar tillbaka informationen till resterande av dem i room.
*minns inte om vi hade så mycket problem med detta krav?*

**krav 3 comments:**

För att lösa detta krav så behövde vi på något sätt visa vad den texten man kommenterade hade för innehåll. Vi valde att göra det möjligt för användaren att markera ett stycke i dokumentet. Vi gjorde detta genom att titta på vart användarens markering i texten började och slutade, satt detta i en variabel, och sedan visade upp det i kommentars rutan i vårt dokument. Ett problem vi hade med detta var att vi först testade detta med ett input-fält med email som type, eftersom att vi ändå inte skulle använda den för email så var problemet lätt löst. Sedan behövde vi fixa vår styling till kommentarerna, dels så att det passade resten av dokument-sidan men även så att kommentarerna som skapades live hade en css till att börja med. Det löste vi dock ganska så fort med hjälp av bland annat classList.add.