import axios from 'axios';
import { config } from '../../config/config';

/**
 * Interface for Basecamp message data
 */
export interface BasecampMessageData {
  sender: string;
  receiver: string;
  teamName: string;
  category: string;
  message: string;
}

/**
 * Service for sending messages to Basecamp
 */
export class BasecampService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = config.basecamp?.webhookUrl || '';
  }

  /**
   * Format the kudos message for Basecamp
   * @param data The message data
   * @returns Formatted HTML content
   */
  private formatMessage(data: BasecampMessageData): string {
    return `
<b>👏 Appreciation to Team</b><br><br>
<b>From:</b> 👨‍💼 ${data.sender}<br>
<b>To:</b> 👨‍💼 ${data.receiver}<br>
<b>Team:</b> 🏢 ${data.teamName}<br>
<b>Category:</b> 🏆 ${data.category}<br><br>
<b>Message:</b><br>
${data.message}<br><br>
<i>🚀 Onward and upward!</i>
`;
  }

  /**
   * Send a kudos message to Basecamp
   * @param data The message data containing sender, receiver, team, category, and message
   * @returns Promise resolving to true if successful, false otherwise
   */
  async sendKudosMessage(data: BasecampMessageData): Promise<boolean> {
    try {
      const formattedContent = this.formatMessage(data);
      
      const response = await axios.post(
        this.apiUrl,
        `content=${encodeURIComponent(formattedContent)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log('Message sent to Basecamp successfully');
        return true;
      } else {
        console.error('Failed to send message to Basecamp:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error sending message to Basecamp:', error);
      return false;
    }
  }
} 