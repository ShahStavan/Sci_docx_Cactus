export interface Message extends Record<string, any> {
  context: string;
  date: string;
  prompt: string;
  content: string;
  messageId: string;
}

export interface Messages extends Record<string, any> {
  messages?: Message[];
  uid: string;
}

export interface User extends Record<string, any> {
  name: string;
  uid: string;
}

export interface ConvoContexts extends Record<string, any> {
  messages?: Context[];
  uid: string;
}

export interface Context extends Record<string, any> {
  context: string;
  contextId: string;
}
