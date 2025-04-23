<h1 align="center">
  <br>
  <a href="https://jgmotta98.github.io/spectral-nexus/"><img src="doc/docs/assets/images/spectral-nexus-icon-thicker.png"/></a>
  <br>
  <b>Spectral Nexus</b>
  <br>
</h1>

[![forthebadge](https://forthebadge.com/images/badges/made-with-python.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

A tool for identifying chemical compounds through weighted analysis of FT-IR spectra. It compares user-supplied spectral data with a reference database and returns a `*.pdf` report of the five most similar compounds.

![spectral-nexus-use](https://github.com/user-attachments/assets/de50e3a8-7345-44bb-9391-f30f8062fe8a)

## Instalation

Clone the repository:
```sh
git clone https://github.com/jgmotta98/spectral-nexus.git
```

Install dependencies:
```sh
pip install -r requirements.txt
```

Run the `run_servers.bat` file:
```sh
\run_servers.bat
```

## Features

* Selective filtering of spectral bands based on user-defined parameters.

* Correlation of inputted FT-IR spectra bands with the database to find the most similar compounds.

* Provides a downloadable `*.pdf` report containing informative graphs and tables highlighting the five most similar compounds.

## Learn More

You can find more information and resources in the [complete documentation](https://jgmotta98.github.io/spectral-nexus/).

## Credits

- Baseline correction (Whittaker smoothing & airPLS) from [Z.-M. Zhang, S. Chen, and Y.-Z. Liang, 2010](https://doi.org/10.1039/B922045C).

## License

[MIT](./LICENSE) © Spectral Nexus
