import { ENV } from "./env";

interface DailyRoom {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config: {
    exp?: number;
    enable_screenshare?: boolean;
    enable_chat?: boolean;
    enable_knocking?: boolean;
    enable_prejoin_ui?: boolean;
  };
}

interface CreateRoomOptions {
  name?: string;
  privacy?: "public" | "private";
  properties?: {
    exp?: number; // Unix timestamp for room expiration
    enable_screenshare?: boolean;
    enable_chat?: boolean;
    enable_knocking?: boolean;
    enable_prejoin_ui?: boolean;
    start_video_off?: boolean;
    start_audio_off?: boolean;
  };
}

/**
 * Create a Daily.co video room for a consultation
 */
export async function createVideoRoom(options: CreateRoomOptions = {}): Promise<DailyRoom> {
  const apiKey = ENV.dailyApiKey;
  
  if (!apiKey) {
    throw new Error("DAILY_API_KEY is not configured");
  }

  const response = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      name: options.name,
      privacy: options.privacy || "private",
      properties: {
        enable_screenshare: true,
        enable_chat: true,
        enable_knocking: false,
        enable_prejoin_ui: true,
        start_video_off: false,
        start_audio_off: false,
        ...options.properties,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Daily.co room: ${error}`);
  }

  return await response.json();
}

/**
 * Get information about an existing room
 */
export async function getVideoRoom(roomName: string): Promise<DailyRoom> {
  const apiKey = ENV.dailyApiKey;
  
  if (!apiKey) {
    throw new Error("DAILY_API_KEY is not configured");
  }

  const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Daily.co room: ${error}`);
  }

  return await response.json();
}

/**
 * Delete a video room
 */
export async function deleteVideoRoom(roomName: string): Promise<void> {
  const apiKey = ENV.dailyApiKey;
  
  if (!apiKey) {
    throw new Error("DAILY_API_KEY is not configured");
  }

  const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete Daily.co room: ${error}`);
  }
}

/**
 * Create a meeting token for a specific user (optional, for added security)
 */
export async function createMeetingToken(
  roomName: string,
  options: {
    user_name?: string;
    is_owner?: boolean;
    exp?: number;
  } = {}
): Promise<string> {
  const apiKey = ENV.dailyApiKey;
  
  if (!apiKey) {
    throw new Error("DAILY_API_KEY is not configured");
  }

  const response = await fetch("https://api.daily.co/v1/meeting-tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: options.user_name,
        is_owner: options.is_owner || false,
        exp: options.exp,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create meeting token: ${error}`);
  }

  const data = await response.json();
  return data.token;
}
