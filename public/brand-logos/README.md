# Markių logotipai (landing puslapiui)

1. Įkelkite **PNG** (arba **WebP** / **SVG**) failus į šį aplanką.
2. **Rodomos tik markės, kurioms čia yra failas** (pvz. tik `bmw.png` → tik BMW kortelė).
3. **Failo vardas** = `slug` + plėtinys (mažosios raidės patogu):
   - `bmw.png`, `mercedes-benz.png`, `skoda.png`
4. Gražūs pavadinimai ekrane: žr. `BRAND_LABEL_BY_SLUG` faile `lib/landing-brands.ts` – ten galite pridėti savo slug → etiketė (pvz. neįprastas failo vardas).
5. Rekomenduojama: permatomas PNG, logotipas centruotas (~400–800 px pločio).

Jei aplanke nėra nė vieno paveikslėlio, landing sekcija **nerodoma**.

Paspaudus logotipą atidaromas katalogas su filtru **`?marke=`** (tikslus `cars.json` laukas `brand`). Failo vardas (`slug`) sutapdinamas su katalogo markėmis (pvz. `kia.png` → KIA, `skoda.png` → Škoda).
