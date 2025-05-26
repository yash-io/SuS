# SuS – Smart URL Shortener

SuS is a smart, modern URL shortener built with **React**, **Vite**, and **Firebase**. It allows users to shorten valid URLs, with built-in URL validation to ensure only legitimate links are accepted. SuS also supports custom short codes, letting users easily create memorable, branded short links.

## Features

- **Smart URL shortening** with real-time validation
- **Custom short codes**: Choose your own short link name
- **Firebase backend** for fast, reliable storage and redirection
- **Modern React UI powered by Vite** for a seamless, lightning-fast experience

## Demo

Try it live: [https://s-us.vercel.app](https://s-us.vercel.app)


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) & npm
- [Firebase account](https://firebase.google.com/)
- (Optional) [Yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yash-io/SuS.git
    cd sus
    ```

2. **Install dependencies:**
    ```sh
    npm install
    # or
    yarn
    ```

3. **Configure Firebase:**
    - Create a Firebase project.
    - Set up Firestore and Authentication as needed.
    - Copy your Firebase config snippet into a `.env` file or your config file as required by your codebase.

4. **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```

5. **Visit** [http://localhost:5173](http://localhost:5173) (default Vite port) to use SuS locally.

## Usage

1. **Enter a valid URL** in the input field.
2. *(Optional)* Enter a custom short code (e.g., `my-brand`).
3. **Click "Shorten"** to generate your smart short link.
4. **Share the generated link** – anyone visiting it will be redirected to your original URL.

## Tech Stack

- **Frontend:** React, Vite, JavaScript, TailwindCSS
- **Backend:** Firebase (Firestore/Realtime Database, Hosting)


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[MIT](LICENSE)

---

**Author:** [Your Name](https://github.com/yash-io)  
