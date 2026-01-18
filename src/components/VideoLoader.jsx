import React from 'react';
import loadingVideo from '../assets/loading-video.mp4';

const VideoLoader = ({ fullScreen = false }) => {
    return (
        <div className={`flex justify-center items-center ${fullScreen ? 'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm' : 'w-full py-12'}`}>
            <video
                src={loadingVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-32 h-32 object-contain rounded-full shadow-lg shadow-purple-500/20"
            />
        </div>
    );
};

export default VideoLoader;
