# Mind Music Walks

A local-first, voice-led walking companion for India. Choose a mood, duration, and sound; receive a gentle guide; put the phone away and take a short outdoor reset.

## Run locally

Requires Node.js 20 or later. The base experience has no package dependencies.

```sh
npm start
```

Open <http://127.0.0.1:4173>. To personalize guides with an open-weight model, install [Ollama](https://ollama.com/) and Gemma 3 1B, then start its local service:

```sh
ollama pull gemma3:4b
ollama serve
```

Restart Mind Music Walks. The app connects only to Ollama on the same device. If Ollama is unavailable, the app uses its bundled authored guides and clearly labels them as offline guides.

## What works

- Four mood paths, four walk lengths, an optional generated ambient music bed or nature sounds, and English/Hindi spoken prompts. Hindi prompts are locally authored; English guides can be personalized by Gemma as the walk starts.
- Voice synthesis and gentle ambient sound through browser audio; pause, resume, replay, and stop controls.
- Optional private reflection notes stored in browser local storage.
- Installable app shell with offline caching after the first visit. Local Gemma inference requires Ollama and the model to be present.
- No accounts, analytics, remote model calls, or saved mood check-ins.

## Privacy and care

Mood is sent only to the local Node app, which passes a short guide request to local Ollama if configured. Mood is not persisted. Reflection notes stay in the browser's local storage and can be removed by clearing site data. This is a wellness companion, not mental-health treatment. Keep awareness of traffic and surroundings during a walk; audio playback may be interrupted by browser or phone settings.

## Challenge categories

Challenge details: [Hacktoberfest Open-Source AI Challenge: Week 1](https://dev.to/events/79). Entries close October 11 at 11:59 p.m. PDT.

- **Best Use of Gemma** is the relevant category when the entry demonstrates Ollama running Gemma locally to create an English walk guide. Hindi guides use authored text for language quality; bundled offline guides are not AI inference.
- **Best Use of ElevenLabs** would need real ElevenLabs narration or transcription; this build uses the device's built-in speech synthesis, so do not claim that category.
- **Best Use of Render** would need an actual Render deployment or AI runtime; do not claim it for the local build.
- The project is eligible for the overall Week 1 theme as an outdoor, open-model-powered audio walk, with a field-test video and honest model availability evidence strengthening the entry.

## License

MIT. See [LICENSE](LICENSE).
