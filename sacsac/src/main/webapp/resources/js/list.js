 function togglePlay(soundId) {
        for (var id in waveSurfers) {
            if (waveSurfers.hasOwnProperty(id) && id !== soundId) {
                waveSurfers[id].pause();
                waveSurfers[id].seekTo(0);
                var otherPlayBtn = document.getElementById('play-btn-' + id);
                if (otherPlayBtn) {
                    otherPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            }
        }

        var playBtn = document.getElementById('play-btn-' + soundId);
        var wavesurfer = waveSurfers[soundId];
        if (wavesurfer) {
            if (wavesurfer.isPlaying()) {
                wavesurfer.pause();
                if (playBtn) {
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
                currentPlayingId = null;
                lastStoppedId = soundId;
            } else {
                wavesurfer.play();
                if (playBtn) {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }
                currentPlayingId = soundId;
                lastStoppedId = null;
            }
        }
    }

    function downloadAudio(filename, soundId, cateCode) {
        var link = document.createElement('a');
        link.href = '/display2?fileName=' + filename + '&codeCate=' + cateCode;
        link.download = filename.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        $.ajax({
            type: "POST",
            url: "/increaseDownloadCount",
            data: { soundId: soundId },
            success: function(response) {
                console.log("다운로드 카운트 증가 완료");
            },
            error: function(error) {
                console.error("다운로드 카운트 증가 에러 발생:", error);
            }
        });
    }