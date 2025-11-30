const dayKeywords = {
  today: 0,
  tomorrow: 1,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
};

const keywordTitles = ['meeting', 'call', 'discussion'];

const formatDate = (date) => date.toISOString().split('T')[0];

const getNextWeekday = (weekdayIndex) => {
  const today = new Date();
  const dayDiff = (weekdayIndex + 7 - today.getDay()) % 7 || 7;
  today.setDate(today.getDate() + dayDiff);
  return formatDate(today);
};

const detectDate = (text) => {
  const tokens = text.split(/\s+/);
  for (const token of tokens) {
    const cleaned = token.replace(/[^a-z]/gi, '').toLowerCase();
    if (!cleaned) continue;
    if (cleaned === 'today') {
      return formatDate(new Date());
    }
    if (cleaned === 'tomorrow') {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return formatDate(d);
    }
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const weekdayIndex = weekdays.indexOf(cleaned);
    if (weekdayIndex !== -1) {
      return getNextWeekday(weekdayIndex);
    }
  }
  return undefined;
};

const detectTime = (text) => {
  const timeRegex = /(\b\d{1,2})(?::(\d{2}))?\s?(am|pm)?\b|\b([01]?\d|2[0-3]):([0-5]\d)\b/i;
  const match = text.match(timeRegex);
  if (!match) return undefined;

  if (match[4]) {
    return `${match[4].padStart(2, '0')}:${match[5]}`;
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2] || '00';
  const meridiem = match[3];

  if (meridiem) {
    const lowerMeridiem = meridiem.toLowerCase();
    if (lowerMeridiem === 'pm' && hours < 12) {
      hours += 12;
    } else if (lowerMeridiem === 'am' && hours === 12) {
      hours = 0;
    }
  }

  hours = hours % 24;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const detectTitle = (text) => {
  const lowerText = text.toLowerCase();
  for (const keyword of keywordTitles) {
    if (lowerText.includes(keyword)) {
      return `Upcoming ${keyword}`;
    }
  }
  return 'Event from Telegram';
};

const inferConfidence = ({ date, time }) => {
  if (date && time) return 'medium';
  if (date || time) return 'low';
  return 'low';
};

const extractEvent = (messageText) => {
  const text = messageText || '';
  const date = detectDate(text);
  const time = detectTime(text);
  const title = detectTitle(text);
  const confidence = inferConfidence({ date, time });

  return {
    title,
    date,
    time,
    confidence,
  };
};

module.exports = {
  extractEvent,
};
