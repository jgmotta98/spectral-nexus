# Setup Guide

## Prerequisites

Ensure your system has the following installed:

* [Python 3.10+](https://www.python.org/downloads/)
* [Node.js (v18+)](https://nodejs.org/)
* [pip](https://pip.pypa.io/en/stable/)
* [Git](https://git-scm.com/)

---

## Cloning the Project

Clone the repository to your local machine:
```bash 
git clone https://github.com/jgmotta98/spectral-nexus.git
cd src
```

---

## Creating a Virtual Enviroment


Create and activate a virtual environment:

=== "Windows"

    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```

=== "Linux/macOS"

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

---

## Installing Dependencies

Install dependencies listed in requirements.txt:

```py
pip install -r requirements.txt
```

---

## Running on Windows

To start both the backend and frontend servers simultaneously on Windows, simply run the provided batch file:
```bash
./run_servers.bat
```

---

## Running on macOS / Linux

Give the `.sh` file execute permission:

```bash
chmod +x run_servers.sh
```

Then run it:

```bash
./run_servers.sh
```