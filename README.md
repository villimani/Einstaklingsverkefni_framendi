# Grunnur að skýrslu

## Inngangur

Í þessu verkefni var útfærður vefur sem gerir skráðum notendum kleift að búa til, geyma og stjórna glósupökkum á skipulagðan og aðgengilegan hátt. Notendur geta valið að halda glósupökkunum sínum fyrir sig eða deila þeim með öðrum á síðunni. Vefurinn inniheldur aðgangsstýringu til að tryggja að aðeins réttir aðilar hafi aðgang að viðeigandi glósum og upplýsingum.

## Útfærsla

Kerfið samanstendur af:

- **Bakendi** útfærður með Hono (lightweight web framework fyrir JavaScript/TypeScript)
- **REST API** sem skilar gögnum um glósupakka og meðhöndlar beiðnir frá framendanum
- **Framendi** útfærður með Next.js (React framework)
- **Notendaumsjón**: Notendur hafa eigin aðgang og geta stjórnað aðgangi að glósum
- **Verkefni sett upp í hýsingu** með CI/CD ferlum
- **Gagnagrunnur** (PostgreSQL) með Prisma sem ORM

## Tæknistack

### Bakendi:
- Hono (fyrir API þjón)
- Prisma (fyrir gagnagrannsátt)
- PostgreSQL (gagnagrunnur)
- Zod (fyrir gögnavalidations)
- JWT (fyrir auðkenningu)

### Framendi:
- Next.js (React framework)
- TypeScript
- CSS módúlar (fyrir stílsmíði)

### Önnur tól:
- Git fyrir útgáfustjórnun
- Render.com fyrir hýsingu
- CI/CD pipeline
