const channel = new BroadcastChannel('sw-messages');

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const operations = [
    "match",
    "has  ",
    "open ",
];

const keys = [
    "9jfhvWpWA1m3AyRwlR7hKz77TswqrFBm",
    "Y5Da4E7iumEjVeu83PUse7tbN6HdKAMM",
    "tAP4FfjWRoa2jwhV4oREUu7hmVbhUIFz",
    "mHdJISWV6x5qw4lmgnfEpeXcd6FuG1so",
    "yiL5bYL13rc7ngj2vyiyVlAlsuvq2iyt",
    "IXz9dBhkwy6fFs20yACR4zTwbHW9BsHF",
    "9DguOYyqTXP1WgNGZPMNmm7dW8Do60bP",
    "KT8b4dgTqiwrxBu5brk8gyCTohNAQdOT",
    "ITzuh5wvk3ObpNQK3QfEbzMLZHcJKUFv",
    "0J2MkCQbW2EsKPIpKHhlkCu9O8CcDREG",
    "7MWEcqYHBnG5J4EV5MGBjnDsC39oFX6l",
    "VBIktstRJs4SCAQW1kqK73bXe0GzQb12",
    "ENKEhHbVFerPAUyq1FPHQaPw9hovwPDl",
    "6H5P6A8t7p6PPTwQAajoQ9nEktK1h9sR",
    "XRA2h30v1ODA9IzfYU0kB5soXuoJOJoI",
    "V3SMvTrWTHgfR7O6a4cS1yOt15G8GXYL",
    "i20hSeeBOAkP7mcWLCENkTJXvuXoDCWN",
    "yFvBhUtV7RqmjBTPYduflxCcWJOxj1Sh",
    "L1aZHwugBGrdEOw9YAyPMwAfhAfUCXm7",
    "WvjQMZRiMRJGeDoKbFcTOcIAUB2SCu8w",
    "kZ7Bhgmd4yrALfesrL2aHRq1I8IfKwpP",
    "glIVrwvjRcEpuLot3u2oL8sdlzpDgPf6",
    "C0dJY0fPt4ZRXbu0mpDrtDlSlBEbog71",
    "vI5hE1G2xMjcmPcQfElj3poqu8TdcKEB",
    "q8mRYbdU8dAA9uRqtWtsvgQldUOzLfQu",
    "YjvnmsHCv8zoTxoBxak6wX0HnL7gzf8o",
    "jPoecI4dSC6xLb5IOt5Fgae6u0GmEeYb",
    "QVS0XNMW8fiEnR1scakl036OcH19NUf0",
    "kAo4TlnGMkei5yaleXY6E14AJCfjHE7R",
    "CvFJCI8jlw9XTDhU9RGVb5GtZQDSppTW",
    "2mbFesoFPhURFKJjG4J6cop43AF6IYiE",
    "2YZ5qN0fHUOuLFtrkPzkVxsCSsgNZhCW",
    "DkSAxFrGkgkrol0lx3OckJCHreTdwQJH",
    "6qOOmvX3vOD1JXzZTGQ9B12fKja6ofco",
    "0VH4kME1vFOsUqPUE8AxWwSHH5gyR55f",
    "HMuVXEsrSP4IVaBgxZ1izekrg8KCoQHi",
    "zNF2U0ec1zagzhWzos9scKiy33Ilvhoh",
    "T1XQa0mtd4LT6v4f86Q9zGWHGgpJTAKH",
    "MP7ZfJNAbLw5LsCvKzc2O9iLwC0Oo5JT",
    "JNBJq9tw2DDgkm1QQyE8XccN8QPhTqGv",
    "UiO1RoFh789iuzww4GRT7zAUr9ftAUCk",
    "fkEzjmHxO1wPbfoAw1ZAa8JdYv3oYpQi",
    "D2AWRV4EvxAuPZY3gCLicErWy4jrKsTp",
    "DwObME9b1E7YRFW8lhR7LtHAtNo38oYX",
    "riZup0kYiSmEmdhegf5ka9l4ODcNfuu1",
    "yLb1FfZvnbXDqUmUenleSKEyfaYbV7Jp",
    "Fu6uEazuYBLAxWffC1GpueHrqiTo1xPX",
    "MMTO0m2PfB7lnYGuu6ciz2cvN1TaHELn",
    "KF0K1UkGJw3nHMP6LmcTwfkEGUFiAEJs",
    "EvRnomPvhmsbYD2r1P4LaYWiJAEgbpdE",
];

const doOperation = async () => {
    const key = keys[getRandomInt(keys.length)];
    const operation = operations[getRandomInt(operations.length)];

    let output;
    let response;

    try {
        switch (operation) {
            case 'match':
                response = await caches.match(key);
                break;
            case 'has  ':
                response = await caches.has(key);
                break;
            case 'open ':
                response = await caches.open(key)
                break;
        }


        channel.postMessage({log: "[service-worker] - " + operation + " - cache:'" + key + "' - response:'" + response + "'\n"});
    } catch (e) {
        stopLoop();

        channel.postMessage({log: "\n\n\n======================================\nLOOPING STOPPED. AN EXCEPTION HAS BEEN THROWN\n======================================\nException (exception logged to console as well):" + e});
        console.log(e);
    }
}

let interval;
channel.addEventListener('message', event => {
    console.log('Received in SW', event.data);
    const action = event.data.action;
    const intervalDelay = event.data.interval;

    if(action == 'start') {
        interval = setInterval(doOperation, Number.parseInt(intervalDelay));
    } else if(action == 'stop') {
        clearInterval(interval);
    }
});