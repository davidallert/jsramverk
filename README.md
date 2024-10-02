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