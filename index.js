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
        formSelectors: ['test-selector'],  
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
                  eventDetails.link_text = text;
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
    for (let f = 0; f < config.formSelectors.length; f++) {
        const formSelector = config.formSelectors[f];
        const form = document.querySelector(formSelector);
        if (!form) {
        console.error("Form not found");
        continue;
        }
        const formMeta = {
        id: form.id || "no-id",
        name: form.getAttribute('name') || "no-name",
        destination: form.action || "no-action"
        };

        let formFocused = false;
        let formSubmitted = false;


        const handleFormStart = () => {
        if (!formFocused) {
            formFocused = true;
            dataLayer.push({
            event: 'form_start',
            form_id: formMeta.id,
            form_name: formMeta.name,
            form_destination: formMeta.destination
            });
        }
        };

        const handleFormError = (event) => {
        const errorFields = form.querySelectorAll('.error');
        let errors = '';
        
        errorFields.forEach((errorField) => {
            const errorFieldId = (errorField.previousElementSibling && errorField.previousElementSibling.id) || "unknown-field";
            errors += `${errorFieldId}-`;
        });

        dataLayer.push({
            event: 'form_error',
            form_id: formMeta.id,
            form_name: formMeta.name,
            form_destination: formMeta.destination,
            form_field: errors,
            error_message: errorFields[0] ? errorFields[0].innerHTML : ''
        });
        
        };

        const handleFormSubmit = (event) => {
        const errorFields = form.querySelectorAll('.error');
        
        if (errorFields.length === 0) {
            formSubmitted = true;
            dataLayer.push({
            event: 'form_submit',
            form_id: formMeta.id,
            form_name: formMeta.name,
            form_destination: formMeta.destination
            });
        } else {
            handleFormError(event);
        }
        };

        const handleFormAbandon = () => {
        if (formFocused && !formSubmitted) {
            dataLayer.push({
            event: 'form_abandon',
            form_id: formMeta.id,
            form_name: formMeta.name,
            form_destination: formMeta.destination
            });
        }
        };
        form.addEventListener('focusin', handleFormStart);
        form.addEventListener('submit', handleFormSubmit);
        window.addEventListener('beforeunload', handleFormAbandon);

        }
    
    document.addEventListener('click', handleClick);
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

    console.log('Tracking started with config:', config);
}