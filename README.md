# Grunnur að skýrslu

## Inngangur

Í þessu verkefni var útfærður vefur sem gerir skráðum notendum kleift að búa til, geyma og stjórna glósupökkum á skipulagðan og aðgengilegan hátt. Notendur geta valið að halda glósupökkunum sínum fyrir sig eða deila þeim með öðrum á síðunni. Vefurinn inniheldur aðgangsstýringu til að tryggja að aðeins réttir aðilar hafi aðgang að viðeigandi glósum og upplýsingum.

## Útfærsla

Hér eru slóðir á útfærslur á bakenda og framenda:

Framendi- https://github.com/villimani/Einstaklingsverkefni_framendi
Bakendi - https://github.com/villimani/Api_einstaklingsverkefni_Veff2

Hér er slóð á hýsingu af verkefninu:



Kerfið samanstendur af:

- **Bakendi** Bakendinn er útfærður með hono typescript
- **REST API** REST Api vefþjónusta er útfærð sem sér um samskipti við bakendann
- **Framendi** er útfærður með Next.js (React framework)
- **Notendaumsjón**: Notendur hafa eigin aðgang og geta stjórnað aðgangi að glósunum sínum
- **Verkefni sett upp í hýsingu** Framendi hýstur á Vercel, bakendi hýstur á Render 
- **Gagnagrunnur** (PostgreSQL) með Prisma sem ORM og er hýstur á Neon

## Tækni

### Bakendi:
- Hono (fyrir API þjón)
- Prisma (fyrir gagnagrannsátt)
- PostgreSQL (gagnagrunnur)
- Zod (fyrir gögnavalidations)
- JWT (fyrir auðkenningu)

### Framendi:
- Next.js (React framework)
- TypeScript
- CSS skrár fyrir útlit

### Önnur tól:
- Git fyrir útgáfustjórnun
- Render.com og Vercel.com fyrir hýsingu
- CI/CD pipeline
