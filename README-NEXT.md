# Rentalize – Next.js dalis

## Automobilio detalių puslapis

- **Maršrutas:** `/automobilis/[id]` (pvz. `/automobilis/admita-skoda-octavia`)
- **Struktūra:** Dviejų stulpelių layout (kairė: nuotrauka + specifikacijos, dešinė: sticky „Pasiūlymai“ sidebar)
- **Duomenys:** Skaitomi iš projekto šaknyje esančio `cars.json`

## Kaip paleisti

```bash
npm install
npm run dev
```

Atidarykite [http://localhost:3000](http://localhost:3000).

- **Sąrašas:** `/` (Next.js pagrindinis puslapis)
- **Detalės:** `/automobilis/[id]` (paspaudus ant kortelės)

## Statinis index.html

Jei naudojate tik statinį `index.html` (be Next.js serverio), kortelės nukreipia į `/automobilis/[id]`. Kad šios nuorodos veiktų, reikia paleisti Next.js (pvz. `npm run dev` arba `npm run build` + `npm start`) tame pačiame domeine.

## Nuotraukos

Next.js puslapiuose naudojami paveikslai iš `public/assets/`. Jei atnaujinate failus aplanke `assets/`, nukopijuokite juos į `public/assets/`.
