# Spectral Nexus

## Instalation

## Usage

Use the database returned from the [Spectra Scraper](https://github.com/jgmotta98/spectra-scraper) to feed the algorithm. Use a `*.csv` file to input the FT-IR spectral data.

Modify all paths accordingly on [config.py](/src/config.py). Run [main.py](/src/main.py).

## Features

* Selective filtering of spectral bands based on user-defined parameters.

* Correlation of inputted FT-IR spectra bands with the database to find the most similar compounds.

* Outputs a report with informative graphs and tables in `*.pdf` indicating the five most similar compounds.

## Credits

- Baseline correction (Whittaker smoothing & airPLS) from [Z.-M. Zhang, S. Chen, and Y.-Z. Liang, 2010](https://doi.org/10.1039/B922045C).

## License

[MIT](./LICENSE) © Spectral Nexus

## Contact

- GitHub: [jgmotta98](https://github.com/jgmotta98)
- LinkedIn: [Jonathan Motta](https://www.linkedin.com/in/jonathan-motta/)