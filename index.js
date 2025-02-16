function startTracking(userConfig = {}) {
    // Merge default config with user config
    const config = {
        dataLayerName: 'dataLayer',
        scrollThresholds: [25, 50, 75, 100],
        scrollDirection: ['vertical', 'horizontal'],
        internalDomains: [],
        downloadExtensions: [
            "pdf", "xls", "xlsx", "doc", "docx", "txt", "rtf", "csv", "exe", 
            "key", "pps", "ppt", "pptx", "7z", "pkg", "rar", "gz", "zip", 
            "avi", "mov", "mp4", "mpeg", "mpg", "wmv", "midi", "mp3", 
            "wav", "wma"
          ],
        videoEvents: ['play', 'pause', 'ended', 'progress'],
        progressPercentage: [10, 25, 50, 75, 90, 100],
        youtube : true,
        youtubeEvents: ['ytplay', 'ytpause', 'ytended', 'ytprogress'],
        ytprogressPercentage: [10, 25, 50, 75, 90, 100],
        debounceTime: 100,
        ...userConfig // Override with user's config
    };

    const dataLayer = window[config.dataLayerName] = window[config.dataLayerName] || [];
    let scrollTracker = config.scrollThresholds.reduce((acc, threshold) => {
        acc[threshold] = { vertical: false, horizontal: false };
        return acc;
    }, {});
    
    let lastPos = { vertical: window.scrollY, horizontal: window.scrollX };

    const pushEvent = (type, details) => {
        dataLayer.push({
            event: `custom_${type}`,
            ...details
        });
    };
    const throttle = (fn, wait) => {
        let last = 0;
        return (...args) => {
            const now = Date.now();
            if (now - last >= wait) {
                fn(...args);
                last = now;
            }
        };
    };
    const resetScrollTracker = () => {
        scrollTracker = config.scrollThresholds.reduce((acc, threshold) => {
          acc[threshold] = { vertical: false, horizontal: false };
          return acc;
        }, {});
      };

    const handleClick = function (event) {
        const link = event.target.closest('a');
        if (!link) return;
      
        try {
          const url = new URL(link.href, window.location.href);
          const text = link.innerText || "";
      
          const internalDomains = config?.internalDomains || [];
          const downloadExtensions = config?.downloadExtensions || [];
      
          let isDownload = false;
      
          // Process download event only if downloadExtensions is not empty
          if (downloadExtensions.length > 0) {
            const pathParts = url.pathname.split('/');
            const fileName = pathParts.pop() || '';
            const fileParts = fileName.split('.');
            const fileExtension = fileParts.length > 1 ? fileParts.pop().toLowerCase() : '';
      
            if (downloadExtensions.includes(fileExtension)) {
              isDownload = true;
              const eventDetails = {
                event: 'file_download',
                link_url: url.href,
                link_domain: url.hostname,
                file_name: fileName,
                file_extension: fileExtension
              }
              if (text.trim()) {
                eventDetails.link_text = text;
              }

      
              dataLayer.push(eventDetails);
            }
          }
           if ( !isDownload && internalDomains.length > 0) {
            let isInternal = false;
            for (let i = 0; i < internalDomains.length; i++) {
              const domain = internalDomains[i];
              const domainRegex = new RegExp(`(^|\\.)${domain.replace(/\./g, '\\.')}$`, 'i');
              if (domainRegex.test(url.hostname)) {
                isInternal = true;
                break;
              }
            }
            const isOutbound = !isInternal;
            if (isOutbound) {
                const eventDetailsforoutbound = {
                  event: 'click',
                  link_url: url.href,
                  link_domain: url.hostname,
                  is_outbound: isOutbound,
                };
                if (text.trim()) {
                  eventDetailsforoutbound.link_text = text;
                }
              dataLayer.push(eventDetailsforoutbound);
            }
          }
        } catch (error) {
          console.error('Error in handleClick:', error);
        }
      };
    let lastVerticalPageSize = document.documentElement.scrollHeight;  
    const handleScroll = throttle(() => {
        const trackScroll = (direction) => {
            const axis = direction === 'vertical' ? 'Y' : 'X';
            const currentPos = window[`scroll${axis}`];
            const viewportSize = direction === 'vertical' ? window.innerHeight : window.innerWidth;
            const pageSize = direction === 'vertical' 
                ? document.documentElement.scrollHeight 
                : document.documentElement.scrollWidth;
            if (direction === 'vertical' && pageSize !== lastVerticalPageSize) {
                lastVerticalPageSize = pageSize;
                return;
                }    

            const maxScroll = Math.max(pageSize - viewportSize, 0);
            const percentage = maxScroll > 0 ? (currentPos / maxScroll) * 100 : 0;
            
            if (currentPos > lastPos[direction]) {
                config.scrollThresholds.forEach(threshold => {
                    if (percentage >= threshold && !scrollTracker[threshold][direction] ) {
                        scrollTracker[threshold][direction] = true;
                        pushEvent('scroll', {
                            percent_scrolled: threshold,
                            direction
                        });
                    }
                });
            }
            lastPos[direction] = currentPos;        
            
            if (direction === 'vertical') {
                lastVerticalPageSize = pageSize;
              }
        };

        config.scrollDirection.forEach(trackScroll);
    }, config.debounceTime);

    const handleVideoEvents = function (event) {
      const video = event.target;
      if (!video.duration) return;
    
      const dataLayer = window[config.dataLayerName];
      const videoData = {
        videoProvider: 'html5',
        videoTitle: video.title || video.getAttribute('title') || video.getAttribute('data-title') || video.getAttribute('aria-label') || "no-title",
        videoUrl: video.src || video.currentSrc,
        videoDuration: Math.floor(video.duration),
        videoCurrentTime: Math.floor(video.currentTime)
      };
    
      switch (event.type) {
        case 'play':
          // Track video start only once per video instance
          if (video._trackedStart) return;
          video._trackedStart = true;
          dataLayer.push({
            event: 'video_start',
            ...videoData
          });
          break;
        case 'pause':
          dataLayer.push({
            event: 'video_pause',
            ...videoData
          });
          break;
        case 'ended':
          dataLayer.push({
            event: 'video_complete',
            ...videoData
          });
          break;
        case 'timeupdate':
          if (video.currentTime === video.duration) return;
          video_percent = Math.floor((video.currentTime / video.duration) * 100);
    
          // Track progress thresholds only once per video instance
          if (!video._trackedProgress) {
            video._trackedProgress = new Set();
          }
          config.progressPercentage.forEach(percent => {
            if (
              video_percent >= percent &&
              !video._trackedProgress.has(percent)
            ) {
              video._trackedProgress.add(percent);
              dataLayer.push({
                event: 'video_progress',
                video_percent: percent,
                ...videoData
              });
            }
          });
          break;
      }
    };

    function handelyoutube() {


      // Load the YouTube IFrame API
      var tag = document.createElement('script');
      tag.type = "text/javascript";
      tag.async = true;
      tag.src = document.location.protocol + "//www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
      // Select all YouTube iframes and update their src to enable JS API
      var youtubeIframes = Array.from(document.querySelectorAll('iframe'))
        .filter(iframe => iframe.src.includes('youtube'));
        
      youtubeIframes.forEach(iframe => {
        if (iframe.src.indexOf('?') > -1) {
          iframe.src += '&enablejsapi=1';
        } else {
          iframe.src += '?enablejsapi=1';
        }
      });
    
      // Store players for each iframe
      var players = [];
    
      // This callback gets called once the YouTube API is ready.
      window.onYouTubeIframeAPIReady = function() {
        youtubeIframes.forEach(iframe => {
          // Create a new player using the iframe element directly.
          var player = new YT.Player(iframe, {
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
    
          // Attach tracking variables to the player object.
          player.video_started = false;
          player.video_playing = false;
          player.progressInterval = null;
          player.tracked_percent = new Set();
    
          players.push(player);
        });
      };
    
      function onPlayerReady(event) {
        console.log("Player is ready");
      }
    
      function onPlayerStateChange(event) {
        var player = event.target;
        var videoData = player.getVideoData();
        var videoTitle = videoData.title;
        var currentTime = Math.floor(player.getCurrentTime());
        var duration = Math.floor(player.getDuration());
        var videoPercent = duration ? Math.floor((currentTime / duration) * 100) : 0;
    
        if (event.data === YT.PlayerState.PLAYING && config.youtubeEvents.includes('ytplay')) {
          if (!player.video_started) {
            player.video_started = true;
            dataLayer.push({
              'event': "video_start",
              'video_title': videoTitle,
              'video_url': player.getVideoUrl(),
              'video_current_time': currentTime,
              'video_duration': duration,
              'video_provider': "youtube"
            });
          }
          player.video_playing = true;
          if (!player.progressInterval) {
            player.progressInterval = setInterval(() => checkProgress(player), 500);
          }
        } else if (event.data === YT.PlayerState.PAUSED && config.youtubeEvents.includes('ytpause')) {
          player.video_playing = false;
          clearInterval(player.progressInterval);
          player.progressInterval = null;
          dataLayer.push({
            'event': "video_pause",
            'video_title': videoTitle,
            'video_url': player.getVideoUrl(),
            'video_current_time': currentTime,
            'video_duration': duration,
            'video_percent': videoPercent,
            'video_provider': "youtube"
          });
        } else if (event.data === YT.PlayerState.ENDED && config.youtubeEvents.includes('ytcomplete')) {
          player.video_playing = false;
          clearInterval(player.progressInterval);
          player.progressInterval = null;
          dataLayer.push({
            'event': "video_complete",
            'video_title': videoTitle,
            'video_url': player.getVideoUrl(),
            'video_current_time': currentTime,
            'video_duration': duration,
            'video_provider': "youtube"
          });
          console.log("ended");
        }
      }
    
      function checkProgress(player) {
        if (!player.video_playing) return;
        var currentTime = player.getCurrentTime();
        var duration = player.getDuration();
        if (!duration) return;
        var youtube_video_percent = Math.floor((currentTime / duration) * 100);
    
        config.ytprogressPercentage.forEach(percent => {
          if (youtube_video_percent >= percent && !player.tracked_percent.has(percent) && config.youtubeEvents.includes('ytprogress')) {
            player.tracked_percent.add(percent);
            dataLayer.push({
              'event': "video_progress",
              'video_title': player.getVideoData().title,
              'video_url': player.getVideoUrl(),
              'video_current_time': Math.floor(currentTime),
              'video_duration': Math.floor(duration),
              'video_percent': youtube_video_percent,
              'video_provider': "youtube"
            });
          }
        });
      }
    }
    
    

  
    // handel click event
    document.addEventListener('click', handleClick);
    // handle scroll event
    window.addEventListener('scroll', handleScroll, { passive: true });

    window.addEventListener("popstate", ()=> {
        resetScrollTracker();
        handleScroll();
    });
    window.addEventListener("hashchange", () => {
        resetScrollTracker();
        handleScroll();
    });

    if (history.pushState) {
        const originalPushState = history.pushState;
        history.pushState = function () {
          originalPushState.apply(this, arguments);
          resetScrollTracker();
          handleScroll();
        };
      } else if (history.replaceState) {
        const originalReplaceState = history.replaceState;
        history.replaceState = function () {
          originalReplaceState.apply(this, arguments);
          resetScrollTracker();
          handleScroll();
        };
      }
      // handle HTML5 video events
    document.querySelectorAll('video').forEach(video => {
      config.videoEvents.forEach(evt => {
        video.addEventListener(evt, handleVideoEvents);
      });
    });
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() === 'video') {
              config.videoEvents.forEach(evt => {
                node.addEventListener(evt, handleVideoEvents);
              });
            } else {
              node.querySelectorAll('video').forEach(video => {
                config.videoEvents.forEach(evt => {
                  video.addEventListener(evt, handleVideoEvents);
                });
              });
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // handle youtube video events
    if (config.youtube === true) {
      handelyoutube();
    }

    console.log('Tracking started with config:', config);
}