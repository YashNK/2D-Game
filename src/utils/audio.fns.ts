import Coin from "../assets/sounds/coin.mp3";
import Game from "../assets/sounds/game.mp3";
import { AudioSounds } from "../constants";

class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private muted: boolean = true;
  private backgroundMusic: HTMLAudioElement | null = null;
  private backgroundMusicPlaying: boolean = false;

  constructor() {
    this.preloadSounds();
  }

  private preloadSounds(): void {
    this.loadSound(AudioSounds.COIN, Coin);
    this.loadSound(AudioSounds.GAME, Game);
  }

  private loadSound(name: string, path: string): void {
    const audio = new Audio(path);
    audio.preload = "auto";
    this.sounds.set(name, audio);
    if (name === AudioSounds.GAME) {
      this.backgroundMusic = audio;
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3;
    }
  }

  public play(name: string): void {
    if (this.muted) return;
    const sound = this.sounds.get(name);
    if (!sound) {
      return;
    }
    if (name === AudioSounds.GAME && this.backgroundMusic) {
      if (!this.backgroundMusicPlaying) {
        this.backgroundMusic.currentTime = 0;
        this.backgroundMusic
          .play()
          .then(() => {
            this.backgroundMusicPlaying = true;
          })
          .catch((error) => {
            console.error("Error playing background music:", error);
            this.backgroundMusicPlaying = false;
          });
      }
    } else {
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.05;
      soundClone
        .play()
        .catch((error) =>
          console.error(`Error playing sound "${name}":`, error)
        );
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.sounds.forEach((sound) => {
        if (!sound.paused) {
          sound.pause();
        }
      });
      this.backgroundMusicPlaying = false;
    } else {
      if (this.backgroundMusic) {
        this.backgroundMusic
          .play()
          .then(() => {
            this.backgroundMusicPlaying = true;
          })
          .catch((error) => {
            console.error("Error resuming background music:", error);
            this.backgroundMusicPlaying = false;
          });
      }
    }

    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
      this.backgroundMusicPlaying = false;
    }
  }
}

export const audioManager = new AudioManager();
