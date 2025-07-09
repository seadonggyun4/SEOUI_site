// messenger-content.ts
export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface MessengerSection {
  heading?: string;
  subheading?: string;
  content: string[];
  strongTexts?: string[];
  hasButtons?: boolean;
  buttons?: ButtonItem[];
  hasMessages?: boolean;
  messages?: ChatMessage[];
}

export interface ButtonItem {
  text: string;
  action: string;
  type: 'primary' | 'secondary';
}

export interface MenuLabels {
  en: string;
  zh: string;
}

export interface MessengerTabContent {
  title: string;
  sections: MessengerSection[];
}

export interface MessengerContentData {
  tabContents: {
    [key: string]: MessengerTabContent;
  };
  menu: MenuLabels;
}

export const messengerContentData: { [key: string]: MessengerContentData } = {
  en: {
    tabContents: {
      chat: {
        title: "Live Chat",
        sections: [
          {
            heading: "Customer Support Chat",
            content: [
              "Chat with our customer service team for immediate assistance.",
              "Available 08:00 - 19:00 (Korea Time)"
            ],
            strongTexts: ["Available 08:00 - 19:00 (Korea Time)"],
            hasMessages: true,
            messages: [
              {
                id: "1",
                sender: "admin",
                message: "Hello! Welcome to Angelcar customer support. How can I help you today?",
                timestamp: "10:30",
                isRead: true
              },
              {
                id: "2",
                sender: "user",
                message: "Hi, I have a question about my reservation.",
                timestamp: "10:32",
                isRead: true
              },
              {
                id: "3",
                sender: "admin",
                message: "I'd be happy to help! Could you please provide your reservation number?",
                timestamp: "10:33",
                isRead: true
              }
            ]
          },
          {
            content: [
              "Quick Actions"
            ],
            hasButtons: true,
            buttons: [
              {
                text: "Check Reservation",
                action: "reservation",
                type: "primary"
              },
              {
                text: "Report Issue",
                action: "issue",
                type: "secondary"
              },
              {
                text: "Change Booking",
                action: "change",
                type: "secondary"
              },
              {
                text: "Emergency Help",
                action: "emergency",
                type: "primary"
              }
            ]
          }
        ]
      }
    },
    menu: {
      en: 'English',
      zh: 'Chinese'
    }
  },
  zh: {
    tabContents: {
      chat: {
        title: "即時聊天",
        sections: [
          {
            heading: "客戶支援聊天",
            content: [
              "與我們的客服團隊聊天以獲得即時協助。",
              "服務時間 08:00 - 19:00 (韓國時間)"
            ],
            strongTexts: ["服務時間 08:00 - 19:00 (韓國時間)"],
            hasMessages: true,
            messages: [
              {
                id: "1",
                sender: "admin",
                message: "您好！歡迎來到天使租車客戶支援。今天我可以為您做些什麼？",
                timestamp: "10:30",
                isRead: true
              },
              {
                id: "2",
                sender: "user",
                message: "您好，我對我的預訂有問題。",
                timestamp: "10:32",
                isRead: true
              },
              {
                id: "3",
                sender: "admin",
                message: "我很樂意幫助您！請您提供您的預訂號碼好嗎？",
                timestamp: "10:33",
                isRead: true
              }
            ]
          },
          {
            content: [
              "快速操作"
            ],
            hasButtons: true,
            buttons: [
              {
                text: "查詢預訂",
                action: "reservation",
                type: "primary"
              },
              {
                text: "回報問題",
                action: "issue",
                type: "secondary"
              },
              {
                text: "變更預訂",
                action: "change",
                type: "secondary"
              },
              {
                text: "緊急協助",
                action: "emergency",
                type: "primary"
              }
            ]
          }
        ]
      }
    },
    menu: {
      en: '英語',
      zh: '中文'
    }
  }
};