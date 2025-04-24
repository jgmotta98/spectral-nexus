# Database

## Purpose

The database serves as the core for:

- Storing **pre-processed FT-IR spectra** of known pesticides.
- Enabling **quick lookups** and ranked results based on spectral similarity metrics.

---

## Structure

The database is implemented using **SQLite** for local usage and simplicity. Its main table includes:

| Column           | Description                                       |
|------------------|---------------------------------------------------|
| `id`             | Unique identifier for each compound               |
| `compound_name`  | Common name of the pesticide                      |
| `wavenumbers`    | Array or string representing spectral x-axis      |
| `absorbance`     | Corresponding absorbance or transmittance values  |

> 💡 The structure may expand to include more fields as needed for future features.

---

## Population

All spectral data was obtained from a **free and open-access public database**. Each spectrum goes through the following preprocessing pipeline before insertion:

1. **Baseline correction** using airPLS.
2. **Normalization** of transmittance values.
3. **Band filtering** to retain only relevant peaks.

These steps ensure consistency across the dataset and improve classification performance.