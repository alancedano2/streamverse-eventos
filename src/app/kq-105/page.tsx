// src/app/kq-105/page.tsx
'use client'; 

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// =========================================================
// Tipos de datos
// =========================================================
interface SongHistoryItem {
  title: string;
  artist: string;
  cover: string;
}

// =========================================================
// CONFIGURACIÓN
// =========================================================
const M3U8_URL = "https://televicentro.streamguys1.com/wkaqfm/playlist.m3u8?key=96bc32e12ecb6b1bafd065de263d64235ff13cc93b57ff806196d3ecd0891325&aw_0_1st.playerId=kq105&source=kq105.com&us_privacy=1YNY&clientType=web&callLetters=WKAQ-FM&devicename=web-desktop&stationid=1846&dist=kq105.com&subscription_type=free&aw_0_1st.version=1.0_html5&aw_0_1st.playerid=kq105_floating_player";
const PLACEHOLDER_COVER = "/images/kq105/placeholder_cover.png";
const WKAQ_COVER = "/images/kq105/cover_wkaq.png";
// Ruta del logo grande para la cabecera (logokq.png)
const LOGO_KQ105_HEADER_URL = "/images/kq105/logokq.png"; 
// Ruta del logo pequeño (se mantiene para la metadata en caso de que no haya cover)
const LOGO_KQ105_PLAYER_URL = "/images/kq105/logo.png"; 

const LOCAL_STORAGE_KEY = "radioHistory";

// =========================================================
// UTILITIES
// =========================================================

// Función para buscar la portada
async function fetchAlbumCover(artist: string, title: string): Promise<string> {
    const query = encodeURIComponent(`${title} ${artist}`);
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
        cover: LOGO_KQ105_PLAYER_URL,
    });

    // Aunque ya no mostramos el historial, lo mantenemos internamente
    // para que la lógica de la radio pueda identificar la canción actual.
    const [history, setHistory] = useState<SongHistoryItem[]>([]); 

    const currentSongRef = useRef({ title: "", artist: "" });

    // Carga HLS.js y la lógica del reproductor
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Carga el historial al iniciar (manteniendo la lógica de localStorage
        // aunque no se muestre en el UI, ayuda al trackeo interno)
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
                        setIsPlaying(false); 
                    });
                });

                hls.on(Hls.Events.FRAG_CHANGED, async (event, data) => {
                    if (!data.frag.title) return;

                    const titleMatch = /title="([^"]*)"/.exec(data.frag.title);
                    const artistMatch = /artist="([^"]*)"/.exec(data.frag.title);

                    const title = titleMatch ? titleMatch[1] : "Título no disponible";
                    // CORRECCIÓN APLICADA: 'artistMatch[1]' en lugar de 'artist[1]'
                    const artist = artistMatch ? artistMatch[1] : "Artista no disponible"; 

                    if (title === currentSongRef.current.title && artist === currentSongRef.current.artist) return;
                    
                    currentSongRef.current = { title, artist };

                    const cover = 
                        title.includes("WKAQ-FM") || artist.includes("WKAQ-FM")
                            ? WKAQ_COVER
                            : await fetchAlbumCover(artist, title);

                    setMetadata({ title, artist, cover });

                    // Actualizar Historial (Solo para el localStorage/trackeo interno)
                    setHistory(prevHistory => {
                        const newSong = { title, artist, cover };
                        const updatedHistory = prevHistory.filter(s => !(s.title === title && s.artist === artist));
                        updatedHistory.unshift(newSong);
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory.slice(0, 15)));
                        return updatedHistory;
                    });
                });

                return () => hls.destroy();

            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                // Soporte nativo de iOS/Safari
                audio.src = M3U8_URL;
                audio.addEventListener('loadedmetadata', () => audio.play().catch(() => setIsPlaying(false)));
                setMetadata({ title: "Reproducción nativa.", artist: "Metadata no disponible.", cover: LOGO_KQ105_PLAYER_URL });
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-8 lg:p-12 relative overflow-hidden">
            
            {/* Efecto de brillo de fondo */}
            <div className="absolute inset-0 z-0 opacity-20" style={{background: 'radial-gradient(circle at 50% -20%, #f39c12, transparent 50%)'}}></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                
                {/* ENCABEZADO SUPERIOR: Logo KQ105 (logokq.png) y navegación */}
                <header className="flex justify-between items-center mb-12 gap-4 pb-4 border-b border-gray-700/50">
                    
                    {/* GRUPO IZQUIERDO: Logo KQ105 (logokq.png) */}
                    <div className="flex items-center gap-4"> 
                        <Link href="/"> 
                            <Image
                                src={LOGO_KQ105_HEADER_URL} 
                                alt="KQ105 Radio Logo"
                                width={180} // Ajusta el tamaño según necesites
                                height={60} // Ajusta el tamaño según necesites
                                className="object-contain" 
                            />
                        </Link>
                    </div>
                    
                    {/* GRUPO DERECHO: Navegación Rápida */}
                    <div className="flex items-center gap-4">
                        
                        {/* Enlace a Eventos */}
                        <Link
                            href="/eventos"
                            className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition duration-200 hidden sm:flex items-center gap-2 border border-gray-700/50 px-3 py-1 rounded-full hover:bg-gray-700/30"
                            title="Volver a los Eventos de Video"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.7V17.3a1 1 0 01-1.447.876L15 14m-2 2h-4V8h4m2 0V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h9a2 2 0 002-2v-2" /></svg>
                            Eventos
                        </Link>
                        
                        {/* Enlace a Status */}
                        <Link
                            href="/status"
                            className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition duration-200 hidden sm:flex items-center gap-2 border border-gray-700/50 px-3 py-1 rounded-full hover:bg-gray-700/30"
                            title="Ver el estado de los servidores y streams"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Estado
                        </Link>
                    </div>
                </header>

                {/* CONTENEDOR CENTRAL DEL REPRODUCTOR */}
                <div className="flex justify-center items-start pt-10">
                    <div className="bg-[#34495e] rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-5 border border-gray-700">
                        
                        {/* Encabezado interno con texto "KQ105 La Primera #1" */}
                        <div className="flex flex-col items-center mb-4">
                            <h2 className="text-3xl font-bold text-amber-400 text-center">
                                KQ105 La Primera #1
                            </h2>
                        </div>

                        {/* Audio Element (Oculto) */}
                        <audio ref={audioRef} id="radioPlayer" className="hidden" />
                        
                        {/* Info de la Canción Actual */}
                        <div id="currentSongInfo" className="flex items-center bg-gray-700/50 rounded-lg p-4 shadow-inner gap-4 min-h-[100px]">
                            <Image 
                                id="albumCover" 
                                src={metadata.cover} 
                                alt="Cover" 
                                width={80} 
                                height={80} 
                                className="rounded-lg object-cover shadow-md flex-shrink-0"
                            />
                            <div id="metadataBox" className="flex-grow text-left overflow-hidden">
                                <span className="title font-bold text-xl block mb-1 text-white truncate">{metadata.title}</span>
                                <span className="artist italic text-lg text-gray-300 truncate">{metadata.artist}</span>
                            </div>
                        </div>

                        {/* Custom Audio Player (Controles de reproducción y volumen) */}
                        <div className="flex items-center bg-[#2c3e50] rounded-full p-3 shadow-inner w-full box-border">
                            
                            {/* Botón Play/Pause */}
                            <button 
                                id="playPauseBtn" 
                                onClick={togglePlayPause} 
                                className={`w-12 h-12 rounded-full mr-4 transition duration-200 flex items-center justify-center ${isPlaying ? 'bg-[#f1c40f]' : 'bg-[#f39c12]'}`}
                            >
                                <svg className={`w-6 h-6 ${isPlaying ? 'hidden' : 'block'}`} viewBox="0 0 24 24" fill="#2c3e50"><path d="M8 5.14v14l11-7-11-7z"/></svg>
                                <svg className={`w-6 h-6 ${isPlaying ? 'block' : 'hidden'}`} viewBox="0 0 24 24" fill="#2c3e50"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
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
                                    className="w-24 h-1 bg-[#4a657c] rounded-full ml-3 appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* EL HISTORIAL DE CANCIONES HA SIDO REMOVIDO COMPLETAMENTE */}
                    </div>
                </div>

            </div>
        </div>
    );
}
