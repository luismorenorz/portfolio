# New assets, September 2026

Provenance for the 50 assets imported from the Google Drive folder
`Portfolio repository` (`1kh4vpksuOKH19WY9TxBpciR40YqDIM2i`), folders **New Ads**,
**New AI** and **New emails**. No other folder in that Drive was touched.

The originals stay in Drive. The staged PNGs live under `build/raw/`, which is
gitignored; only the WebP pair in `site/assets/{full,thumb}` is committed, built
by the same rules as `build/optimize.py` (full: max 1200w x 12000h at q80,
thumbnail: 720w cropped to at most 4:3 from the top at q76).

## Duplicates removed

The folder holds 52 files. Two were dropped:

| File | Canonical file | Evidence |
|---|---|---|
| `Copia de 19 - Do the Math_ 20g Protein + 5g Fiber - NL #9.png` | `19 - Do the Math_ 20g Protein + 5g Fiber - NL #9.png` | identical sha256 (`47f12f69d7f836ff...`), identical 7,043,062 bytes |
| `Copia de 25 - Founder Story - NL #5.png` | `25 - Founder Story - NL #5.png` | different bytes, same 1200x11264 frame, average-hash distance 0; a side-by-side of the differing band (y 4030-9168) shows the same email re-exported with a small horizontal offset |

## Files


### Vysen Summer Campaign (Advertising, 16 assets)

| Key | Drive folder | Original filename | Source size |
|---|---|---|---|
| `vysen-summer-01` | New Ads | `AI_Ads_Min_4x5_1-1.png` | 1080x1350 |
| `vysen-summer-02` | New Ads | `AI_Ads_Min_4x5_1.png` | 1080x1350 |
| `vysen-summer-03` | New Ads | `AI_Ads_Min_4x5_1-2.png` | 1080x1350 |
| `vysen-summer-04` | New Ads | `AI_Ads_Min_4x5_1-3.png` | 1080x1350 |
| `vysen-summer-05` | New Ads | `AI_Ads_Min_4x5_1-4.png` | 1080x1350 |
| `vysen-summer-06` | New Ads | `AI_Ads_Min_4x5_2.png` | 1080x1350 |
| `vysen-summer-07` | New Ads | `AI_Ads_Min_4x5_2-1.png` | 1080x1350 |
| `vysen-summer-08` | New Ads | `AI_Ads_Min_4x5_2-2.png` | 1080x1350 |
| `vysen-summer-09` | New Ads | `AI_Ads_Min_4x5_2-3.png` | 1080x1350 |
| `vysen-summer-10` | New Ads | `AI_Ads_Min_4x5_3.png` | 1080x1350 |
| `vysen-summer-11` | New Ads | `AI_Ads_Min_4x5_3-1.png` | 1080x1350 |
| `vysen-summer-12` | New Ads | `AI_Ads_Min_4x5_3-2.png` | 1080x1350 |
| `vysen-summer-13` | New Ads | `AI_Ads_Min_4x5_3-3.png` | 1080x1350 |
| `vysen-summer-14` | New Ads | `Ads_Min_4x5_1.png` | 1080x1350 |
| `vysen-summer-15` | New Ads | `Ads_Min_4x5_2.png` | 1080x1350 |
| `vysen-summer-16` | New Ads | `Ads_Min_4x5_3.png` | 1080x1350 |

### Vysen The Boss Campaign (Advertising, 6 assets)

| Key | Drive folder | Original filename | Source size |
|---|---|---|---|
| `vysen-boss-01` | New Ads | `Ads_TheBoss_4x5_4.png` | 1080x1350 |
| `vysen-boss-02` | New Ads | `Ads_TheBoss_4x5_1.png` | 1080x1350 |
| `vysen-boss-03` | New Ads | `Ads_TheBoss_4x5_2.png` | 1080x1350 |
| `vysen-boss-04` | New Ads | `Ads_TheBoss_4x5_3.png` | 1080x1350 |
| `vysen-boss-05` | New Ads | `Ads_TheBoss_4x5_5.png` | 1080x1350 |
| `vysen-boss-06` | New Ads | `Ads_TheBoss_4x5_6.png` | 1080x1350 |

### Gut 1 AI Product Imagery (Advertising, 15 assets)

| Key | Drive folder | Original filename | Source size |
|---|---|---|---|
| `equilibrio-gut1-01` | New AI | `EQ_Image_8.png` | 1122x1402 |
| `equilibrio-gut1-02` | New AI | `EQ_Image_1.jpeg` | 1856x2304 |
| `equilibrio-gut1-03` | New AI | `EQ_Image_2.jpeg` | 1856x2304 |
| `equilibrio-gut1-04` | New AI | `EQ_Image_3.jpeg` | 1856x2304 |
| `equilibrio-gut1-05` | New AI | `EQ_Image_4.jpeg` | 1856x2304 |
| `equilibrio-gut1-06` | New AI | `EQ_Image_5.png` | 1122x1402 |
| `equilibrio-gut1-07` | New AI | `EQ_Image_6.png` | 1122x1402 |
| `equilibrio-gut1-08` | New AI | `EQ_Image_7.png` | 1123x1401 |
| `equilibrio-gut1-09` | New AI | `EQ_Image_9.jpeg` | 1856x2304 |
| `equilibrio-gut1-10` | New AI | `EQ_Image_10.jpeg` | 1856x2304 |
| `equilibrio-gut1-11` | New AI | `EQ_Image_11.png` | 1003x1568 |
| `equilibrio-gut1-12` | New AI | `EQ_Image_12.jpeg` | 1856x2304 |
| `equilibrio-gut1-13` | New AI | `EQ_Image_13.png` | 1122x1402 |
| `equilibrio-gut1-14` | New AI | `EQ_Image_14.jpeg` | 1856x2304 |
| `equilibrio-gut1-15` | New AI | `EQ_Image_15.jpeg` | 2880x2748 |

### Finding Ferdinand Email Campaigns (Email, 5 assets)

| Key | Drive folder | Original filename | Source size |
|---|---|---|---|
| `ff-emails-01` | New emails | `23] - [Summer Solstice_ Your Lightest Look Yet] - [NL #8].png` | 3600x26817 |
| `ff-emails-02` | New emails | `04] - [Spring’s Softest Shade] - [NL #2] + SMS.png` | 3600x21720 |
| `ff-emails-03` | New emails | `09] - [Summer Packing Essentials_ 5 Picks That Travel] - [NL #3].png` | 1200x9280 |
| `ff-emails-04` | New emails | `LS-07-29 _ National Lipstick Day _ Hero Send _ NL #7.png` | 1200x7877 |
| `ff-emails-05` | New emails | `25] - [National Kiss & Make Up Day] - [NL #7].png` | 1200x7949 |

### Pure Genius Email Campaigns (Email, 5 assets)

| Key | Drive folder | Original filename | Source size |
|---|---|---|---|
| `puregenius-emails-01` | New emails | `19 - Do the Math_ 20g Protein + 5g Fiber - NL #9.png` | 1200x8012 |
| `puregenius-emails-02` | New emails | `04 - New Here_ Meet Protein + Fiber (First-Order Offer) - NL #1.png` | 1200x9586 |
| `puregenius-emails-03` | New emails | `17 - Stop Doing Protein Homework - NL #3.png` | 1200x10240 |
| `puregenius-emails-04` | New emails | `22 -V2.png` | 1200x8692 |
| `puregenius-emails-05` | New emails | `25 - Founder Story - NL #5.png` | 1200x11264 |

### SNOW Email Campaigns (Email, 3 assets)

| Key | Drive folder | Original filename | Source size |
|---|---|---|---|
| `snow-emails-01` | New emails | `23 - Best Sellers Spotlight - NL #6.png` | 1200x6309 |
| `snow-emails-02` | New emails | `19 - Fresh Start, Bright Smile - NL #8v1.png` | 1200x5430 |
| `snow-emails-03` | New emails | `19 - [NEW] V2_ Results Stats - The EXTRA STRENGTH Weekend - NL #4.png` | 1200x6413 |
