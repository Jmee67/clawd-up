// model-map.js — Maps agent role + provider to model string

const MODEL_MAP = {
  scout: {
    anthropic: 'claude-sonnet-4-20250514',
    openai: 'gpt-4o-mini',
    google: 'gemini-2.0-flash',
  },
  researcher: {
    anthropic: 'claude-sonnet-4-20250514',
    openai: 'gpt-4o',
    google: 'gemini-2.0-pro',
  },
  operator: {
    anthropic: 'claude-opus-4-6',
    openai: 'gpt-4o',
    google: 'gemini-2.0-pro',
  },
};

function getModel(role, provider) {
  const roleMap = MODEL_MAP[role];
  if (!roleMap) throw new Error(`Unknown role: ${role}`);
  const model = roleMap[provider];
  if (!model) throw new Error(`Unknown provider: ${provider}`);
  return model;
}

module.exports = { getModel, MODEL_MAP };
