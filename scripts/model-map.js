'use strict';

// Maps agent roles to recommended models per provider
const MODEL_MAP = {
  anthropic: {
    scout: 'anthropic/claude-sonnet-4-6',
    researcher: 'anthropic/claude-sonnet-4-6',
    operator: 'anthropic/claude-sonnet-4-6',
  },
  openai: {
    scout: 'openai/gpt-4o',
    researcher: 'openai/gpt-4o',
    operator: 'openai/gpt-4o',
  },
  google: {
    scout: 'google/gemini-2.5-pro',
    researcher: 'google/gemini-2.5-pro',
    operator: 'google/gemini-2.5-pro',
  },
};

function getModel(role, provider) {
  const providerMap = MODEL_MAP[provider] || MODEL_MAP.anthropic;
  return providerMap[role] || providerMap.operator;
}

module.exports = { getModel, MODEL_MAP };
