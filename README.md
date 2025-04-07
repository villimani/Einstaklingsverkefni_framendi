# Grunnur að skýrslu

## Inngangur

Í þessu verkefni var hannaður og útfærður vefur sem gerir skráðum notendum kleift að búa til, geyma og stjórna glósupökkum á skipulagðan og aðgengilegan hátt. Notendur geta valið hvort þeir halda glósupökkunum sínum út af fyrir sig eða deila þeim með öðrum. Vefurinn innleiðir aðgangsstýringu til að tryggja að einungis viðeigandi notendur hafi aðgang að viðkomandi glósum. Markmiðið er að skapa öruggt og notendavænt umhverfi fyrir gerð og notkun glósna.

## Útfærsla

Hér eru slóðir á útfærslur á bakenda og framenda:

Framendi- https://github.com/villimani/Einstaklingsverkefni_framendi

Bakendi - https://github.com/villimani/Api_einstaklingsverkefni_Veff2

Hér er slóð á hýsingu af verkefninu- https://einstaklingsverkefni-framendi.vercel.app



Kerfið samanstendur af:

- **Bakendi** Bakendinn er útfærður með hono typescript
- **Gagnagrunnur** (PostgreSQL) með Prisma sem ORM og er hýstur á Neon
- **REST API** REST Api vefþjónusta er útfærð sem sér um samskipti við bakendann
- **Framendi** er útfærður með Next.js (React framework)
- **Verkefni sett upp í hýsingu** Framendi hýstur á Vercel, bakendi hýstur á Render 
- **Notendaumsjón**: Notendur hafa eigin aðgang og geta stjórnað aðgangi að glósunum sínum



Þessi skylrði voru valin vegna þess að þetta er allt eitthvað sem er nauðsynlegt til þess að hafa vefsíðu þar sem hægt er að deila gögnum á milli aðila. 

Til þess að geta geymt gögn og deila þeim á milli þá þarf að hafa gagnagrunn sem geymir öll gögnin og til þess að hægt sé að nýta gögnin þarf að hafa bakenda sem getur sótt, sent og breytt gögnunum. Til þess að hægt sé að hafa vefsíðu þarf að hafa vefþjónustu sem getur útfært samskipti bakendans og framendans og til þess að notendur geti nýtt vesíðuna þarf að sjálfsögðu að vera framendi sem er hýstur. Þó að notendaumsjón sé kannski ekki nauðsynleg til að búa til vefsíðu þar sem hægt er að deila gögnum þá veitir hún meiri möguleika til þess að stjórna hver sér hvað og hver getur breytt hverju og því hentar það mjög vel fyrir þetta verkefni að innihalda notendaumsjón.

## Tækni

## Bakendi
- **Hono**  
  Hono var valið vegna þess að það er hratt og frekar þæginlegt í uppsetningu einng vegna þess að það hentar vel fyrir minni API.
- **Prisma**  
  Prisma var valið vegna þess að það einfaldar vinnslu með gagnagrunninn.
- **PostgreSQL**  
  Þæginlegur gagnagrunnur sem hentar vel fyrir þetta verkefni.
- **Zod + JWT**  
  Zod hjálpar til við að staðfesta gögnin sem koma inn og JWT sér um örugga innskráningu.

## Framendi
- **Next.js**  
  Valið til þess að hægt væri að gera React framework sem er hratt og er með gott routing.
- **TypeScript**  
   Notað til að gera læsilegann og góðann kóða.
- **CSS módúlar**  
  Til að forðast árekstra í stílunum ásamt því að halda kóðanum skipulagðum.

## Verkfæri & Umhverfi
- **Git**  
  Til að halda utan um breytingar og hjálpa til við hýsingu.
- **Render/Vercel**  
  Notað til að hýsa verkefnið á góðan máta.


