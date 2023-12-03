# Käyttöliittymät ja pelit

Seminaarityönäni toteutin Pong-pelin TypeScriptiä ja HTML Canvas APIa hyödyntäen. Peli on klassinen arcade-tyylinen pingis peli, jossa ensimmäisenä 10 pistettä saavuttanut pelaaja voittaa. Pelin ensimmäinen versio on julkaistu Linux palvelimet-kurssin aikana vuokraamallani virtuaalipalvelimella ja sitä voi kokeilla [täällä.](http://linuxharjoitus.me) Demo video löytyy [täältä.](https://video.haaga-helia.fi/media/t/0_74hi6cea)

## Johdanto

Tässä projektissa haluan oppia pelinkehityksen peruskonsepteja ja samalla vahvistaa taitojani TypeScriptin parissa. Valitsin työni aiheeksi yksinkertaisen HTML5 Canvas -pelin rakentamisen, mikä tarjoaa helposti lähestyttävän tavan tutkia pelinkehityksen eri vaiheita. Tämän avulla voin myös laajentaa osaamistani ohjelmoinnissa.

Pelin toteuttamiseksi minun oli perehdyttävä pelinkehityksen perusteisiin. Löysin aiheesta helposti seurattavan [tutoriaalin](https://spicyyoghurt.com/tutorials/html5-javascript-game-development/develop-a-html5-javascript-game), jota hyödynsin seminaarityötä tehdessäni.

## Teknologiat

- **Ohjelmointikieli** TypeScript
- **Pelin renderöinti** HTML5 Canvas API

### TypeScript

Seminaarityön toteuttamisessa hyödynsin TypeScriptiä. Se mahdollisti interfacejen luomisen peliobjekteille. TypeScriptin avulla myös muuttujien ja tyyppitietojen hallitseminen oli helppoa. Tämän ansiosta mahdollisten virheiden riski pieneni huomattavasti.

### HTML Canvas API

HTML Canvas APIn ansiosta kuvien ja animaatioiden piirtäminen HTML-dokumenttiin oli helppoa ja tehokasta. Sen ansiosta myös vältyin ylimääräisten kirjastojen käytöltä ja pystyin keskittymään pelinkehityksen peruskonseptien opiskeluun.

### Game Loop

Game loop on tärkeä osa pelinkehitystä. Se on yksi pelin pääfunktioista. Sen avulla pelin vaiheet käydään jatkuvasti läpi. Tässä tapauksessa game loopin sisällä hallitaan käyttäjän syöte, päivitetään mailojen ja pallon sijainnit sekä piirretään päivitetty tilanne HTML Canvasiin kunnes pelin loppumisehto täyttyy.

Tilanteessa, jossa loppumisehto ei täyty, pyydetään seuraavaa animaatiokehystä. Tämä luo loopin, joka varmistaa, että päivitetty peli piirretään jatkuvasti uudelleen.

Olennainen osa game loopin toteutusta on `requestAnimationFrame`-funktio, joka antaa selaimelle tiedon siitä, että halutaan suorittaa animaatio. Kyseinen funktio ajoittaa animaation suorituksen seuraavaan ruudun päivitykseen. Sen ansiosta saavutetaan sulava animaatio ja parempi suorituskyky verrattuna esimerkiksi for-loopiin. ([W3Schools, Window requestAnimationFrame() Method](https://www.w3schools.com/jsref/met_win_requestanimationframe.asp)). Kutsuttaessa `requestAnimationFrame`-funktiota `gameLoop`-funktion lopussa saadaan aikaiseksi jatkuva silmukka.


```
export const gameLoop = (): void => {
    if (!gameOver()) { // Tarkistetaan pelin loppumisehto
        updateGame(); // Päivitetään pelin tila
        updateBall(ball, ballSpeed); // Päivitetään pallon sijainti
        draw(); // Piirretään päivitetty tilanne
        window.requestAnimationFrame(gameLoop); // Pyydetään seuraava animaatiokehys
    } else {
        drawWinningMessage(context);
        setTimeout(() => init(), 7000); // Alustetaan peli 7 sekunnin kuluttua
        return;
    }
}
```

## Collision Detection

Collision detection eli törmäyksen tunnistus on tekniikka, jonka avulla peliobjektit saadaan vuorovaikuttamaan toistensa kanssa. Projektissani sen avulla tunnistetaan, milloin pallon suunnan täytyy muuttua. Pallon siis törmätessä mailaan, pelikentän yläosaan tai alaosaan pallon suunta muuttuu. Pallon törmätessä jompaankumpaan päätyseinään päivitetään pistetilanne sen mukaan kumpaan päätyseinään pallo törmäsi.

```
    if (ball.x + ball.radius < 0 || ball.x + ball.radius > gameCanvas.width) { // Tarkistetaan pallonn reunan (sijainti + pallon säde) pelikentän laidan ylitys

    // Päivitetään pistetilanne sen mukaan kumpi laita ylitetään
        if (ball.x + ball.radius < 0) {
            updateScore('p2', scores);
        } else {
            updateScore('p1', scores);
        }
    }
```

## User Input

Käyttäjän syöte on olennainen osa pelinkehitystä. Se mahdollistaa pelaajan vuorovaikutuksen pelin kanssa. Projektissani käyttäjän syöte hallitaan tekemälläni userInput-funktiolla, joka kuuntelee näppäimistötapahtumia ja tallentaa kunkin näppäimen tilan muuttujaan. Sen avulla voidaan pitää kirjaa, mitkä näppäimet ovat painettuna missäkin vaiheessa.

```
export const userInput = (): void => {
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}
```

Näppäimien tilat käydään läpi game loopin sisällä funktiolla updateGame. Funktio käy läpi keys-olion ja kutsuu handleKey funktiota painettujen näppäimien kohdalla. Tämän ansiosta käyttäjän syötteisiin reagoidaan välittömästi ja pelin tila päivitetään sen mukaisesti.

```
const updateGame = (): void => {
    for (const key in keys) {
        if (keys[key]) {
            handleKey(key);
        }
    }
}
```

[(MDN Web Docs, 2D Breakout game pure JavaScript Tutorial)](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Paddle_and_keyboard_controls)

## Yhteenveto

Tämän seminaarityön aikana pääsin tutustumaan pelinkehitykseen. Syvennyin erityisesti HTML-pelin kehitykseen TypeScriptillä. Projektin aikana sain kokemusta ja ymmärrystä pelinkehityksen peruskonsepteista, kuten käyttäjän syötteen sekä peliobjektien törmäyksen hallinnasta. Lisäksi pääsin hyödyntämään joitakin kurssin aikana oppimiani TypeScriptin ominaisuuksia.

Projektin toteuttaminen oli mielekäs ja opettavainen kokemus. Pelinkehitys oli minulle täysin uutta, minkä ansiosta työskentely ei tuntunut väkinäiseltä. Projekti opetti minua hahmottamaan, miten voin toteuttaa yksinkertaisen pelin ja mitä se vaatii. 

Jatkokehityksen kannalta mieleen jäi monia ideoita, joiden avulla voisin syventyä pelinkehitykseen enemmänkin. Peliin voisi lisätä esimerkiksi yksinpelitilan, realistisemmat pallon liikkeet tai vaikeustason valinnan.

## Lähteet

[MDN Web Docs, 2D Breakout game pure JavaScript Tutorial](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Paddle_and_keyboard_controls)

[Spicy yoghurt, Develop an HTML5 game](https://spicyyoghurt.com/tutorials/html5-javascript-game-development/develop-a-html5-javascript-game)

[W3Schools, Window requestAnimationFrame() Method](https://www.w3schools.com/jsref/met_win_requestanimationframe.asp)
