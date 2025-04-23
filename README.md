<h1 align="center">
  <br>
  <a href="https://jgmotta98.github.io/spectral-nexus/"><img src="doc/docs/assets/images/spectral-nexus-icon-thicker.png"/></a>
  <br>
  Spectral Nexus
  <br>
</h1>

[![forthebadge](https://forthebadge.com/images/badges/made-with-python.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

A tool for identifying chemical compounds through weighted analysis of FT-IR spectra. It compares user-supplied spectral data with a reference database and returns a `*.pdf` report of the five most similar compounds.

![screenshot](https://github-production-user-asset-6210df.s3.amazonaws.com/90492274/436364605-e5d27941-9f70-4eb0-bc04-bb519e6258af.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250423%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250423T045100Z&X-Amz-Expires=300&X-Amz-Signature=c6ea305e122d070a6f1f5dbffc94d94731a80118570f96a91d7fdafc36ce169c&X-Amz-SignedHeaders=host)

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