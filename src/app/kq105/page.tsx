// src/app/kq-105/page.tsx
'use client'; // Necesario para usar Hooks y HLS.js

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

// =========================================================
// Tipos de datos para el historial
// =========================================================
interface SongHistoryItem {
  title: string;
  artist: string;
  cover: string;
}

// =========================================================
// CONFIGURACIÓN (Mantenemos las URLs y Constantes aquí)
// =========================================================
const M3U8_URL = "https://televicentro.streamguys1.com/wkaqfm/playlist.m3u8?key=96bc32e12ecb6b1bafd065de263d64235ff13cc93b57ff806196d3ecd0891325&aw_0_1st.playerId=kq105&source=kq105.com&us_privacy=1YNY&clientType=web&callLetters=WKAQ-FM&devicename=web-desktop&stationid=1846&dist=kq105.com&subscription_type=free&aw_0_1st.version=1.0_html5&aw_0_1st.playerid=kq105_floating_player";
const PLACEHOLDER_COVER = "/images/kq105/placeholder_cover.png";
const WKAQ_COVER = "/images/kq105/cover_wkaq.png";
const LOGO_URL = "/images/kq105/logo.png";
const LOCAL_STORAGE_KEY = "radioHistory";

// =========================================================
// UTILITIES
// =========================================================

// Función para descargar el historial como .txt
function downloadHistoryAsTxt(history: SongHistoryItem[]) {
  // ... (Implementación del helper de descarga, omitido por brevedad, pero puedes usar el de tu código JS)
    if (history.length === 0) {
        alert("No hay historial para descargar.");
        return;
    }

    let text = `Historial de Canciones - KQ105\nGenerado: ${new Date().toLocaleString()}\n\n`;
    history.forEach(s => text += `${s.artist} - ${s.title}\n`);

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "historial_kq105.txt";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función para buscar la portada (usando proxy o Fetch)
async function fetchAlbumCover(artist: string, title: string): Promise<string> {
    const query = encodeURIComponent(`${title} ${artist}`);
    // Usar un proxy si iTunes bloquea peticiones CORS. Por ahora, usamos el directo.
    const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results?.length > 0) {
            return data.results[0].artworkUrl100.replace("100x100bb", "600x600bb");
        }
    } catch (e) {
        console.error("Error al buscar cover:", e);
    }
    return PLACEHOLDER_COVER;
}

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================

export default function KQ105Page() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [metadata, setMetadata] = useState<{ title: string; artist: string; cover: string }>({
        title: "Sintonizando...",
        artist: "KQ105",
        cover: LOGO_URL,
    });
    const [history, setHistory] = useState<SongHistoryItem[]>([]);

    const currentSongRef = useRef({ title: "", artist: "" });

    // Carga HLS.js y la lógica del reproductor
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Carga el historial al iniciar
        const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch {}
        }

        // Importación dinámica de HLS.js
        import('hls.js').then(({ default: Hls }) => {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(M3U8_URL);
                hls.attachMedia(audio);

                hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    audio.volume = volume;
                    audio.play().catch(() => {
                        // El navegador bloqueó la reproducción automática, esperamos interacción
                        setIsPlaying(false); 
                    });
                });

                hls.on(Hls.Events.FRAG_CHANGED, async (event, data) => {
                    if (!data.frag.title) return;

                    const titleMatch = /title="([^"]*)"/.exec(data.frag.title);
                    const artistMatch = /artist="([^"]*)"/.exec(data.frag.title);

                    const title = titleMatch ? titleMatch[1] : "Título no disponible";
                    const artist = artistMatch ? artistMatch[1] : "Artista no disponible";

                    if (title === currentSongRef.current.title && artist === currentSongRef.current.artist) return;
                    
                    currentSongRef.current = { title, artist };

                    let cover =
                        title.includes("WKAQ-FM") || artist.includes("WKAQ-FM")
                            ? WKAQ_COVER
                            : await fetchAlbumCover(artist, title);

                    setMetadata({ title, artist, cover });

                    // Actualizar Historial
                    setHistory(prevHistory => {
                        const newSong = { title, artist, cover };
                        const updatedHistory = prevHistory.filter(s => !(s.title === title && s.artist === artist));
                        updatedHistory.unshift(newSong);
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory.slice(0, 15))); // Limitar a 15 items
                        return updatedHistory;
                    });
                });

                return () => hls.destroy();

            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                // Soporte nativo de iOS/Safari
                audio.src = M3U8_URL;
                audio.addEventListener('loadedmetadata', () => audio.play().catch(() => setIsPlaying(false)));
                setMetadata({ title: "Reproducción nativa.", artist: "Metadata no disponible.", cover: LOGO_URL });
            }
        });

        // Eventos del Audio Element
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleVolumeChange = () => {
            setIsMuted(audio.muted || audio.volume === 0);
            setVolume(audio.volume);
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('volumechange', handleVolumeChange);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('volumechange', handleVolumeChange);
        };
    }, [volume]);


    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            isPlaying ? audio.pause() : audio.play();
        }
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.muted = !audio.muted;
            setIsMuted(audio.muted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        const audio = audioRef.current;
        if (audio) {
            audio.volume = newVolume;
            audio.muted = newVolume === 0;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#2c3e50] text-[#ecf0f1] p-5">
            <div className="bg-[#34495e] rounded-xl shadow-2xl p-8 w-11/12 max-w-lg flex flex-col gap-5">
                
                {/* Header */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#e74c3c] rounded-xl p-4 mb-4 shadow-lg">
                        <Image 
                            src={LOGO_URL} 
                            alt="Logo de KQ105" 
                            width={100} 
                            height={100} 
                            className="block"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-5">KQ105</h1>
                </div>

                {/* Audio Element (Oculto) */}
                <audio ref={audioRef} id="radioPlayer" className="hidden" />

                {/* Custom Audio Player */}
                <div className="flex items-center bg-[#2c3e50] rounded-full p-3 shadow-inner w-full box-border">
                    
                    {/* Botón Play/Pause */}
                    <button 
                        id="playPauseBtn" 
                        onClick={togglePlayPause} 
                        className={`w-10 h-10 rounded-full mr-4 transition duration-200 flex items-center justify-center ${isPlaying ? 'bg-[#f1c40f]' : 'bg-[#f39c12]'}`}
                    >
                        <svg className={`w-5 h-5 ${isPlaying ? 'hidden' : 'block'}`} viewBox="0 0 24 24" fill="#2c3e50"><path d="M8 5.14v14l11-7-11-7z"/></svg>
                        <svg className={`w-5 h-5 ${isPlaying ? 'block' : 'hidden'}`} viewBox="0 0 24 24" fill="#2c3e50"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>

                    {/* Controles de Volumen */}
                    <div className="flex items-center ml-auto">
                        <button id="volumeBtn" onClick={toggleMute} className="flex items-center text-white">
                            <svg className={`w-7 h-7 fill-current transition duration-200 ${isMuted ? 'hidden' : 'block'}`} viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                            <svg className={`w-7 h-7 fill-current transition duration-200 ${isMuted ? 'block' : 'hidden'}`} viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zM5 9v6h4l5 5V4L9 9H5z"/></svg>
                        </button>
                        <input 
                            type="range" 
                            id="volumeSlider" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume} 
                            onChange={handleVolumeChange}
                            className="w-24 h-1 bg-[#4a657c] rounded-full ml-3 appearance-none cursor-pointer range-lg"
                            style={{ '--tw-range-thumb-color': '#f39c12' } as React.CSSProperties} // Custom style para el thumb
                        />
                    </div>
                </div>

                {/* Info de la Canción Actual */}
                <div id="currentSongInfo" className="flex items-center bg-[#2c3e50] rounded-lg p-4 shadow-inner gap-4 min-h-[100px]">
                    <Image 
                        id="albumCover" 
                        src={metadata.cover} 
                        alt="Cover" 
                        width={70} 
                        height={70} 
                        className="rounded-lg object-cover shadow-md flex-shrink-0"
                    />
                    <div id="metadataBox" className="flex-grow text-left overflow-hidden">
                        <span className="title font-bold text-xl block mb-1 text-[#f39c12] truncate">{metadata.title}</span>
                        <span className="artist italic text-lg text-[#bdc3c7] truncate">{metadata.artist}</span>
                    </div>
                </div>

                {/* Historial de Canciones */}
                <div id="songHistory" className="bg-[#2c3e50] rounded-lg p-4 shadow-inner max-h-64 overflow-y-auto text-left">
                    <h4 className="m-0 mb-3 text-[#f39c12] border-b border-white/10 pb-1 font-semibold">Historial Reciente</h4>
                    {history.length === 0 ? (
                        <p className="text-sm text-[#bdc3c7]">Cargando historial o no hay canciones todavía.</p>
                    ) : (
                        history.map((song, index) => (
                            <div key={index} className="flex items-center mb-3 gap-3">
                                <Image src={song.cover} alt="cover" width={40} height={40} className="rounded-md object-cover" />
                                <div>
                                    <span className="history-item-title font-semibold text-sm block text-white">{song.title}</span>
                                    <span className="history-item-artist text-xs text-[#bdc3c7] block">{song.artist}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Botón de Descarga */}
                <button 
                    onClick={() => downloadHistoryAsTxt(history)}
                    className="bg-[#f39c12] border-none rounded-lg text-[#2c3e50] font-bold py-3 text-lg cursor-pointer transition duration-200 hover:bg-[#f1c40f] hover:shadow-lg hover:shadow-amber-500/30 w-full"
                >
                    Descargar Historial (.txt)
                </button>
            </div>
        </div>
    );
}
