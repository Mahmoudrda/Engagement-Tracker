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
        videoEvents: ['play', 'pause', 'ended', 'timeupdate'],
        progressPercentage: [10, 25, 50, 75, 90, 100],
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

  
    
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.querySelectorAll('video').forEach(video => {
      config.videoEvents.forEach(evt => {
        video.addEventListener(evt, handleVideoEvents);
      });
    });
    

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

    console.log('Tracking started with config:', config);
}