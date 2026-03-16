// Lightweight Analytics Tracking Library
// Under 5KB, async, with offline queue support

interface AnalyticsEvent {
  eventName: string;
  metadata?: Record<string, any>;
  pagePath: string;
  timestamp: number;
}

interface QueuedEvent extends AnalyticsEvent {
  retryCount?: number;
}

class Analytics {
  private sessionId: string;
  private queue: QueuedEvent[] = [];
  private isOnline: boolean = navigator.onLine;
  private retryAttempts = 3;
  private maxQueueSize = 50;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.setupEventListeners();
    this.setupOnlineListener();
    this.processQueue();
  }

  private getOrCreateSessionId(): string {
    const stored = localStorage.getItem('analytics_session_id');
    if (stored) return stored;
    
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_session_id', newId);
    return newId;
  }

  private setupEventListeners(): void {
    // Page view tracking
    this.trackEvent('page_view', {
      referrer: document.referrer,
      title: document.title
    });

    // Scroll depth tracking
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90];
    
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        scrollThresholds.forEach(threshold => {
          if (scrollPercent >= threshold && !this.hasTracked(`scroll_${threshold}`)) {
            this.trackEvent('scroll_depth', { percent: threshold });
            this.markTracked(`scroll_${threshold}`);
          }
        });
      }
    };

    let scrollTimer: number;
    const throttledScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // Click tracking for buttons and links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      const button = target.closest('button');
      
      if (link) {
        this.trackEvent('link_click', {
          href: link.href,
          text: link.textContent?.trim(),
          isWhatsApp: link.href.includes('wa.me')
        });
      }
      
      if (button) {
        this.trackEvent('button_click', {
          text: button.textContent?.trim(),
          className: button.className,
          id: button.id
        });
      }
    });

    // Form interactions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.trackEvent('form_submit', {
        formId: form.id,
        formAction: form.action
      });
    });
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private hasTracked(key: string): boolean {
    const tracked = localStorage.getItem(`analytics_tracked_${this.sessionId}`) || '{}';
    const trackedObj = JSON.parse(tracked);
    return trackedObj[key] || false;
  }

  private markTracked(key: string): void {
    const tracked = localStorage.getItem(`analytics_tracked_${this.sessionId}`) || '{}';
    const trackedObj = JSON.parse(tracked);
    trackedObj[key] = true;
    localStorage.setItem(`analytics_tracked_${this.sessionId}`, JSON.stringify(trackedObj));
  }

  trackEvent(eventName: string, metadata: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      eventName,
      metadata,
      pagePath: window.location.pathname,
      timestamp: Date.now()
    };

    if (this.isOnline) {
      this.sendEvent(event);
    } else {
      this.queueEvent(event);
    }
  }

  private queueEvent(event: AnalyticsEvent): void {
    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift(); // Remove oldest event
    }
    
    this.queue.push({ ...event, retryCount: 0 });
    localStorage.setItem('analytics_queue', JSON.stringify(this.queue));
  }

  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];
    localStorage.removeItem('analytics_queue');

    for (const event of events) {
      try {
        await this.sendEvent(event);
      } catch (error) {
        console.error('Failed to send event:', error);
        if ((event.retryCount || 0) < this.retryAttempts) {
          this.queue.push({ ...event, retryCount: (event.retryCount || 0) + 1 });
        }
      }
    }
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-event`;
    console.log('Sending analytics event to:', url);
    console.log('Event data:', {
      session_id: this.sessionId,
      event_name: event.eventName,
      page_path: event.pagePath,
      metadata: event.metadata,
      user_agent: navigator.userAgent
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        session_id: this.sessionId,
        event_name: event.eventName,
        page_path: event.pagePath,
        metadata: event.metadata,
        user_agent: navigator.userAgent
      })
    });

    console.log('Analytics response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Analytics error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    console.log('Analytics event sent successfully');
  }
}

// Singleton instance
const analytics = new Analytics();
export default analytics;
export { analytics, AnalyticsEvent };
