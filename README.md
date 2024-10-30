## How To Run

Using NodeJS

First, install dependencies
```bash
npm i
```

Next, create a `.env` in the root of this project and add a GCP API Key with access to [https://console.cloud.google.com/marketplace/product/google/language.googleapis.com](Natural Language processing).
```bash
API_KEY=YOUR-KEY-HERE
```

Lastly, run the development server:
```bash
npm run dev
```
If you do not have a key, you can use the deployment on vercel. [https://jetbrains-visualization-of-survey-data-task.vercel.app/](https://jetbrains-visualization-of-survey-data-task.vercel.app/)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
