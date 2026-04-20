import * as FileSystem from "expo-file-system/legacy";

const AUDIO_CACHE_DIR = `${FileSystem.cacheDirectory}audio_cries/`;

/**
 * Ensures the cache directory exists.
 */
async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
  }
}

/**
 * Gets a local URI for a remote audio file, downloading it if not already cached.
 * @param remoteUrl The URL of the audio file to cache.
 * @param fileName A unique filename for the cached file (e.g., "pikachu.mp3").
 * @returns The local URI of the cached audio file.
 */
export async function getCachedAudioUri(remoteUrl: string, fileName: string): Promise<string> {
  try {
    await ensureDirExists();

    const localUri = `${AUDIO_CACHE_DIR}${fileName}`;
    const fileInfo = await FileSystem.getInfoAsync(localUri);

    if (fileInfo.exists) {
      return localUri;
    }

    // Download the file if it doesn't exist locally
    const { uri } = await FileSystem.downloadAsync(remoteUrl, localUri);
    return uri;
  } catch (error) {
    console.error("Error caching audio:", error);
    return remoteUrl; // Fallback to remote URL if caching fails
  }
}
