import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

interface SessionEvent {
  id: number;
  session_id: string;
  event_name: string;
  page_path: string;
  metadata: any;
  created_at: string;
}

interface SessionSummary {
  session_id: string;
  summary: any;
  intent_score: number;
  recommended_action: string;
}

class SessionSummarizer {
  private supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

  async generateSessionSummary(sessionId: string): Promise<void> {
    try {
      // Fetch events for this session
      const { data: events, error } = await this.supabase
        .from('user_events')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!events || events.length === 0) return;

      // Format event sequence
      const eventSequence = events.map(event => {
        const time = new Date(event.created_at).toLocaleTimeString();
        return `${time} - ${event.event_name} on ${event.page_path}`;
      }).join(' → ');

      // Analyze user intent with AI
      const analysis = await this.analyzeUserIntent(events, eventSequence);
      
      // Save summary
      await this.saveSummary(sessionId, analysis);

    } catch (error) {
      console.error('Failed to generate session summary:', error);
    }
  }

  private async analyzeUserIntent(events: SessionEvent[], sequence: string): Promise<{
    summary: any;
    intent_score: number;
    recommended_action: string;
  }> {
    // Calculate engagement metrics
    const pageViews = events.filter(e => e.event_name === 'page_view').length;
    const buttonClicks = events.filter(e => e.event_name === 'button_click').length;
    const formSubmissions = events.filter(e => e.event_name === 'form_submit').length;
    const scrollDepth = Math.max(...events
      .filter(e => e.event_name === 'scroll_depth')
      .map(e => e.metadata?.percent || 0));

    // Determine pages visited
    const uniquePages = [...new Set(events.map(e => e.page_path))];
    const propertyViews = uniquePages.filter(path => path.includes('/properties/')).length;
    const calculatorUsage = events.some(e => e.page_path.includes('/calculators'));

    // Calculate intent score (0-100)
    let intentScore = 0;
    
    // Base engagement
    if (pageViews > 3) intentScore += 20;
    if (buttonClicks > 5) intentScore += 15;
    if (formSubmissions > 0) intentScore += 30;
    if (scrollDepth >= 75) intentScore += 15;
    
    // Property-specific engagement
    if (propertyViews > 0) intentScore += 10;
    if (calculatorUsage) intentScore += 10;
    
    // WhatsApp clicks (high intent)
    const whatsappClicks = events.filter(e => e.metadata?.isWhatsApp).length;
    if (whatsappClicks > 0) intentScore += 25;

    intentScore = Math.min(intentScore, 100);

    // Generate AI summary
    const aiSummary = await this.generateAISummary(sequence, {
      pageViews,
      buttonClicks,
      formSubmissions,
      propertyViews,
      calculatorUsage,
      whatsappClicks,
      intentScore
    });

    return {
      summary: aiSummary,
      intent_score: intentScore,
      recommended_action: this.getRecommendedAction(intentScore, {
        propertyViews,
        formSubmissions,
        whatsappClicks,
        calculatorUsage
      })
    };
  }

  private async generateAISummary(sequence: string, metrics: any): Promise<any> {
    try {
      const prompt = `Analyze this real estate website user session and provide insights:

Event Sequence: ${sequence}

Metrics: ${JSON.stringify(metrics, null, 2)}

Provide a JSON response with:
- user_intent: Brief description of what user is looking for
- engagement_level: Low/Medium/High
- key_pages: Most important pages visited
- next_steps: Suggested actions for this user

Keep response concise and actionable.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);

    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        user_intent: 'Unknown',
        engagement_level: intentScore > 50 ? 'High' : intentScore > 25 ? 'Medium' : 'Low',
        key_pages: [],
        next_steps: []
      };
    }
  }

  private getRecommendedAction(intentScore: number, context: any): string {
    if (context.formSubmissions > 0) {
      return 'Follow up with lead via email/phone';
    }
    
    if (context.whatsappClicks > 0) {
      return 'User ready for immediate contact';
    }
    
    if (context.propertyViews > 2) {
      return 'Recommend similar properties';
    }
    
    if (context.calculatorUsage) {
      return 'Send financing options';
    }
    
    if (intentScore > 70) {
      return 'High intent - prioritize for sales team';
    }
    
    if (intentScore > 40) {
      return 'Medium intent - nurture with email campaign';
    }
    
    return 'Low intent - continue engagement';
  }

  private async saveSummary(sessionId: string, analysis: any): Promise<void> {
    const { error } = await this.supabase
      .from('session_summaries')
      .upsert({
        session_id: sessionId,
        summary: analysis.summary,
        intent_score: analysis.intent_score,
        recommended_action: analysis.recommended_action
      }, {
        onConflict: 'session_id'
      });

    if (error) {
      console.error('Failed to save summary:', error);
    }
  }

  // Public method to trigger summarization
  async summarizeRecentSessions(): Promise<void> {
    try {
      // Get sessions without summaries from last 15 minutes
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      
      const { data: sessions, error } = await this.supabase
        .from('user_events')
        .select('session_id')
        .lt('created_at', fifteenMinutesAgo)
        .is('session_id', 'in', 
          `(select session_id from session_summaries)`
        );

      if (error) throw error;
      if (!sessions) return;

      // Process each unique session
      const uniqueSessions = [...new Set(sessions.map(s => s.session_id))];
      
      for (const sessionId of uniqueSessions) {
        await this.generateSessionSummary(sessionId);
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error('Failed to summarize recent sessions:', error);
    }
  }
}

export const sessionSummarizer = new SessionSummarizer();
export default sessionSummarizer;
