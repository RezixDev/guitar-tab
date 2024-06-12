export const getAudioContext = (): AudioContext => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};
