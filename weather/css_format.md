# Oracle Redwood **Color System**
Oracle Redwood **Color System** to uporządkowana paleta kolorów zaprojektowana z myślą o spójności wizualnej, dostępności i estetyce nowoczesnych aplikacji biznesowych. Obejmuje zestawy kolorów podstawowych, pomocniczych oraz informacyjnych (np. ostrzeżenie, sukces, błąd), które są starannie dobrane pod kątem kontrastu i czytelności na różnych tłach. System wspiera tworzenie interfejsów przyjaznych dla użytkownika, zgodnych z wytycznymi WCAG, i ułatwia projektowanie zarówno w trybie jasnym, jak i ciemnym. Kolory Redwood są zintegrowane z komponentami UI, co pozwala zachować spójność wizualną w całym ekosystemie aplikacji Oracle.
# Zasady stosowania kolorów (skrót techniczny)
## 1) Paleta bazowa Redwood (kody i rola)
* **Bark — #312D2A **
  Kolor podstawowy dla tekstu, osi, ramek i łączników. Etykiety łączników w Bark, czcionka ~8–9 pt; łączniki 1 pt z grotami „open”. Solid = przepływ danych, dashed = interakcja użytkownika.
* **Air — #FCFBFA **
  Główne tło wykresów, kart i diagramów.
* **Neutral 1 — #F5F4F2 **
  Jasne wypełnienia, tła paneli, lekkie podbicia kontrastu.
* **Neutral 2 — #DFDCD8 **
  Delikatne obszary tła, pasy grupujące, opcjonalne linie siatki.
* **Neutral 3 — #9E9892 **
  Obramowania o niskim kontraście, pomocnicze linie i podziały.
* **Rose — #A36472 **
  Akcent specjalny (oszczędnie – np. rzadkie wyróżnienia).
**Kolory funkcyjne**
* **Sienna** – #A85532 obramowania grup *fizycznych* (często linia przerywana ~1–1.25 pt). Stosowana także w etykietach grup.
* **Ivy** – #6B8E23 elementy *logiczne* i drill-downy; przy rozwinięciach używaj Ivy z kryciem 50 %.
* **Ocean** – #0572CE .
* **Ikony** – trzymaj się korporacyjnej palety (m.in. Sienna/Ocean) i **jednego** koloru na ikonę; bez cieni/efektów 3D. Zawsze z podpisem.
**Typografia**
Oracle Sans (lub Arial/Calibri, gdy niedostępna). Rozmiary etykiet i podpisów w diagramach ~8–9 pt.
---
## 2) Zasady kompozycji koloru
1. **Minimalizm barw:** dla kategorii staraj się nie przekraczać **6 unikalnych kolorów**; powyżej tego progiem narasta obciążenie poznawcze. Jeśli musisz, zatrzymaj się na **12** – dalej wizualizacja staje się myląca.
2. **Hierarchia przez kontrast:**
   * Tekst/ramki/osiowanie w **Bark**.
   * Tła w **Air**; obszary i grupy: **Neutral 1–2**.
   * Linie siatki i separatory: dyskretnie w **Neutral 2–3**.
3. **Spójność semantyczna:** ten sam kolor = ta sama kategoria w całym systemie (dashboardy, raporty, diagramy).
4. **Akcenty oszczędnie:** wybierz **jeden** kolor akcentu (np. Sienna/Rose) dla „call-outów”, anomalii lub aktywnej serii.
5. **Łączniki i przepływy:** 1 pt w **Bark**, grot „open”. Solid = dane; dashed = interakcja; opisy łączników w Bark (ok. 8 pt).
6. **Grupowanie:**
   * *Fizyczne* granice i lokalizacje: obrysy **Sienna** (często przerywane).
   * *Logiczne* granice, kompartymenty, tier’y: neutrals + podpisy w Bark.
7. **Czytelność i dostępność:** zapewnij wysoki kontrast (WCAG), nie polegaj wyłącznie na opozycji czerwony–zielony; dodawaj redundancję (znaczniki, grubości linii, wzory).
---
## 3) Stosowanie kolorów w **analityce** (wykresy, dashboardy)
**Mapowanie ról**
* **Tło i layout:** Air; ramki/panele w Neutral 1; siatka subtelna w Neutral 2–3.
* **Tekst, osie, etykiety:** Bark; wartości liczbowe nieco mocniejsze niż opisy.
* **Seria główna / „focus”:** akcent (np. Sienna/Rose) *tylko dla jednej* serii; pozostałe serie w odcieniach jednego/dwóch kolorów, aby utrzymać hierarchię.
**Skale kolorystyczne**
* **Kategoryczne:** ≤6 barw. Jeśli kategorii jest więcej, grupuj, używaj wzorów/markerów lub przełączaj widok (facetowanie).
* **Sekwencyjne (natężenie):** jeden hue z rosnącą jasnością/nasyceniem na tle Air/Neutral 1.
* **Diverging (pozytyw/negatyw):** dwa odcienie pochodne, środek neutralny (Neutral 2) – minimalizuje „gorąco-zimne” przesterowanie.
**Konsekwencja między ekranami**
* Reużywaj tej samej legendy i kolejności serii.
* Ten sam KPI zachowuje ten sam kolor w kartach, wykresach i tabelach.
**Łączność z diagramami**
* Gdy wykres odnosi się do elementów architektury, zachowaj tę samą semantykę kolorów (granice w Sienna, przepływy opisane w Bark). Pozwala to „czytać” dashboard i diagram jak jeden język wizualny.
---
## 4) „Do & Don’t” w pigułce
* **Tak:** Air/Neutral’e dla tła; Bark dla treści; jeden akcent; ≤6 barw kategorycznych; łączniki 1 pt Bark z jasną legendą.
* **Nie:** wielokolorowe ikony, efekty 3D/cienie, zbyt wiele nasyconych barw, brak spójności semantycznej.