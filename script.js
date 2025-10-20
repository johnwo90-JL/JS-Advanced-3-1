///////////////////////////
// ## Asynkron Javascript


////////////////////////
// Bruk av setTimeout:
console.log("[setTimeout] Start!");

setTimeout(() => {
    console.log("[setTimeout] After 1000ms");
}, 1000);

console.log("[setTimeout] Slutt!");

////////////////////////////////////////////////////
// Alternativet til asynkron JS - "Callback Hell":
function getData(callback) {
    setTimeout(() => {
        console.log("[Callback Hell] Henter data...");
        callback("Data mottatt");
    }, 2000);
}

function processData(data, callback) {
    setTimeout(() => {
        console.log("[Callback Hell] Prosesserer: " + data);
        callback("Ferdig prosessert data");
    }, 2000);
}

getData(data => {
    processData(data, res => {
        console.log("[Callback Hell] Result:", res);
    });
});


//////////////////////////////////////////////////
// En enkel asynkron funksjon, bruker "Promise":
const foo = true;
function fetchData(data) {
    return new Promise((resolve, reject) => {
        if (foo) {
            setTimeout(() => resolve(data), 2000);
            return;
        }
        reject("Ikke nok banan...");
    });
}

//////////////////////////////////////////////////////////////
// Funksjoner som ikke trenger parameter kan defineres slik:
const myAsyncFunction = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Finised!");
    });
});

// Deretter kan man f.eks. bruke:
// const result = myAsyncFunction
//                  .then(result => console.log(result))
//                  .catch(err => console.error(err));
// ...eller
// const result = await myAsyncFunction;

///////////////////////////////////////////////////////////////////////////////////
// "Chaining" - Gjør det mulig å kjøre flere asynkrone funksjoner etter hverandre,
// så lenge de foregående funksjonene kjører uten feil.
console.log("[CHAINING] Start!");
 const bar = fetchData("[CHAINING] Some data")
    .then(res => processAsyncData(res)) // <-- Bruk resultatet fra den første funksjonen...
    .then(processDataResult => {   // <-- ...vis deretter resultatet fra den 2. funksjonen, skriv til konsoll
        console.log("[CHAINING] Result:", processDataResult);
    })
    .catch(err => {
        console.log("[CHAINING] Got an error:", err);
    })
    .finally(() => {
        console.log("[CHAINING] Finished!");
    });



////////////////////////////////////////////////
// Enkelt workaround for å kjøre asynkron kode
// med async/await fra top-level scope:
(async () => {
    // ...asynkron kode her!
})();


///////////////////////////////////////
// Async/Await, og Try/Catch/Finished

// Som vi vet: Funksjoner som returnerer "Promise", er i praksis
// det samme som funksjoner definert med `async function ...` eller `async () => ...`
function processAsyncData(data) { // Returnerer Promise<any>
    return new Promise((res, rej) => { // async
        console.log("[ASYNC/AWAIT] Process data running!");
        setTimeout(()=>{
            if (Math.random() <= .5) {
                data["ourKey"] = "ourValue";
                res(data); // return ...; UTEN step-out-of-scope
                return; // <---
            }
            rej("Failed data processing"); // throw new Error(...);
        }, 2000);
    });
}

async function getAsyncData() { // Returnerer Promise<any>
    // Hent data fra API ved bruk av `fetch`:
    const result = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    
    // Sjekk om HTTP statuskode er mellom 200 og 299:
    if (!result.ok) {
        throw new Error("Got status, "+result.status);
    }

    const json = await result.json();
    console.log(json);

    // Throw error, hvis man ønsker å teste det...
    // throw new Error("Foobar"); // tilsvarende: `reject("Foobar"); return;`

    // Returner `json`
    return json; // tilsvarende: `resolve(json); return;`
};

async function main() {
    try {
        const res = await getAsyncData();
        const data = await processAsyncData(res);
        console.log("[ASYNC/AWAIT] We got data:", data);
    } catch (error) {
        console.error("[ASYNC/AWAIT] We got an error:", error);
    } finally {
        console.log("[ASYNC/AWAIT] Finished!!");
    }
}

main();

